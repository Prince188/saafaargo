// PlainLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const PlainLayout = () => {
    const location = useLocation();
    return <Outlet key={location.pathname} />;
};

export default PlainLayout;
