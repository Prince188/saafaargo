// MainLayout.jsx
import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
    const location = useLocation();
    return (
        <>
            <Navbar />
            <Outlet key={location.pathname} />
            <Footer />
        </>
    );
};

export default MainLayout;
