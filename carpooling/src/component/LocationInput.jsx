import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

const LocationInput = ({ value, onChange, placeholder }) => {
    const autocompleteRef = useRef(null);

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();

        if (place && place.geometry) {
            onChange({
                address: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });
        }
    };

    return (
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                className="w-full bg-transparent border-none text-[15px] font-inter text-charcoal p-1 focus:outline-none"
            />
        </Autocomplete>
    );
};

export default LocationInput;