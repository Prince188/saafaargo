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


// =======================================
// BOOK RIDE
// =======================================
exports.bookRide = async (req, res) => {
    try {
        const { seats } = req.body;
        const rideId = req.params.id;
        const userId = req.user.id;

        // Find ride
        const ride = await Ride.findById(rideId).populate("user");

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found"
            });
        }

        // Driver cannot book own ride
        if (ride.user._id.toString() === userId) {
            return res.status(400).json({
                message: "You cannot book your own ride"
            });
        }

        // Check seats
        if (ride.seatsAvailable < seats) {
            return res.status(400).json({
                message: "Not enough seats available"
            });
        }

        // Prevent duplicate booking
        const alreadyBooked = await Booking.findOne({
            ride: rideId,
            user: userId,
            status: "confirmed"
        });

        if (alreadyBooked) {
            return res.status(400).json({
                message: "You already booked this ride"
            });
        }

        // Calculate amount
        const amount = ride.perkmprice * seats;

        // Create booking
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

        // Push into passengers
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

        // Reduce seats
        ride.seatsAvailable -= seats;

        await ride.save();

        res.status(201).json({
            success: true,
            message: "Ride booked successfully",
            booking
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =======================================
// GET MY TRIPS
// =======================================
exports.getMyTrips = async (req, res) => {
    try {

        const userId = req.user.id;

        const trips = await Booking.find({
            user: userId
        })

            .populate({
                path: "ride",
                populate: {
                    path: "user",
                    select: "firstName lastName email phone"
                }
            })

            .sort({ createdAt: -1 });

        console.log(JSON.stringify(trips, null, 2));

        res.status(200).json(trips);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =======================================
// CANCEL TRIP
// =======================================
exports.cancelTrip = async (req, res) => {
    try {
        const userId = req.user.id;
        const tripId = req.params.id;

        // Find booking
        const booking = await Booking.findById(tripId);

        if (!booking) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        // Unauthorized
        if (booking.user.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized"
            });
        }

        // Already cancelled
        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Trip already cancelled"
            });
        }

        // Update booking
        booking.status = "cancelled";

        await booking.save();

        // Restore seats
        const ride = await Ride.findById(booking.ride);

        if (ride) {

            ride.seatsAvailable += booking.seatsBooked;

            // Remove passenger from ride.passengers
            ride.passengers = ride.passengers.filter(
                (passenger) =>
                    passenger.user.toString() !== userId
            );

            await ride.save();
        }

        res.status(200).json({
            success: true,
            message: "Trip cancelled successfully"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};