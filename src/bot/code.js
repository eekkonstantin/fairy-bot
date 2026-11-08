import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Singapore")

const getTime = (key) => {
	const now = dayjs().tz("Asia/Singapore")
	const daily = now.hour(14).minute(0).second(0).millisecond(0)
	switch (key) {
		case "1":
			return {
				expire: now.hour(13).minute(0).second(0).millisecond(0),
				delete: daily,
			}
		case "2":
			return {
				expire: now.hour(10).minute(0).second(0).millisecond(0),
				delete: daily,
			}
		case "3":
			return {
				expire: now.hour(11).minute(30).second(0).millisecond(0),
				delete: daily,
			}
		case "4":
			return {
				expire: now.hour(12).minute(15).second(0).millisecond(0),
				delete: daily,
			}
		default:
			return {
				expire: now.add(40, "second"),
				delete: now.add(1, "minute"),
			}
	}
}

export const getTimers = (duration) => {
	const now = dayjs().tz("Asia/Singapore")
	if (duration === "week")
		return {
			expireAt: now.day(0).hour(23).minute(59).second(0).millisecond(0).add(1, "week").toDate(),
			deleteAt: now.day(1).hour(12).minute(0).second(0).millisecond(0).add(1, "week").toDate(),
		}

	const { expire, delete: del } = getTime(duration)

	return {
		expireAt: expire.toDate(),
		deleteAt: del.toDate(),
	}
}

export const splitCodes = (codeArr) => `\`${codeArr.join("`\n`")}\``

export const getMessage = (code, duration) => {
	const now = dayjs().tz("Asia/Singapore")
	switch (duration) {
		case "test": {
			const testExpiry = getTime("test").expire.unix()
			return `TESTING CODE (expires <t:${testExpiry}:f>):\n\n\`${code}\``
		}
		case "1":
			return `1st code (expires <t:${getTime("1").expire.unix()}:f>):\n\n\`${code}\``
		case "2":
			return `2nd code (expires <t:${getTime("2").expire.unix()}:f>):\n\n\`${code}\``
		case "3":
			return `3rd code (expires <t:${getTime("3").expire.unix()}:f>):\n\n\`${code}\``
		case "4":
			return `4th code (expires <t:${getTime("4").expire.unix()}:f>):\n\n\`${code}\``
		case "week": {
			const exp = now.day(0).hour(23).minute(59).add(1, "week")

			return `WEEKLY CODE (expires <t:${exp.unix()}:F>):\n\n\`${code}\``
		}
		default: {
			const codes = code.split(" ")
			const plural = codes.length > 1 ? "S" : ""

			return `NEW REDEEMABLE CODE${plural} *(unknown expiry)*:\n\n${splitCodes(codes)}`
		}
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
