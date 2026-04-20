import React from 'react'
import { FiMapPin, FiCalendar, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const SearchCarSharing = () => {

    // Forces the native date picker to open on the first click
    const handleDateInteraction = (e) => {
        e.target.type = "date";
        if (e.target.showPicker) {
            try {
                e.target.showPicker();
            } catch (error) {
                console.log("Picker triggered");
            }
        }
    };

    const handleDateBlur = (e) => {
        if (!e.target.value) e.target.type = "text";
    };

    return (
        <section className="hero-section">
            <div className="search-area-wrapper">
                <div className="search-bar-card">
                    <div className="search-input-group">
                        <div className="input-with-icon">
                            <FiMapPin />
                            <input type="text" placeholder="Leaving from" />
                        </div>
                        <div className="input-with-icon">
                            <FiMapPin />
                            <input type="text" placeholder="Going to" />
                        </div>
                        <div className="input-with-icon">
                            <FiCalendar />
                            <input
                                type="text"
                                placeholder="Today"
                                onFocus={handleDateInteraction}
                                onBlur={handleDateBlur}
                            />
                        </div>
                        <div className="input-with-icon">
                            <FiCalendar />
                            <input
                                type="text"
                                placeholder="Return date"
                                onFocus={handleDateInteraction}
                                onBlur={handleDateBlur}
                            />
                        </div>
                        <div className="input-with-icon">
                            <FiUser />
                            <input type="text" placeholder="1 passenger" />
                        </div>
                        {/* <button to={"/search"} className="main-search-btn">Search</button> */}
                        <Link to={"/search"} className="main-search-btn">Search</Link>
                    </div>
                </div>

                {/* <div className="search-options-external">
                        <input type="checkbox" id="stays" />
                        <label htmlFor="stays">Show stays</label>
                    </div> */}
            </div>
        </section>
    )
}

export default SearchCarSharing
