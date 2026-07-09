import { readFile, writeFile } from "node:fs/promises"
import dayjs from "dayjs"
import { DiscordRequest, isUnknownMessageError } from "./discord.js"
import { expireCodes } from "./code.js"

const CODE_MESSAGE_SCHEDULES_PATH = new URL("../data/code-message-schedules.json", import.meta.url)

const readCodeMessageSchedules = async () => {
	try {
		const fileContent = await readFile(CODE_MESSAGE_SCHEDULES_PATH, "utf8")

		return JSON.parse(fileContent)
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
			return []
		}

		throw error
	}
}

const writeCodeMessageSchedules = async (schedules) => {
	await writeFile(CODE_MESSAGE_SCHEDULES_PATH, JSON.stringify(schedules, null, 2) + "\n")
}

export const addCodeMessageSchedule = async (schedule) => {
	const schedules = await readCodeMessageSchedules()

	schedules.push(schedule)
	await writeCodeMessageSchedules(schedules)
}

let isProcessingCodeMessageSchedules = false

export const processCodeMessageSchedules = async () => {
	if (isProcessingCodeMessageSchedules) {
		return
	}

	isProcessingCodeMessageSchedules = true

	try {
		const now = dayjs().unix()
		const schedules = await readCodeMessageSchedules()
		const nextSchedules = []

		for (const schedule of schedules) {
			let shouldKeep = true
			let hasExpired = schedule.expired

			if (!hasExpired && schedule.expireAt <= now) {
				try {
					await DiscordRequest(`channels/${schedule.channelId}/messages/${schedule.messageId}`, {
						method: "PATCH",
						body: {
							content: expireCodes(schedule.content),
						},
					})
					hasExpired = true
				} catch (error) {
					if (isUnknownMessageError(error)) {
						shouldKeep = false
					} else {
						console.error("failed to strike code message", error)
					}
				}
			}

			if (shouldKeep && schedule.deleteAt <= now) {
				try {
					await DiscordRequest(`channels/${schedule.channelId}/messages/${schedule.messageId}`, {
						method: "DELETE",
					})
					shouldKeep = false
				} catch (error) {
					if (isUnknownMessageError(error)) {
						shouldKeep = false
					} else {
						console.error("failed to delete code message", error)
					}
				}
			}

			if (shouldKeep) {
				nextSchedules.push({
					...schedule,
					expired: hasExpired,
				})
			}
		}

		await writeCodeMessageSchedules(nextSchedules)
	} catch (error) {
		console.error("failed to process code message schedules", error)
	} finally {
		isProcessingCodeMessageSchedules = false
	}
}
