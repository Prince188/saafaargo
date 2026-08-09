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

        // Declined/completed bookings are terminal.
        if (booking.status === "declined") {
            return res.status(400).json({
                message: "This booking was declined by the driver"
            });
        }
        if (booking.status === "completed") {
            return res.status(400).json({
                message: "Trip already completed"
            });
        }

        const maxSeats = booking.seatsBooked;

        // Pending request: seats were only HELD, never reduced → just release the hold.
        if (booking.status === "pending") {
            booking.status = "cancelled";
            await booking.save();

            const ride = await Ride.findById(booking.ride);
            if (ride) {
                ride.heldSeats = Math.max(0, (Number(ride.heldSeats) || 0) - maxSeats);
                await ride.save();
            }

            // Let the driver know the request was withdrawn.
            try {
                const ride = await Ride.findById(booking.ride);
                if (ride && ride.user) {
                    const pu = placeName(ride.pickup);
                    const de = placeName(ride.destination);
                    const message = `${req.user.firstName} ${req.user.lastName} withdrew their booking request for ${maxSeats} seat(s) on your ride from ${pu} to ${de}.`;
                    await Notification.create({
                        user: ride.user,
                        type: "ride_cancelled",
                        title: "Booking Request Withdrawn",
                        message,
                        rideId: ride._id,
                    });
                    try {
                        await notifyUser(ride.user, {
                            type: "ride_cancelled",
                            title: "Booking Request Withdrawn",
                            body: message,
                            rideId: ride._id,
                        });
                    } catch (pushErr) {
                        console.error("Failed to send push notification:", pushErr);
                    }
                }
            } catch (notifErr) {
                console.error("Failed to create cancellation notification:", notifErr);
            }

            return res.status(200).json({
                success: true,
                message: "Trip cancelled successfully",
                booking
            });
        }

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


// =======================================
// GET DRIVER REQUESTS  (pending bookings across all of the driver's rides)
// =======================================
exports.getDriverRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const rides = await Ride.find({ user: userId }).select("_id");
        const rideIds = rides.map(r => r._id);

        const requests = await Booking.find({
            ride: { $in: rideIds },
            status: "pending"
        })
            .populate({
                path: "ride",
                select: "pickup destination date time perkmprice seatsAvailable totalSeats status heldSeats"
            })
            .populate("user", "_id firstName lastName email profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, requests });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// =======================================
// ACCEPT BOOKING  (driver confirms a pending request)
// =======================================
exports.acceptBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const ride = await Ride.findById(booking.ride);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (booking.status === "confirmed") {
            return res.status(400).json({ message: "Booking already confirmed" });
        }
        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Booking is no longer pending" });
        }
        if (ride.status !== "published") {
            return res.status(400).json({ message: "Ride is not available for confirmation" });
        }

        // Capacity check — held seats already reserved this count, but guard anyway.
        if (ride.seatsAvailable < booking.seatsBooked) {
            return res.status(400).json({ message: "Not enough seats available to confirm this booking" });
        }

        booking.status = "confirmed";
        await booking.save();

        // Reduce seats, release the hold, add the passenger, add earnings.
        ride.seatsAvailable -= booking.seatsBooked;
        ride.heldSeats = Math.max(0, (Number(ride.heldSeats) || 0) - booking.seatsBooked);

        if (!ride.passengers) ride.passengers = [];
        const passenger = ride.passengers.find(
            (p) => p.user.toString() === booking.user.toString()
        );
        if (passenger) {
            passenger.seatsBooked += booking.seatsBooked;
            passenger.amountPaid = (passenger.amountPaid || 0) + (booking.amountPaid || 0);
            passenger.from = booking.from;
            passenger.to = booking.to;
        } else {
            ride.passengers.push({
                user: booking.user,
                name: booking.name,
                phone: booking.phone,
                email: booking.email,
                from: booking.from,
                to: booking.to,
                amountPaid: booking.amountPaid,
                seatsBooked: booking.seatsBooked
            });
        }

        ride.totalEarning = (ride.totalEarning || 0) + (booking.amountPaid || 0);
        ride.markModified('totalEarning');
        await ride.save();

        // Notify the passenger that their booking was confirmed.
        try {
            const pu = placeName(ride.pickup);
            const de = placeName(ride.destination);
            const message = `Your booking on the ride from ${pu} to ${de} has been confirmed.`;
            await Notification.create({
                user: booking.user,
                type: "booking_confirmed",
                title: "Booking Confirmed",
                message,
                rideId: ride._id,
            });
            try {
                await notifyUser(booking.user, {
                    type: "booking_confirmed",
                    title: "Booking Confirmed",
                    body: message,
                    rideId: ride._id,
                });
            } catch (pushErr) {
                console.error("Failed to send push notification:", pushErr);
            }
        } catch (notifErr) {
            console.error("Failed to create notification:", notifErr);
        }

        res.status(200).json({
            success: true,
            message: "Booking confirmed",
            booking
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


// =======================================
// DECLINE BOOKING  (driver rejects a pending request)
// =======================================
exports.declineBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const ride = await Ride.findById(booking.ride);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (booking.status === "declined") {
            return res.status(400).json({ message: "Booking already declined" });
        }
        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Booking is no longer pending" });
        }

        booking.status = "declined";
        await booking.save();

        // Release the held seats.
        ride.heldSeats = Math.max(0, (Number(ride.heldSeats) || 0) - booking.seatsBooked);
        await ride.save();

        // Notify the passenger that their request was declined.
        try {
            const pu = placeName(ride.pickup);
            const de = placeName(ride.destination);
            const message = `Your booking request for the ride from ${pu} to ${de} was declined by the driver.`;
            await Notification.create({
                user: booking.user,
                type: "booking_declined",
                title: "Booking Declined",
                message,
                rideId: ride._id,
            });
            try {
                await notifyUser(booking.user, {
                    type: "booking_declined",
                    title: "Booking Declined",
                    body: message,
                    rideId: ride._id,
                });
            } catch (pushErr) {
                console.error("Failed to send push notification:", pushErr);
            }
        } catch (notifErr) {
            console.error("Failed to create notification:", notifErr);
        }

        res.status(200).json({
            success: true,
            message: "Booking declined",
            booking
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};