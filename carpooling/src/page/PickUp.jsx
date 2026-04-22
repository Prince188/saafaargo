import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import MapPicker from '../component/MapPicker';

const PickUp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state?.formData || {};

    const handlePickupSelect = (pickupLocation) => {
        navigate("/offer-ride/destination", {
            state: {
                formData,
                pickup: pickupLocation,
            },
        });
    };

    return (
        <div>
            <h2>Select Pickup Location</h2>

            {/* ✅ FIXED */}
            <MapPicker onSelect={handlePickupSelect} />
        </div>
    )
}

export default PickUp