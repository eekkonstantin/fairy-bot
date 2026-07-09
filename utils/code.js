import dayjs from "dayjs"

export const getTimers = (duration) => {
	const daily = dayjs().hour(12).minute(30).second(0).millisecond(0).unix()
	switch (duration) {
		case "1":
			return {
				expireAt: dayjs().hour(12).minute(0).second(0).millisecond(0).unix(),
				deleteAt: daily,
			}
		case "2":
			return {
				expireAt: dayjs().hour(9).minute(0).second(0).millisecond(0).unix(),
				deleteAt: daily,
			}
		case "3":
			return {
				expireAt: dayjs().hour(10).minute(30).second(0).millisecond(0).unix(),
				deleteAt: daily,
			}
		case "4":
			return {
				expireAt: dayjs().hour(11).minute(45).second(0).millisecond(0).unix(),
				deleteAt: daily,
			}
		case "week":
			return {
				expireAt: dayjs().day(0).hour(23).minute(59).second(0).millisecond(0).unix(),
				deleteAt: dayjs().day(1).hour(12).minute(0).second(0).millisecond(0).unix(),
			}
		default:
			return {}
	}
}

export const splitCodes = (codeArr) => "\`" + codeArr.join("\`\n\`") + "\`"

export const getMessage = (code, duration) => {
	switch (duration) {
		case "1":
			return `1st code (expires <t:${dayjs().hour(12).minute(0).unix()}:f>):\n\n\`${code}\``
		case "2":
			return `2nd code (expires <t:${dayjs().hour(9).minute(0).unix()}:f>):\n\n\`${code}\``
		case "3":
			return `3rd code (expires <t:${dayjs().hour(10).minute(30).unix()}:f>):\n\n\`${code}\``
		case "4":
			return `4th code (expires <t:${dayjs().hour(11).minute(45).unix()}:f>):\n\n\`${code}\``
		case "week":
			const exp = dayjs().day(0).hour(23).minute(59)

			return `WEEKLY CODE (expires <t:${exp.unix()}:F>):\n\n\`${code}\``
		default:
			const codes = code.split(" ")
			const plural = codes.length > 1 ? "S" : ""

			return `NEW REDEEMABLE CODE${plural} *(unknown expiry)*:\n\n${splitCodes(codes)}`
	}
}

export const expireCodes = (content) => {
	return (
		content
			.split("\n")
			.map((line) => (line ? `~~${line}~~` : line))
			.join("\n") + " *EXPIRED*"
	)
}
