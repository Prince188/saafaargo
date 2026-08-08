const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const { notifyUser } = require("../util/fcm");

const placeName = (p) => {
    if (!p) return "";
    const obj = (typeof p.toObject === "function") ? p.toObject() : p;
    return (obj && typeof obj === "object") ? (obj.displayName || obj.address || obj.name || "") : String(obj || "");
};

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



        // ✅ Calculate price
        const amount = ride.perkmprice * seats;

        let booking = await Booking.findOne({
            ride: rideId,
            user: userId,
            status: "confirmed"
        });

        if (booking) {
            booking.seatsBooked += seats;
            booking.amountPaid += amount;
            await booking.save();

            if (!ride.passengers) ride.passengers = [];
            const passenger = ride.passengers.find(
                (p) => p.user.toString() === userId
            );
            if (passenger) {
                passenger.seatsBooked += seats;
                passenger.amountPaid += amount;
            } else {
                ride.passengers.push({
                    user: userId,
                    name: booking.name,
                    phone: booking.phone,
                    email: booking.email,
                    from: booking.from,
                    to: booking.to,
                    amountPaid: booking.amountPaid,
                    seatsBooked: booking.seatsBooked
                });
            }
        } else {
            booking = await Booking.create({
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

            if (!ride.passengers) ride.passengers = [];
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
        }

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



        // Calculate amount
        const amount = ride.perkmprice * seats;

        let booking = await Booking.findOne({
            ride: rideId,
            user: userId,
            status: "confirmed"
        });

        if (booking) {
            booking.seatsBooked += seats;
            booking.amountPaid += amount;
            await booking.save();

            if (!ride.passengers) ride.passengers = [];
            const passenger = ride.passengers.find(
                (p) => p.user.toString() === userId
            );
            if (passenger) {
                passenger.seatsBooked += seats;
                passenger.amountPaid += amount;
            } else {
                ride.passengers.push({
                    user: userId,
                    name: booking.name,
                    phone: booking.phone,
                    email: booking.email,
                    from: booking.from,
                    to: booking.to,
                    amountPaid: booking.amountPaid,
                    seatsBooked: booking.seatsBooked
                });
            }
        } else {
            booking = await Booking.create({
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

            if (!ride.passengers) ride.passengers = [];
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
        }

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
        const seatsToCancelInput = Number(req.body.seatsToCancel);

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

        const maxSeats = booking.seatsBooked;
        const cancelAll = !seatsToCancelInput || seatsToCancelInput >= maxSeats;
        const actualCancelCount = cancelAll ? maxSeats : seatsToCancelInput;

        if (actualCancelCount <= 0) {
            return res.status(400).json({ message: "Invalid cancel count" });
        }

        const pricePerSeat = booking.amountPaid / maxSeats;
        const deductAmount = Math.round(pricePerSeat * actualCancelCount);

        if (cancelAll) {
            booking.status = "cancelled";
        } else {
            booking.seatsBooked -= actualCancelCount;
            booking.amountPaid -= deductAmount;
        }

        await booking.save();

        // Restore seats
        const ride = await Ride.findById(booking.ride);

        if (ride) {
            ride.seatsAvailable += actualCancelCount;

            if (cancelAll) {
                // Remove matching passenger from ride.passengers
                const pIndex = ride.passengers.findIndex(
                    (p) => p.user.toString() === userId && p.seatsBooked === maxSeats && p.amountPaid === booking.amountPaid
                );
                if (pIndex !== -1) {
                    ride.passengers.splice(pIndex, 1);
                } else {
                    ride.passengers = ride.passengers.filter(
                        (passenger) => passenger.user.toString() !== userId
                    );
                }
            } else {
                // Update passenger entry with reduced seats
                const passenger = ride.passengers.find(
                    (p) => p.user.toString() === userId && p.seatsBooked >= maxSeats
                );
                if (passenger) {
                    const pricePerSeat = passenger.amountPaid / maxSeats;
                    passenger.seatsBooked -= actualCancelCount;
                    passenger.amountPaid -= Math.round(pricePerSeat * actualCancelCount);
                }
            }

            ride.totalEarning = Math.max(0, (ride.totalEarning || 0) - deductAmount);

            await ride.save();
        }

        // Notify the driver that a passenger cancelled
        try {
            const driverId = ride.user;
            const pu = placeName(ride.pickup);
            const de = placeName(ride.destination);
            const message = `${req.user.firstName} ${req.user.lastName} cancelled ${actualCancelCount} seat(s) on your ride from ${pu} to ${de}.`;
            await Notification.create({
                user: driverId,
                type: "ride_cancelled",
                title: "Booking Cancelled",
                message,
                rideId: ride._id,
            });
            try {
                await notifyUser(driverId, {
                    type: "ride_cancelled",
                    title: "Booking Cancelled",
                    body: message,
                    rideId: ride._id,
                });
            } catch (pushErr) {
                console.error("Failed to send push notification:", pushErr);
            }
        } catch (notifErr) {
            console.error("Failed to create cancellation notification:", notifErr);
        }

        res.status(200).json({
            success: true,
            message: cancelAll ? "Trip cancelled successfully" : `Cancelled ${actualCancelCount} seat(s) successfully`,
            booking
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};