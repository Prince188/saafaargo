import React from 'react';
import { HiOutlineUsers } from "react-icons/hi";
import '../css/search.css';
import { useLocation } from 'react-router-dom';

const RideSearch = () => {

    //Access that data from the Home.jsx page
    const location = useLocation();

    console.log("DATA:", location.state);

    const { from, to } = location.state || {};

    const getCityFromEnd = (place) => {
        if (!place) return "";

        const parts = place.split(",").map(p => p.trim());

        // take 3rd from last (city usually here)
        return parts[parts.length - 4] || parts[0];
    };


    const rides = [
        {
            id: 1,
            departure: "11:20",
            arrival: "08:40",
            duration: "2h50",
            from: "Palod",
            to: "Ahmedabad",
            price: "760.00",
            driver: "Vivek",
            info: "Max. 2 in the back",
            image: "https://i.pravatar.cc/150?u=vivek"
        },
        {
            id: 2,
            departure: "12:00",
            arrival: "09:40",
            duration: "3h10",
            from: "Palod",
            to: "Ahmedabad",
            price: "740.00",
            driver: "Jay",
            info: "Max. 2 in the back",
            image: "https://i.pravatar.cc/150?u=jay"
        }
    ];

    return (
        <div className="ride-container">

            <div className="content-layout">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="map-placeholder">
                        <button className="map-btn">Show rides on map</button>
                    </div>
                    <h2 className="filter-title">No filters available</h2>
                </div>

                {/* Results List */}
                <div className="results-list">
                    <div className="results-header">
                        <h3>Friday, 24 April <span className="route-text">  {getCityFromEnd(from)} → {getCityFromEnd(to)} </span></h3>
                        <div className="results-count">{rides.length} rides available</div>
                    </div>

                    {rides.map((ride) => (
                        <div key={ride.id} className="ride-card">
                            <div className="ride-main-info">
                                <div className="time-location-row">
                                    <div className="time-col">
                                        <div className="time-node">
                                            <span className="time">{ride.departure}</span>
                                            <span className="location">{ride.from}</span>
                                        </div>
                                        <div className="timeline-visual">
                                            <div className='dot'>

                                            </div>
                                            <hr className='hr' />

                                            <div className="dot">
                                            </div>
                                        </div>
                                        <div className="time-node">
                                            <span className="time">{ride.arrival}</span>
                                            <span className="location">{ride.to}</span>
                                        </div>
                                    </div>

                                    {/* <div className="timeline-visual">
                                        <div className="dot"></div>
                                        <div className="line">
                                            <span className="duration-label">{ride.duration}</span>
                                        </div>
                                        <div className="dot"></div>
                                    </div> */}
                                </div>

                                <div className="price-tag">
                                    ₹{ride.price}
                                </div>
                            </div>

                            <div className="driver-footer">
                                <div className="driver-info">
                                    <img src={ride.image} alt={ride.driver} className="driver-img" />
                                    <span className="driver-name">{ride.driver}</span>
                                </div>
                                <div className="ride-meta">
                                    <HiOutlineUsers size={18} />
                                    <span>{ride.info}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* <div className="alert-section">
                        <button className="alert-btn">Create a ride alert</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default RideSearch;