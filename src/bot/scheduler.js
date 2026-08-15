import dayjs from "dayjs"
import { prisma } from "../db.ts"
import { DiscordRequest } from "./discord.js"
import { expireCodes, getTimers } from "./code.js"

const MIN_CHECK_DELAY_MS = 1000
const MAX_CHECK_DELAY_MS = 60 * 60 * 1000 // fallback poll interval in case a next event can't be determined

export const addCodeMessageSchedule = async (schedule) => {
	const existing = await prisma.code.findFirst({
		where: {
			type: schedule.duration,
			code: schedule.code,
			expireAt: getTimers(schedule.duration).expireAt,
		},
	})

	console.log("existing code entry:", existing)

	let result
	if (existing) {
		// If a code with the same type, code, and content already exists, we can just add a new message to it
		result = await prisma.codeMessage.create({
			data: {
				codeId: existing.id,
				channelId: schedule.channelId,
				messageId: schedule.messageId,
				addedBy: schedule.sentBy,
			},
		})
	} else {
		// Otherwise, create a new code entry with the associated message
		result = await prisma.code.create({
			data: {
				type: schedule.duration,
				...getTimers(schedule.duration),
				code: schedule.code,
				content: schedule.content,
				codeMessages: {
					create: [
						{
							channelId: schedule.channelId,
							messageId: schedule.messageId,
							addedBy: schedule.sentBy,
						},
					],
				},
			},
		})
	}

	wakeScheduler()
	return result
}

let isProcessingCodeMessageSchedules = false

export const processCodeMessageSchedules = async () => {
	if (isProcessingCodeMessageSchedules) {
		return
	}

	isProcessingCodeMessageSchedules = true

	try {
		const now = dayjs().toDate()
		const pendingExpiry = await prisma.code.findMany({
			where: {
				AND: {
					expireAt: {
						lte: now,
					},
					expired: false,
				},
			},
			include: {
				codeMessages: true,
			},
		})
		const pendingDelete = await prisma.code.findMany({
			where: {
				AND: {
					deleteAt: {
						lte: now,
					},
					expired: true,
					codeMessages: {
						some: {
							removed: false,
						},
					},
				},
			},
			include: {
				codeMessages: true,
			},
		})

		for (const pending of pendingExpiry) {
			let success = 0
			for (const message of pending.codeMessages) {
				try {
					await DiscordRequest(`channels/${message.channelId}/messages/${message.messageId}`, {
						method: "PATCH",
						body: {
							content: expireCodes(pending.content),
						},
					})

					await prisma.code.update({
						where: { id: pending.id },
						data: {
							expired: true,
						},
					})
					success++
				} catch (error) {
					console.error("failed to strike code message", error)
					await prisma.codeMessage.update({
						where: { id: message.id },
						data: {
							removed: true,
						},
					})
				}
			}
			console.log(`expired code ID ${pending.id} (${success}/${pending.codeMessages.length} messages)`)
		}

		for (const pending of pendingDelete) {
			let success = 0
			const messages = pending.codeMessages.filter((msg) => !msg.removed)
			for (const message of messages) {
				try {
					await DiscordRequest(`channels/${message.channelId}/messages/${message.messageId}`, {
						method: "DELETE",
					})

					await prisma.codeMessage.update({
						where: { id: message.id },
						data: {
							removed: true,
						},
					})
					success++
				} catch (error) {
					console.error("failed to delete code message", error)
					await prisma.codeMessage.update({
						where: { id: message.id },
						data: {
							removed: true,
						},
					})
				}
			}
			console.log(`deleted code ID ${pending.id} (${success}/${messages.length} messages - ${pending.codeMessages.length - messages.length} already removed)`)
		}
	} catch (error) {
		console.error("failed to process code message schedules", error)
	} finally {
		isProcessingCodeMessageSchedules = false
	}
}

let scheduledTimer = null

// Finds the soonest still-pending expiry/delete moment across all codes.
const getNextEventAt = async () => {
	const [nextExpiry, nextDelete] = await Promise.all([
		prisma.code.findFirst({
			where: { expired: false, expireAt: { not: null } },
			orderBy: { expireAt: "asc" },
			select: { expireAt: true },
		}),
		prisma.code.findFirst({
			where: {
				expired: true,
				deleteAt: { not: null },
				codeMessages: { some: { removed: false } },
			},
			orderBy: { deleteAt: "asc" },
			select: { deleteAt: true },
		}),
	])

	const candidates = [nextExpiry?.expireAt, nextDelete?.deleteAt].filter(Boolean)
	if (candidates.length === 0) {
		return null
	}
	return candidates.reduce((earliest, date) => (date < earliest ? date : earliest))
}

const scheduleNext = (delayMs) => {
	if (scheduledTimer) {
		clearTimeout(scheduledTimer)
	}
	scheduledTimer = setTimeout(runAndReschedule, delayMs)
}

const runAndReschedule = async () => {
	let delay = MAX_CHECK_DELAY_MS
	try {
		await processCodeMessageSchedules()
		const nextEventAt = await getNextEventAt()
		if (nextEventAt) {
			delay = Math.min(Math.max(dayjs(nextEventAt).diff(dayjs()), MIN_CHECK_DELAY_MS), MAX_CHECK_DELAY_MS)
		}
	} catch (error) {
		console.error("failed to determine next schedule check", error)
	} finally {
		scheduleNext(delay)
	}
}

// Cancels any pending wake-up and immediately re-evaluates when the next check should run.
export const wakeScheduler = () => {
	runAndReschedule()
}
