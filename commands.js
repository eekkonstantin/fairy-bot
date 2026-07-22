import "dotenv/config"
import { InstallGlobalCommands } from "./utils/index.js"

const CODE_COMMAND = {
	name: "code",
	description: "Post weekly/daily code message",
	type: 1,
	integration_types: [0],
	contexts: [0],
	options: [
		{
			type: 3,
			name: "duration",
			description: "Code type (week|1|2|3|4); leave blank for permanent codes",
			choices: [
				{ name: "Weekly", value: "week" },
				{ name: "1st", value: "1" },
				{ name: "2nd", value: "2" },
				{ name: "3rd", value: "3" },
				{ name: "4th", value: "4" },
				{ name: "Permanent/Long-term", value: "permanent" },
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

const ALL_COMMANDS = [CODE_COMMAND]

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS)
