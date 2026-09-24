import { InteractionResponseFlags, InteractionResponseType, InteractionType, MessageComponentTypes, verifyKeyMiddleware } from "discord-interactions"
import "dotenv/config"
import express from "express"
import { getMessage } from "./bot/code.js"
import { DiscordRequest } from "./bot/discord.js"
import { fairyWho, markDone } from "./bot/fairy.js"
import { addCodeMessageSchedule, wakeScheduler } from "./bot/scheduler.js"

// Create an express app
const app = express()
// Get port, or default to 3000
const PORT = process.env.PORT || 3000

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post(
	"/interactions",
	// verifyKeyMiddleware is silent on both success and failure, so log arrival here to confirm requests reach the app at all
	(_req, _res, next) => {
		next()
	},
	verifyKeyMiddleware(process.env.DISCORD_APP_PUBLIC_KEY),
	async (req, res) => {
		// Interaction id, type and data
		const { type, data, member, user } = req.body
		const caller = member?.user || user

		/**
		 * Handle verification requests
		 */
		if (type === InteractionType.PING) {
			return res.send({ type: InteractionResponseType.PONG })
		}

		/**
		 * Handle slash command requests
		 * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
		 */
		if (type === InteractionType.APPLICATION_COMMAND) {
			const { name, options } = data
			console.log("code command received", data)

			if (name === "code") {
				const optionsMap = new Map(options.map((opt) => [opt.name, opt.value]))

				const targetChannelId = optionsMap.get("channel") || req.body.channel_id
				const messageDuration = optionsMap.get("duration")
				const code = optionsMap.get("code")
				const messageContent = getMessage(code, messageDuration)

				res.send({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						flags: InteractionResponseFlags.EPHEMERAL | InteractionResponseFlags.IS_COMPONENTS_V2,
						components: [
							{
								type: MessageComponentTypes.TEXT_DISPLAY,
								content: `Posting code(s) \`${code}\` in <#${targetChannelId}>...`,
							},
						],
					},
				})

				try {
					const response = await DiscordRequest(`channels/${targetChannelId}/messages`, {
						method: "POST",
						body: {
							content: messageContent,
						},
					})
					const createdMessage = await response.json()

					if (messageDuration !== "permanent") {
						const result = await addCodeMessageSchedule({
							duration: messageDuration,
							code,
							channelId: targetChannelId,
							messageId: createdMessage.id,
							content: messageContent,
							sentBy: caller.id,
						})
						console.log("added code message schedule id:", result.id)
					}
				} catch (error) {
					console.error("failed to post code message", error)
				}

				return
			}

			if (name === "fairy") {
				const subcommand = options[0]
				const subcommandName = subcommand?.name
				const optionsMap = new Map(subcommand?.options.map((opt) => [opt.name, opt.value]))

				if (subcommandName === "maxed") {
					const user = optionsMap.get("sub") || caller.id
					const thankUser = optionsMap.get("thank")

					markDone(user)
					if (thankUser) {
						// Optionally handle thanking the user here
						res.send({
							type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
							data: {
								content: `<@${user}> is maxed for today! Thanks <@${thankUser}>!`,
							},
						})
					}
					return
				} else if (subcommandName === "who") {
					const serverId = req.body.guild_id
					const usersInServer = await fairyWho(serverId)
					return res.send({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: {
							content: `Users in server: ${JSON.stringify(usersInServer)}`,
						},
					})
				} else if (subcommandName === "run") {
					// Announcing a fairy run here
					const user = optionsMap.get("host") || caller.id
					markDone(user, true)
					return res.send({
						type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
						data: {
							content: `Fairy run by <@${user}>${optionsMap.get("note") ? `: ${optionsMap.get("note")}` : ""}.`,
						},
					})
				}
			}

			console.error(`unknown command: ${name}`)
			return res.status(400).json({ error: "unknown command" })
		}

		console.error("unknown interaction type", type)
		return res.status(400).json({ error: "unknown interaction type" })
	},
)

wakeScheduler()

app.listen(PORT, () => {
	console.log("Listening on port", PORT)
})
