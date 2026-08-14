import "dotenv/config"
import { InstallGlobalCommands } from "./discord.js"

const CODE_COMMAND = {
	name: "code",
	description: "Post weekly/daily code message",
	type: 1,
	integration_types: [0, 1],
	contexts: [0],
	options: [
		{
			type: 3,
			name: "duration",
			description: "Code type (weekly/1st/2nd/3rd/4th); leave blank for permanent codes",
			choices: [
				{ name: "Weekly", value: "week" },
				{ name: "1st", value: "1" },
				{ name: "2nd", value: "2" },
				{ name: "3rd", value: "3" },
				{ name: "4th", value: "4" },
				{ name: "Permanent/Long-term", value: "permanent" },
				{ name: "TESTING ONLY", value: "test" },
			],
			required: true,
		},
		{
			type: 3,
			name: "code",
			description: "The code to post",
			required: true,
		},
		{
			type: 7,
			name: "channel",
			description: "The channel to post the code in; leave blank for current channel",
		},
	],
}

const FAIRY_COMMANDS = {
	name: "fairy",
	description: "Fairy commands",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1],
	options: [
		{
			type: 1,
			name: "maxed",
			description: "Describes yourself as maxed fairy picks for the day.",
			options: [
				{
					type: 5,
					name: "announce",
					description: "Announces this to the current channel.",
				},
				{
					type: 9,
					name: "thank",
					description: '(Optional) Include a "Thank you!" to a user',
				},
			],
		},
		{
			type: 1,
			name: "who",
			description: "Check who in the current channel has not maxed fairy picks for the day.",
		},
		{
			type: 1,
			name: "run",
			description: "Announce a fairy run in the current channel. NOTE: This will tag @everyone by default.",
			options: [
				{
					type: 5,
					name: "not-done-only",
					description: "Only tag those who have not maxed fairy picks for the day.",
				},
			],
		},
		{
			type: 1,
			name: "settings", // provides the url to frontend settings page for the bot
			description: "Configure fairy run and other settings.",
		},
	],
}

const GCOMP_COMMANDS = {
	name: "gcomp",
	description: "Utilities for GComp",
	type: 1,
	integration_types: [0],
	contexts: [0],
	options: [
		{
			type: 1,
			name: "yeet",
			description: "Check what flower tasks are safe to remove from the board.",
			options: [
				{
					type: 3,
					name: "flower",
					description: "Check a specific flower task. Leave blank to check all flower tasks.",
					autocomplete: true,
				},
				{
					type: 5,
					name: "announce",
					description: "Announces this to the current channel.",
				},
			],
		},
		{
			type: 2,
			name: "goals",
			description: "Set or review flowers and goals for the current GComp.",
			options: [
				{
					type: 1,
					name: "level",
					description: "Set flower point levels you will be doing",
					options: [
						{
							type: 5,
							name: "14",
							description: "You will work on 14-point flowers.",
						},
						{
							type: 5,
							name: "21",
							description: "You will work on 21-point flowers.",
						},
						{
							type: 5,
							name: "23",
							description: "You will work on 23-point flowers.",
						},
						{
							type: 5,
							name: "25",
							description: "You will work on 25-point flowers.",
						},
						{
							type: 5,
							name: "28",
							description: "You will work on 28-point flowers.",
						},
						{
							type: 5,
							name: "30",
							description: "You will work on 30-point flowers.",
						},
					],
				},
				{
					type: 1,
					name: "tasks",
					description: "Set the number of tasks you will be doing for the current GComp.",
					options: [
						{
							type: 10,
							name: "count",
							description: "The number of tasks you will be doing for the current GComp.",
							required: true,
							choices: [
								{ name: "18", value: 18 },
								{ name: "24", value: 24 },
							],
						},
					],
				},
				{
					type: 1,
					name: "add",
					description: "Add a flower to your goals for the current GComp.",
					options: [
						{
							type: 3,
							name: "flower",
							description: "The flower to add to your goals.",
							autocomplete: true,
						},
					],
				},
				{
					type: 1,
					name: "list",
					description: "View the goals you have set for the current GComp.",
				},
			],
		},
		{
			type: 1,
			name: "completed",
			description: "Mark yourself as having finished your tasks for the current GComp.",
		},
		{
			type: 1,
			name: "status",
			description: "Check the task completion status of members in the current channel.",
		},
		{
			type: 1,
			name: "settings", // provides the url to frontend settings page for the bot
			description: "Configure GComp and other settings.",
		},
	],
}

const FLOWER_COMMANDS = {
	name: "flowers",
	description: "Flower commands",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1],
	options: [
		{
			type: 1,
			name: "owned",
			description: "Check what flowers you have marked as owning.",
		},
		{
			type: 1,
			name: "add",
			description: "Add a flower to your owned list.",
			options: [
				{
					type: 3,
					name: "flower",
					description: "The flower to add.",
					autocomplete: true,
				},
			],
		},
	],
}

const ALL_COMMANDS = [CODE_COMMAND, FAIRY_COMMANDS, GCOMP_COMMANDS, FLOWER_COMMANDS]

InstallGlobalCommands(process.env.DISCORD_APP_ID, ALL_COMMANDS)
// `npm run register` to update commands
