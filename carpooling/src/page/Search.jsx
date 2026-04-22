import React from "react";
import "../css/search.css";
import { FaMap, FaArrowRight } from "react-icons/fa";

const Search = () => {
    return (
        <div className="safar-wrapper">
            <div className="content-limit">
                <header>
                    <span className="date-label">Friday, 24 April</span>
                    <h1 className="route-title">
                        Palod <span>→</span> Ahmedabad
                    </h1>
                    <p className="date-label" style={{ textTransform: "none" }}>
                        12 rides available for this route
                    </p>
                </header>

                <div className="map-box">
                    <button
                        style={{ position: "absolute", bottom: "15px", left: "15px" }}
                        className="btn-outline"
                    >
                        <FaMap size={14} style={{ display: "inline", marginRight: "8px" }} />
                        Expand Interactive Map
                    </button>
                </div>

                {/* Ride Card */}
                <div className="ride-card">
                    <div className="trip-details-cont">
                        <div className="trip-details">
                            <div className="time-block">
                                <span className="time-val">08:00</span>
                                <span className="loc-val">Palod Junction</span>
                            </div>

                            <div className="route-line-container">
                                <div className="line-dot-start"></div>
                                <div className="line-dot-end"></div>
                            </div>

                            <div className="time-block">
                                <span className="time-val">10:15</span>
                                <span className="loc-val">Ahmedabad Central</span>
                            </div>
                        </div>

                        <div className="driver-info">
                            <img
                                className="driver-img"
                                src="https://i.pravatar.cc/100?u=1"
                                alt="driver"
                            />
                            <div>
                                <p>David Miller</p>
                                <p>★ 4.8 · Verified</p>
                            </div>
                        </div>
                    </div>

                    <div className="price-action-section">
                        <div style={{ textAlign: "right" }}>
                            <div className="price-amount"> 800.00</div>
                            <div className="loc-val">Per Seat</div>
                        </div>
                        <button className="select-btn">
                            Select <FaArrowRight size={11} />
                        </button>
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default Search;
