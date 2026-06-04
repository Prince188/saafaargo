const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Ride = require("../models/Ride");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const getPlaceName = (place) =>
    place && typeof place === "object" ? (place.displayName || place.name || "") : String(place || "");

async function fixOldNotifications() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const bad = await Notification.find({ message: /\[object Object\]/ });
    console.log(`Found ${bad.length} notifications with [object Object]`);

    for (const n of bad) {
        let ride;
        if (n.rideId) {
            ride = await Ride.findById(n.rideId).lean();
        }

        if (ride) {
            const from = getPlaceName(ride.pickup || ride.from);
            const to = getPlaceName(ride.destination || ride.to);
            n.message = n.message.replace("[object Object]", from).replace("[object Object]", to);
            await n.save();
            console.log(`Fixed ${n._id}: "${n.message}"`);
        } else {
            n.message = n.message.replaceAll("[object Object]", "Unknown location");
            await n.save();
            console.log(`Fixed ${n._id} (no ride): "${n.message}"`);
        }
    }

    console.log("Done");
    await mongoose.disconnect();
}

fixOldNotifications().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});