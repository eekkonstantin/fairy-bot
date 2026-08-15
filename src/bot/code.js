import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Singapore")

export const getTimers = (duration) => {
	const now = dayjs().tz("Asia/Singapore")
	const daily = now.hour(23).minute(59).second(0).millisecond(0).toDate()
	switch (duration) {
		case "test":
			return {
				expireAt: now.add(40, "second").toDate(),
				deleteAt: now.add(1, "minute").toDate(),
			}
		case "1":
			return {
				expireAt: now.hour(22).minute(0).second(0).millisecond(0).toDate(),
				deleteAt: daily,
			}
		case "2":
			return {
				expireAt: now.hour(19).minute(0).second(0).millisecond(0).toDate(),
				deleteAt: daily,
			}
		case "3":
			return {
				expireAt: now.hour(20).minute(30).second(0).millisecond(0).toDate(),
				deleteAt: daily,
			}
		case "4":
			return {
				expireAt: now.hour(21).minute(45).second(0).millisecond(0).toDate(),
				deleteAt: daily,
			}
		case "week":
			return {
				expireAt: now.day(0).hour(23).minute(59).second(0).millisecond(0).add(1, "week").toDate(),
				deleteAt: now.day(1).hour(12).minute(0).second(0).millisecond(0).add(1, "week").toDate(),
			}
		default:
			return {}
	}
}

export const splitCodes = (codeArr) => "\`" + codeArr.join("\`\n\`") + "\`"

export const getMessage = (code, duration) => {
	const now = dayjs().tz("Asia/Singapore")
	switch (duration) {
		case "test": {
			const testExpiry = now.add(40, "seconds").unix()
			return `TESTING CODE (expires <t:${testExpiry}:f>):\n\n\`${code}\``
		}
		case "1":
			return `1st code (expires <t:${now.hour(22).minute(0).unix()}:f>):\n\n\`${code}\``
		case "2":
			return `2nd code (expires <t:${now.hour(19).minute(0).unix()}:f>):\n\n\`${code}\``
		case "3":
			return `3rd code (expires <t:${now.hour(20).minute(30).unix()}:f>):\n\n\`${code}\``
		case "4":
			return `4th code (expires <t:${now.hour(21).minute(45).unix()}:f>):\n\n\`${code}\``
		case "week":
			const exp = now.day(0).hour(23).minute(59).add(1, "week")

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
