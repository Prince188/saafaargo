// Rides are created with India time (IST, UTC+05:30). On Render the server
// clock is UTC, so building a Date from date+time with server-local fields
// would shift every departure by 5h30m. Instead we build an ISO string with
// the +05:30 offset, which is timezone-independent.
const IST_OFFSET = "+05:30";

// `dateStr` is "YYYY-MM-DD" (or an ISO string), `timeStr` is "HH:mm" or
// "HH:mm AM/PM". Returns a Date for the departure in IST, or null when the
// input can't be parsed.
const buildDepartureDate = (dateStr, timeStr) => {
    if (!dateStr) return null;

    if (timeStr && timeStr.includes(":")) {
        const timeParts = timeStr.trim().split(" ");
        const [hhRaw, mmRaw] = timeParts[0].split(":").map(Number);
        let hours = hhRaw;
        const modifier = timeParts[1]?.toUpperCase();
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        const minutes = mmRaw || 0;

        const ymd = /^\d{4}-\d{2}-\d{2}/.test(dateStr)
            ? dateStr.slice(0, 10)
            : new Date(dateStr).toISOString().slice(0, 10);
        const hh = String(hours).padStart(2, "0");
        const mm = String(minutes).padStart(2, "0");
        return new Date(`${ymd}T${hh}:${mm}:00${IST_OFFSET}`);
    }

    return new Date(dateStr);
};

module.exports = { buildDepartureDate, IST_OFFSET };
