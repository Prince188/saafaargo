import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const [isAuth, setIsAuth] = useState(null); // null = checking

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    // ⏳ Wait until check completes
    if (isAuth === null) {
        return null; // or loader
    }

    return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;