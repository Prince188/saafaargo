const Ride = require("../models/Ride");

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
            perkmprice
        } = req.body;

        const ride = new Ride({
            user: req.user.id, // if using auth

            pickup: req.body.pickup,
            destination: req.body.destination,
            stops: req.body.stops,

            date: req.body.date,
            time: req.body.time,

            seatsAvailable: req.body.seatsAvailable, // ✅ ADD THIS
            car: req.body.car,                      // ✅ ADD THIS
            perkmprice,
        });

        await ride.save();

        res.status(201).json({
            success: true,
            message: "Ride created successfully",
            ride
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔥 GET ALL / SEARCH RIDES

const buildRoute = (ride) => {
    return [
        {
            name: ride.pickup.displayName?.toLowerCase().trim(),
            type: "pickup",
            price: null,
        },
        ...(ride.stops || []).map((stop) => ({
            name: stop.displayName?.toLowerCase().trim(),
            type: "stop",
            price: stop.price,
        })),
        {
            name: ride.destination.displayName?.toLowerCase().trim(),
            type: "destination",
            price: ride.pricePerSeat ?? null,
        },
    ];
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — check if user's from→to exists in ride's route in correct order
// ─────────────────────────────────────────────────────────────────────────────

const normalize = (str) =>
    str?.toLowerCase().replace(/\s+/g, " ").trim();

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
// ─────────────────────────────────────────────────────────────────────────────
// HELPER — get price for user's specific segment
// The destination node's price is used (each stop carries its own price)
// ─────────────────────────────────────────────────────────────────────────────

const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Earth radius in KM

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

const getSegmentDistance = (ride, from, to) => {
    const route = [
        ride.pickup,
        ...(ride.stops || []),
        ride.destination,
    ];

    const fromKey = normalize(from);
    const toKey = normalize(to);

    const fromIndex = route.findIndex(r =>
        normalize(r.displayName) === fromKey
    );

    const toIndex = route.findIndex(r =>
        normalize(r.displayName) === toKey
    );

    console.log("FROM INDEX:", fromIndex);
    console.log("TO INDEX:", toIndex);

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
        return 0;
    }

    let totalKm = 0;

    for (let i = fromIndex; i < toIndex; i++) {
        const a = route[i];
        const b = route[i + 1];

        if (!a || !b) continue;

        totalKm += getDistanceInKm(a.lat, a.lng, b.lat, b.lng);
    }

    return totalKm;
};
const getSegmentPrice = (legs, from, to, perkmprice) => {
    let start = false;
    let distance = 0;

    for (let leg of legs) {
        if (leg.start_address.toLowerCase().includes(from.toLowerCase())) {
            start = true;
        }

        if (start) {
            distance += leg.distance.value;
        }

        if (leg.end_address.toLowerCase().includes(to.toLowerCase())) {
            break;
        }
    }

    return Math.round((distance / 1000) * perkmprice);
};

const getSegmentTime = (ride, from, to) => {
    const route = [
        ride.pickup,
        ...(ride.stops || []),
        ride.destination,
    ];

    const fromKey = normalize(from);
    const toKey = normalize(to);

    let currentTime = ride.time; // "10:30"
    let started = false;

    const [h, m] = currentTime.split(":").map(Number);
    let minutes = h * 60 + m;

    for (let i = 0; i < route.length - 1; i++) {
        const start = route[i];
        const end = route[i + 1];

        const startName = normalize(start.displayName);
        const endName = normalize(end.displayName);

        // assume 1 km = 2 min (you can replace later with Google API)
        const distance = getDistanceInKm(
            start.lat,
            start.lng,
            end.lat,
            end.lng
        );

        const travelMinutes = distance * 2;

        if (startName.includes(fromKey)) {
            started = true;
        }

        if (started && startName.includes(fromKey)) {
            var pickupTime = new Date(minutes * 60000);
        }

        if (started) {
            minutes += travelMinutes;
        }

        if (endName.includes(toKey)) {
            return {
                pickupTime: formatTime(ride.time, pickupTime),
                dropTime: formatTime(ride.time, minutes)
            };
        }
    }

    return null;
};

const formatTime = (baseTime, minutesFromMidnight) => {
    const h = Math.floor(minutesFromMidnight / 60);
    const m = Math.floor(minutesFromMidnight % 60);

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
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

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Search available rides
// @route   GET /api/rides?from=Bayad&to=Ahmedabad&date=2026-04-26&seats=2
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
exports.getRides = async (req, res) => {
    try {
        const { from, to, date, seats } = req.query;
        const requestedSeats = parseInt(seats) || 1;

        let dbQuery = {
            seatsAvailable: { $gte: requestedSeats }
        };

        if (date) {
            dbQuery.date = date;
        }


        // Always filter by seats at DB level
        dbQuery.seatsAvailable = { $gte: requestedSeats };

        console.log("FROM:", from);
        console.log("TO:", to);

        // candidates.forEach(r => {
        //     console.log("ROUTE:", [
        //         r.pickup.displayName,
        //         ...(r.stops?.map(s => s.displayName) || []),
        //         r.destination.displayName
        //     ]);
        // });
        const candidates = await Ride.find(dbQuery)
            .populate("user", "firstName lastName email profilePic")
            .sort({ time: 1 }) // earliest departure first
            .lean();

        console.log("SAMPLE RIDE USER:", candidates[0]?.user);


        // ── Step 2: JS-level route-order check ───────────────────────────────
        // Removes rides where from and to exist but are in wrong direction.
        // e.g. user wants Ahmedabad→Bayad but ride goes Bayad→Ahmedabad → excluded.
        console.log("DEBUG FROM:", from);
        console.log("DEBUG TO:", to);
        console.log("CANDIDATES:", candidates.length);
        let rides = candidates;

        if (from && to) {
            rides = candidates
                .filter((ride) => {
                    try {
                        return isRouteMatch(ride, from, to);
                    } catch (e) {
                        console.log("isRouteMatch error:", e);
                        return false;
                    }
                })
                .map((ride) => {
                    let price = 0;
                    let timeData = null;

                    try {
                        price = getDynamicPrice(ride, from, to);
                        timeData = getSegmentTime(ride, from, to); // ✅ IMPORTANT
                    } catch (e) {
                        console.log("error:", e);
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

        res.json({
            success: true,
            count: rides.length,
            rides,
        });

    } catch (err) {
        console.error("[getRides] Error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

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
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ error: "Ride not found" });
        }

        res.json(ride);

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};