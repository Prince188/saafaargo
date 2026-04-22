import { useLocation, useNavigate } from "react-router-dom";
import MapPicker from "../component/MapPicker";

const DestinationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { formData, pickup } = location.state || {};

    const handleDestinationSelect = (destinationLocation) => {
        const finalData = {
            ...formData,
            pickup,
            destination: destinationLocation,
        };

        console.log("FINAL DATA:", finalData);

        // ✅ Redirect to route preview page
        navigate("/offer-ride/route-preview", {
            state: finalData,
        });
    };

    return (
        <div>
            <h2>Select Destination Location</h2>

            {/* ✅ FIXED */}
            <MapPicker onSelect={handleDestinationSelect} />
        </div>
    );
};

export default DestinationPage;