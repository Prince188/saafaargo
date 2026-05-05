// src/component/AdminRoute.jsx

import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // ❌ Not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // ❌ Not admin
    if (user.role !== "admin") {
        return <Navigate to="/" />;
    }

    // ✅ Admin allowed
    return children;
};

export default AdminRoute;