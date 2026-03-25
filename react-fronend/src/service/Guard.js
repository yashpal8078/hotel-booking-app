import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import ApiService from "./ApiService";

export const CustomerRoute = ({ element: Component }) => {
    const location = useLocation();

    if (!ApiService.isAthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return Component;
};

export const AdminRoute = ({ element: Component }) => {
    const location = useLocation();

    // Not logged in at all → go to login
    if (!ApiService.isAthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Logged in but not admin → go home (prevents infinite redirect loop)
    if (!ApiService.isAdmin()) {
        return <Navigate to="/home" replace />;
    }

    return Component;
};