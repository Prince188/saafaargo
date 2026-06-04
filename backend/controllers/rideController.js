const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const User = require("../models/User");
const Notification = require("../models/Notification");

const placeName = (p) => {
    if (!p) return "";
    const obj = (typeof p.toObject === "function") ? p.toObject() : p;
    return (obj && typeof obj === "object") ? (obj.displayName || obj.address || obj.name || "") : String(obj || "");
};

const debugPlace = (label, p) => {
    const r = placeName(p);
    console.log(`[DEBUG placeName] ${label} type=${typeof p} isObj=${p && typeof p === "object"} displayName=${p?.displayName} address=${p?.address} keys=${p ? Object.keys(p).join(",") : "null"} result="${r}"`);
    return r;
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/rides  — PATCHED: sets status based on driver verification
// ─────────────────────────────────────────────────────────────────────────────
exports.createRide = async (req, res) => {
    try {
        const {
            pickup,
            destination,
            stops,
            date,
            time,
            seatsAvailable,
            car,
            perkmprice,
            totalDistanceKm,
            totalPricePerSeat,
            totalPriceFullRoute,
            preferences,
        } = req.body;

        // ── Check if driver is already verified ───────────────────────────
        const driver = await User.findById(req.user.id).select("driverVerified");
        const rideStatus = driver?.driverVerified ? "published" : "pending";
        // ─────────────────────────────────────────────────────────────────

        const ride = new Ride({
            user: req.user.id,
            pickup: req.body.pickup,
            destination: req.body.destination,
            stops: req.body.stops,
            date: req.body.date,
            time: req.body.time,
            seatsAvailable: req.body.seatsAvailable,
            totalSeats : req.body.seatsAvailable,
            car: req.body.car,
            perkmprice,
            status: rideStatus,
            totalDistanceKm: Number(totalDistanceKm) || 0,
            pricePerSeat: Number(totalPricePerSeat) || 0,
            totalEarning: Number(totalPriceFullRoute) || 0,
            preferences: preferences || {},
        });

        await ride.save();

        res.status(201).json({
            success: true,
            message: rideStatus === "published"
                ? "Ride created successfully"
                : "Ride saved. It will go live once your documents are verified.",
            ride,
            rideStatus,                               // ← NEW (frontend reads this)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, " ")
        .trim();

const isRouteMatch = (ride, from, to) => {
    const route = [
        ride.pickup.displayName,
        ...(ride.stops?.map(s => s.displayName) || []),
        ride.destination.displayName
    ].map(normalize);

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const fromIdx = route.findIndex(r => r.includes(fromKey));
    const toIdx = route.findIndex(r => r.includes(toKey));

    return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
};

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const CITY_CENTERS = {
    "ahmedabad": { lat: 23.0225, lng: 72.5714 },
    "surat": { lat: 21.1702, lng: 72.8311 },
    "vadodara": { lat: 22.3072, lng: 73.1812 },
    "anand": { lat: 22.5645, lng: 72.9289 },
    "nadiad": { lat: 22.6916, lng: 72.8634 },
    "bharuch": { lat: 21.7051, lng: 72.9959 },
    "vapi": { lat: 20.3893, lng: 72.9106 },
    "navsari": { lat: 20.9467, lng: 72.9520 },
    "rajkot": { lat: 22.3039, lng: 70.8022 },
    "gandhinagar": { lat: 23.2156, lng: 72.6369 },
    "mehsana": { lat: 23.5880, lng: 72.3693 },
};

const getCityCoordinates = (location) => {
    if (!location) return null;
    const name = location.displayName || location.address || (typeof location === 'string' ? location : "");
    const cleanName = name.toLowerCase();

    for (const [city, coords] of Object.entries(CITY_CENTERS)) {
        if (cleanName.includes(city)) {
            return coords;
        }
    }
    return { lat: Number(location.lat), lng: Number(location.lng) };
};

const getSegmentDistance = (ride, from, to) => {
    const route = [
        ride.pickup,
        ...(ride.stops || []),
        ride.destination,
    ];

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const fromIndex = route.findIndex(r => normalize(r.displayName).includes(fromKey));
    const toIndex = route.findIndex(r => normalize(r.displayName).includes(toKey));

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return 0;

    // Try stored distanceFromPickup on the matched stops first
    const getDist = (idx) => {
        if (idx === 0) return 0;                              // pickup
        if (idx === route.length - 1) return ride.totalDistanceKm; // destination
        return route[idx]?.distanceFromPickup;                  // stop
    };

    const fromDist = getDist(fromIndex);
    const toDist = getDist(toIndex);

    if (fromDist != null && toDist != null && toDist > fromDist) {
        return toDist - fromDist;
    }

    // Fallback: proportion of total Haversine, scaled to road distance
    const totalHaversine = (() => {
        let sum = 0;
        for (let i = 0; i < route.length - 1; i++) {
            const a = route[i];
            const b = route[i + 1];
            const ca = getCityCoordinates(a);
            const cb = getCityCoordinates(b);
            sum += getDistanceInKm(ca.lat, ca.lng, cb.lat, cb.lng);
        }
        return sum;
    })();

    let segmentHaversine = 0;
    for (let i = fromIndex; i < toIndex; i++) {
        const a = route[i];
        const b = route[i + 1];
        const ca = getCityCoordinates(a);
        const cb = getCityCoordinates(b);
        segmentHaversine += getDistanceInKm(ca.lat, ca.lng, cb.lat, cb.lng);
    }

    if (ride.totalDistanceKm && totalHaversine > 0) {
        return (segmentHaversine / totalHaversine) * ride.totalDistanceKm;
    }

    return segmentHaversine;
};

const getDynamicPrice = (ride, from, to) => {
    const distance = getSegmentDistance(ride, from, to);
    console.log("SEGMENT DISTANCE:", distance);
    console.log("PER KM PRICE:", ride.perkmprice);
    if (!distance || !ride.perkmprice) return 0;
    const price = distance * Number(ride.perkmprice);
    console.log("FINAL PRICE:", price);
    return Math.round(price);
};

const formatTime = (minutesFromMidnight) => {
    const h = Math.floor(minutesFromMidnight / 60);
    const m = Math.floor(minutesFromMidnight % 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const getSegmentTime = (ride, from, to) => {
    const route = [
        ride.pickup,
        ...(ride.stops || []),
        ride.destination,
    ];

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const [h, m] = ride.time.split(":").map(Number);
    let minutes = h * 60 + m;

    let pickupTime = null;
    let dropTime = null;

    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];
        const startName = normalize(start.displayName);
        const endName = normalize(end.displayName);
        const distance = getDistanceInKm(start.lat, start.lng, end.lat, end.lng);
        const travelMinutes = distance * 2;

        if (!pickupTime && startName.includes(fromKey)) {
            pickupTime = minutes;
        }
        minutes += travelMinutes;
        if (endName.includes(toKey)) {
            dropTime = minutes;
            break;
        }
    }

    if (!pickupTime || !dropTime) return null;
    return {
        pickupTime: formatTime(pickupTime),
        dropTime: formatTime(dropTime),
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/rides  — PATCHED: only return status:"published" rides to passengers
// ─────────────────────────────────────────────────────────────────────────────
exports.getRides = async (req, res) => {
    try {
        const { from, to, date, seats, minPrice, maxPrice, minTime, maxTime, womenOnly, noPets, noSmoking, sortBy } = req.query;
        const requestedSeats = parseInt(seats) || 1;

        let dbQuery = {
            status: "published",
            seatsAvailable: { $gte: requestedSeats }
        };

        if (date) dbQuery.date = date;
        if (minTime && maxTime) {
            dbQuery.time = { $gte: minTime, $lte: maxTime };
        } else if (minTime) {
            dbQuery.time = { $gte: minTime };
        } else if (maxTime) {
            dbQuery.time = { $lte: maxTime };
        }

        if (womenOnly === "true") dbQuery["preferences.womenOnly"] = true;
        if (noPets === "true") dbQuery["preferences.noPets"] = true;
        if (noSmoking === "true") dbQuery["preferences.noSmoking"] = true;

        let sortOption = { time: 1 };
        if (sortBy === "price_asc") sortOption = { pricePerSeat: 1 };
        else if (sortBy === "price_desc") sortOption = { pricePerSeat: -1 };
        else if (sortBy === "seats_desc") sortOption = { seatsAvailable: -1 };

        const candidates = await Ride.find(dbQuery)
            .populate("user", "firstName lastName email profilePic")
            .sort(sortOption)
            .lean();

        let rides = candidates;

        if (from && to) {
            rides = candidates
                .filter((ride) => {
                    try {
                        return isRouteMatch(ride, from, to);
                    } catch (e) {
                        return false;
                    }
                })
                .map((ride) => {
                    let price = 0;
                    let timeData = null;
                    try {
                        price = getDynamicPrice(ride, from, to);
                        timeData = getSegmentTime(ride, from, to);
                    } catch (e) {
                        price = 0;
                    }
                    return {
                        ...ride,
                        segmentPrice: price,
                        userPickupTime: timeData?.pickupTime,
                        userDropTime: timeData?.dropTime,
                    };
                });
        }

        if (minPrice || maxPrice) {
            rides = rides.filter((ride) => {
                const p = ride.segmentPrice || ride.pricePerSeat || 0;
                if (minPrice && p < Number(minPrice)) return false;
                if (maxPrice && p > Number(maxPrice)) return false;
                return true;
            });
        }

        if (sortBy === "price_asc") {
            rides.sort((a, b) => (a.segmentPrice || 0) - (b.segmentPrice || 0));
        } else if (sortBy === "price_desc") {
            rides.sort((a, b) => (b.segmentPrice || 0) - (a.segmentPrice || 0));
        }

        res.json({ success: true, count: rides.length, rides });

    } catch (err) {
        console.error("[getRides] Error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// Everything below is UNCHANGED from your original file
// ─────────────────────────────────────────────────────────────────────────────

exports.getMyRides = async (req, res) => {
    try {
        console.log("USER:", req.user);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const rides = await Ride.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(rides);

    } catch (err) {
        console.error("MY RIDES ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate("user", "_id firstName lastName email profilePic")
            .populate("passengers.user", "_id firstName lastName email profilePic");

        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        const isDriver = req.user?.id === ride.user?._id.toString();

        if (!isDriver) {
            ride.passengers = ride.passengers.map((passenger) => ({
                ...passenger.toObject(),
                phone: undefined,
            }));
        }

        res.json({ success: true, ride, isDriver });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.bookRide = async (req, res) => {
    try {
        const { seats, segmentPrice, from, to } = req.body;
        const rideId = req.params.id;
        const userId = req.user.id;

        const seatsCount = Number(seats);
        if (!seatsCount || seatsCount <= 0) {
            return res.status(400).json({ message: "Invalid seats count" });
        }

        const ride = await Ride.findById(rideId).populate("user");
        if (!ride) return res.status(404).json({ message: "Ride not found" });

        if (ride.user._id.toString() === userId) {
            return res.status(400).json({ message: "You cannot book your own ride" });
        }

        if (ride.seatsAvailable < seatsCount) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        const alreadyBooked = await Booking.findOne({
            ride: rideId,
            user: userId,
            status: "confirmed"
        });
        if (alreadyBooked) {
            return res.status(400).json({ message: "You already booked this ride" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const pricePerSeat = segmentPrice && Number(segmentPrice) > 0
            ? Number(segmentPrice)
            : ride.perkmprice;
        const amount = pricePerSeat * seatsCount;

        const booking = await Booking.create({
            ride: rideId,
            user: userId,
            name: user.firstName + " " + user.lastName,
            phone: user.mobile,
            email: user.email,
            seatsBooked: seatsCount,
            amountPaid: amount,
            from: from || ride.pickup,
            to: to || ride.destination
        });

        if (!ride.passengers) ride.passengers = [];

        ride.passengers.push({
            user: userId,
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            from: booking.from,
            to: booking.to,
            amountPaid: amount,
            seatsBooked: seatsCount
        });

        ride.seatsAvailable -= seatsCount;
        await ride.save();

        try {
            const driverId = ride.user._id || ride.user;
            const rpickup = ride.pickup, rdest = ride.destination;
            const pu = debugPlace("bookRide", rpickup);
            const de = debugPlace("bookRide", rdest);
            await Notification.create({
                user: driverId,
                type: "ride_booked",
                title: "New Booking",
                message: `${user.firstName} ${user.lastName} booked ${seatsCount} seat(s) on your ride from ${placeName(rpickup)} to ${placeName(rdest)}.`,
                rideId: ride._id,
            });
        } catch (notifErr) {
            console.error("Failed to create notification:", notifErr);
        }

        return res.status(201).json({ message: "Ride booked successfully", booking });

    } catch (err) {
        console.error("BOOK RIDE ERROR:", err);
        return res.status(500).json({ message: err.message || "Server error" });
    }
};

exports.deleteRide = async (req, res) => {
    try {
        const rideId = req.params.id;
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ success: false, message: "Ride not found" });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Ride.findByIdAndDelete(rideId);
        res.status(200).json({ success: true, message: "Ride deleted successfully" });

    } catch (error) {
        console.log("Delete ride error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find()
            .populate("user", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, rides });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/rides/edit/:id
// Accepts: pickup, destination, date, time, seatsAvailable, notes, distanceKm
// Recalculates: totalEarning = distanceKm * perkmprice
//               (stored so MyRide can display it without re-computing)
// Edit window: up to 1 hour before departure
// ─────────────────────────────────────────────────────────────────────────────
exports.editRide = async (req, res) => {
    try {
        const { id } = req.params;

        const ride = await Ride.findById(id);

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        // ── Ownership check ───────────────────────────────────────────────
        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // ── Determine the departure datetime to enforce the 1-hour window ─
        // ride.time is stored as "HH:mm" (24-hour, from react-time-picker)
        // Use the *incoming* date/time if provided, otherwise fall back to
        // what is already in the DB — so the window is checked against the
        // NEW departure time the driver is trying to set.
        const dateStr = req.body.date || ride.date;
        const timeStr = req.body.time || ride.time;

        let rideDateTime;

        if (timeStr && timeStr.includes(":")) {
            const timeParts = timeStr.trim().split(" "); // handles both "HH:mm" and "HH:mm AM/PM"
            const [hhRaw, mmRaw] = timeParts[0].split(":").map(Number);
            let hours = hhRaw;
            const modifier = timeParts[1]?.toUpperCase();

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            // dateStr may be "YYYY-MM-DD" or an ISO string
            const base = new Date(dateStr);
            rideDateTime = new Date(
                base.getFullYear(),
                base.getMonth(),
                base.getDate(),
                hours,
                mmRaw,
                0,
                0
            );
        } else {
            rideDateTime = new Date(dateStr);
        }

        const editDeadline = new Date(rideDateTime.getTime() - 60 * 60 * 1000);

        if (new Date() > editDeadline) {
            return res.status(400).json({
                success: false,
                message: "Ride can no longer be edited (less than 1 hour before departure)"
            });
        }

        // ── Build update object ───────────────────────────────────────────
        const {
            pickup,
            destination,
            date,
            time,
            seatsAvailable,
            notes,
            distanceKm,
            preferences,
        } = req.body;

        const updateFields = {};

        if (pickup) updateFields.pickup = pickup;
        if (destination) updateFields.destination = destination;
        if (date) updateFields.date = date;
        if (time) updateFields.time = time;
        if (seatsAvailable) updateFields.seatsAvailable = Number(seatsAvailable);
        if (notes !== undefined) updateFields.notes = notes;
        if (distanceKm) updateFields.totalDistanceKm = Number(distanceKm);
        if (preferences) updateFields.preferences = preferences;

        const km = parseFloat(distanceKm) || null;
        const rate = Number(ride.perkmprice);
        const seats = Number(seatsAvailable || ride.seatsAvailable) || 1;

        if (km && rate) {
            const totalRoutePrice = Math.round(km * rate);
            const calculatedPerSeat = Math.round(totalRoutePrice / (seats + 1));

            updateFields.pricePerSeat = calculatedPerSeat;
            updateFields.totalEarning = totalRoutePrice;
        }

        // ── Persist ───────────────────────────────────────────────────────
        const updatedRide = await Ride.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );

        try {
            const passengers = await Booking.find({ ride: id, status: "confirmed" }).populate("user", "firstName lastName");
            const rpickup = updatedRide.pickup, rdest = updatedRide.destination;
            const pu = debugPlace("editRide", rpickup);
            const de = debugPlace("editRide", rdest);
            const puStr = placeName(rpickup);
            const deStr = placeName(rdest);
            for (const p of passengers) {
                await Notification.create({
                    user: p.user._id,
                    type: "ride_modified",
                    title: "Ride Modified",
                    message: `Your ride from ${puStr} to ${deStr} has been updated by the driver.`,
                    rideId: id,
                });
            }
        } catch (notifErr) {
            console.error("Notification error:", notifErr);
        }

        return res.status(200).json({
            success: true,
            message: "Ride updated successfully",
            data: updatedRide
        });

    } catch (error) {
        console.error("editRide error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/rides/complete/:id  — Mark ride as completed
// ─────────────────────────────────────────────────────────────────────────────
exports.completeRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: "Ride not found" });
        if (ride.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
        if (ride.status !== "published") return res.status(400).json({ message: "Ride must be published to complete" });

        ride.status = "completed";
        await ride.save();

        await Booking.updateMany(
            { ride: ride._id, status: "confirmed" },
            { $set: { status: "completed" } }
        );

        try {
            const bookings = await Booking.find({ ride: ride._id, status: "completed" }).populate("user", "firstName lastName");
            const rpickup = ride.pickup, rdest = ride.destination;
            const puStr = placeName(rpickup);
            const deStr = placeName(rdest);
            for (const b of bookings) {
                await Notification.create({
                    user: b.user._id,
                    type: "ride_completed",
                    title: "Ride Completed",
                    message: `Your ride from ${puStr} to ${deStr} has been marked as completed.`,
                    rideId: ride._id,
                });
            }
        } catch (notifErr) {
            console.error("Notification error:", notifErr);
        }

        res.json({ success: true, message: "Ride marked as completed" });
    } catch (error) {
        console.error("completeRide error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/rides/cancel/:id  — Soft-cancel a ride (keeps record)
// ─────────────────────────────────────────────────────────────────────────────
exports.cancelRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: "Ride not found" });
        if (ride.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });
        if (ride.status !== "published") return res.status(400).json({ message: "Ride is not published" });

        ride.status = "cancelled";
        ride.seatsAvailable = 0;
        await ride.save();

        await Booking.updateMany(
            { ride: ride._id, status: "confirmed" },
            { $set: { status: "cancelled" } }
        );

        try {
            const bookings = await Booking.find({ ride: ride._id, status: "cancelled" }).populate("user", "firstName lastName");
            const rpickup = ride.pickup, rdest = ride.destination;
            const puStr = placeName(rpickup);
            const deStr = placeName(rdest);
            for (const b of bookings) {
                await Notification.create({
                    user: b.user._id,
                    type: "ride_cancelled",
                    title: "Ride Cancelled",
                    message: `Your ride from ${puStr} to ${deStr} has been cancelled.`,
                    rideId: ride._id,
                });
            }
        } catch (notifErr) {
            console.error("Notification error:", notifErr);
        }

        res.json({ success: true, message: "Ride cancelled successfully" });
    } catch (error) {
        console.error("cancelRide error:", error);
        res.status(500).json({ message: "Server error" });
    }
};