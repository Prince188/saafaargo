import React, { useEffect, useState } from "react";
import axios from "axios";

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRides = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/rides/my-rides",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRides(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ride?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/rides/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRides(rides.filter((ride) => ride._id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete ride");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">My Rides</h1>

      {rides.length === 0 ? (
        <div className="text-gray-500">No rides found</div>
      ) : (
        <div className="grid gap-5">
          {rides.map((ride) => (
            <div
              key={ride._id}
              className="border rounded-2xl p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {ride.pickup?.displayName}
                  </h2>

                  <p className="text-gray-500 my-1">
                    ↓
                  </p>

                  <h2 className="text-xl font-semibold">
                    {ride.destination?.displayName}
                  </h2>
                </div>

                <button
                  onClick={() => handleDelete(ride._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                <div>
                  <p className="text-gray-500 text-sm">Date</p>
                  <p className="font-medium">{ride.date}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Time</p>
                  <p className="font-medium">{ride.time}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Seats</p>
                  <p className="font-medium">
                    {ride.seatsAvailable}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Car</p>
                  <p className="font-medium">
                    {ride.car || "N/A"}
                  </p>
                </div>
              </div>

              {/* Stops */}
              {ride.stops?.length > 0 && (
                <div className="mt-5">
                  <p className="font-semibold mb-2">Stops</p>

                  <div className="flex flex-wrap gap-2">
                    {ride.stops.map((stop, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {stop.displayName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rides;