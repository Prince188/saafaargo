const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const { notifyUser } = require("./fcm");

const REMINDER_WINDOW_MS = 30 * 60 * 1000; // 30 minutes before departure
const TICK_MS = 60 * 1000;                 // check every minute
const TYPE = "ride_departure_reminder";

const placeName = (p) => {
    if (!p) return "";
    const obj = (typeof p.toObject === "function") ? p.toObject() : p;
    return (obj && typeof obj === "object") ? (obj.displayName || obj.address || obj.name || "") : String(obj || "");
};

// Build the departure Date from the stored string `date` ("YYYY-MM-DD" or ISO)
// and `time` ("HH:mm" or "HH:mm AM/PM", 24h otherwise).
const getDepartureDate = (ride) => {
    const dateStr = ride.date;
    const timeStr = ride.time;
    if (!dateStr) return null;

    if (timeStr && timeStr.includes(":")) {
        const timeParts = timeStr.trim().split(" ");
        const [hhRaw, mmRaw] = timeParts[0].split(":").map(Number);
        let hours = hhRaw;
        const modifier = timeParts[1]?.toUpperCase();
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        const base = new Date(dateStr);
        return new Date(
            base.getFullYear(),
            base.getMonth(),
            base.getDate(),
            hours,
            mmRaw || 0,
            0,
            0
        );
    }
    return new Date(dateStr);
};

const formatDepartureTime = (dep) =>
    dep.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Send the reminder for one ride. `dryRun` only logs what would be sent.
const sendForRide = async (ride, dryRun) => {
    const dep = getDepartureDate(ride);
    if (!dep) return;
    const msUntil = dep.getTime() - Date.now();
    if (msUntil <= 0 || msUntil > REMINDER_WINDOW_MS) return;

    const pu = placeName(ride.pickup);
    const de = placeName(ride.destination);
    const depTime = formatDepartureTime(dep);

    if (dryRun) {
        console.log(
            `[departureReminder][DRY] ride=${ride._id} departs ${dep.toISOString()} (~${Math.round(msUntil / 60000)} min) from "${pu}" to "${de}"`
        );
        return;
    }

    // Mark first so a crash/restart can never double-send for this ride.
    ride.departureReminderSent = true;
    await ride.save();

    const title = "Ride Departing Soon";
    const body = `Your ride from ${pu} to ${de} departs at ${depTime}.`;

    const driverId = ride.user?._id;
    if (driverId) {
        try {
            await Notification.create({ user: driverId, type: TYPE, title, message: body, rideId: ride._id });
            await notifyUser(driverId, { type: TYPE, title, body, rideId: ride._id });
        } catch (err) {
            console.error("[departureReminder] driver notify error:", err.message);
        }
    }

    const bookings = await Booking.find({ ride: ride._id, status: "confirmed" });
    for (const b of bookings) {
        try {
            await Notification.create({ user: b.user, type: TYPE, title, message: body, rideId: ride._id });
            await notifyUser(b.user, { type: TYPE, title, body, rideId: ride._id });
        } catch (err) {
            console.error("[departureReminder] passenger notify error:", err.message);
        }
    }

    console.log(`[departureReminder] Sent departure reminder for ride ${ride._id} (${pu} → ${de})`);
};

// Find published rides departing within the next 30 minutes that haven't had a
// reminder yet, and notify driver + confirmed passengers.
const checkAndSend = async ({ dryRun = false } = {}) => {
    const rides = await Ride.find({
        status: "published",
        departureReminderSent: { $ne: true },
    }).populate("user", "_id firstName lastName");

    let sent = 0;
    for (const ride of rides) {
        await sendForRide(ride, dryRun);
        sent += 1;
    }
    return sent;
};

let running = false;

// Kick off the periodic job. Runs once immediately (catches rides whose window
// opened while the server was down), then every minute.
const startDepartureReminderJob = () => {
    const tick = async () => {
        if (running) return;
        running = true;
        try {
            await checkAndSend();
        } catch (err) {
            console.error("[departureReminder] Job error:", err);
        } finally {
            running = false;
        }
    };

    tick();
    setInterval(tick, TICK_MS);
    console.log("[departureReminder] Job started (every 60s, 30-min window)");
};

module.exports = { checkAndSend, startDepartureReminderJob };
