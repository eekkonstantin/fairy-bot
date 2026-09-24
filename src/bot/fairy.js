import dayjs from "dayjs"
import { prisma } from "../db.js"

export const markDone = async (userId, isRunning) => {
	// mark the user as having completed their fairy picks for the day
	console.log(`Marking user ${userId} as done with fairy ${isRunning ? "run" : "picks"} for the day.`)

	const existing = await prisma.user.findFirst({
		where: {
			discordId: userId,
		},
	})
	if (existing) {
		await prisma.user.update({
			where: {
				id: existing.id,
			},
			data: {
				[`last${isRunning ? "Run" : "Maxed"}`]: new Date(),
			},
		})
	} else {
		console.log(`User ${userId} not found. Creating record...`)
		const findUser = await fetch(`https://discord.com/api/users/${userId}`, {
			headers: {
				Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
			},
		})
		const userData = await findUser.json()
		console.log("Fetched user data from Discord:", userData)
		await prisma.user.create({
			data: {
				discordId: userId,
				username: userData.username,
				avatar: userData.avatar,
				[`last${isRunning ? "Run" : "Maxed"}`]: new Date(),
			},
		})
	}
}

export const fairyWho = async (serverId) => {
	// check who in the current channel has maxed fairy picks for the day
	console.log(`Checking who in server has maxed fairy picks for the day.`)

	const usersInServer = await fetch(`https://discord.com/api/v10/guilds/${serverId}/members?limit=1000`, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
		},
	})
	const serverUsersData = await usersInServer.json()
	const allMaxedUsers = await prisma.user.findMany({
		where: {
			lastMaxed: {
				gte: dayjs().startOf("day").toDate(),
			},
		},
	})
	const allMaxedUserIds = new Set(allMaxedUsers.map((user) => user.discordId))
	const maxedUsers = serverUsersData.filter((user) => allMaxedUserIds.has(user.user.id))
	return maxedUsers.map((user) => user.user.id)
}
