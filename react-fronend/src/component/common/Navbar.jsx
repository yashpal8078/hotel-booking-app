import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ApiService from "../../service/ApiService";

function Navbar() {
    const isAuthenticated = ApiService.isAthenticated();
    const isCustomer = ApiService.isCustomer();
    const isAdmin = ApiService.isAdmin();
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you want to logout?");
        if (isLogout) {
            ApiService.logout();
            navigate("/home");
        }
    };

    return (
        <nav className={`navbar${scrolled ? " navbar-scrolled" : ""}`}>
            {/* BRAND */}
            <div className="navbar-brand">
                <NavLink to="/home" className="brand-link">
                    <span className="brand-icon">🏨</span>
                    <span className="brand-text">StaySync Hotel</span>
                </NavLink>
            </div>

            {/* NAV LINKS — centered */}
            <ul className="navbar-ul navbar-center">
                <li><NavLink to={"/home"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink></li>
                <li><NavLink to={"/rooms"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Rooms</NavLink></li>
                <li><NavLink to={"/find-booking"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Find Booking</NavLink></li>
                {isCustomer && <li><NavLink to={"/profile"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Profile</NavLink></li>}
                {isAdmin && <li><NavLink to={"/admin"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin</NavLink></li>}
            </ul>

            {/* RIGHT AUTH ACTIONS */}
            <div className="navbar-user-menu">
                {!isAuthenticated && <NavLink to={"/login"} className="nav-link">Login</NavLink>}
                {!isAuthenticated && <NavLink to={"/register"} className="nav-cta-btn">Register</NavLink>}
                {isAuthenticated && <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>}
            </div>
        </nav>
    );
}

export default Navbar;