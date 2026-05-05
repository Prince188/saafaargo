const Ride = require("../models/Ride");
const Booking = require("../models/Booking");

exports.bookRide = async (req, res) => {
    try {
        const { seats } = req.body;
        const rideId = req.params.id;
        const userId = req.user.id;

        // 🔍 Find ride
        const ride = await Ride.findById(rideId).populate("user");

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // ❌ Driver cannot book own ride
        if (ride.user._id.toString() === userId) {
            return res.status(400).json({ message: "You cannot book your own ride" });
        }

        // ❌ Not enough seats
        if (ride.seatsAvailable < seats) {
            return res.status(400).json({ message: "Not enough seats available" });
        }

        // ❌ Prevent duplicate booking (optional but good)
        const alreadyBooked = await Booking.findOne({
            ride: rideId,
            user: userId,
            status: "confirmed"
        });

        if (alreadyBooked) {
            return res.status(400).json({ message: "You already booked this ride" });
        }

        // ✅ Calculate price
        const amount = ride.perkmprice * seats;

        // ✅ Create booking record
        const booking = await Booking.create({
            ride: rideId,
            user: userId,
            name: req.user.firstName + " " + req.user.lastName,
            phone: req.user.phone,
            email: req.user.email,
            seatsBooked: seats,
            amountPaid: amount,
            from: ride.pickup,
            to: ride.destination
        });

        // ✅ ALSO push into Ride.passengers (your requirement)
        ride.passengers.push({
            user: userId,
            name: booking.name,
            phone: booking.phone,
            email: booking.email,
            from: booking.from,
            to: booking.to,
            amountPaid: amount,
            seatsBooked: seats
        });

        // ✅ Reduce seats
        ride.seatsAvailable -= seats;

        await ride.save();

        res.status(201).json({
            message: "Ride booked successfully",
            booking
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};