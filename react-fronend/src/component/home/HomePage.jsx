import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";



const STATS = [
    { number: "10,000+", label: "Happy Guests" },
    { number: "500+", label: "Rooms Available" },
    { number: "4.9★", label: "Average Rating" },
    { number: "24/7", label: "Guest Support" },
];

const TESTIMONIALS = [
    {
        name: "Sarah M.",
        avatar: "SM",
        rating: 5,
        text: "Absolutely stunning rooms and exceptional service. The staff went above and beyond to make our stay memorable!",
        location: "New York, USA",
    },
    {
        name: "James T.",
        avatar: "JT",
        rating: 5,
        text: "StaySync Hotel made booking so easy. Clean, modern rooms with all the amenities. Will definitely book again!",
        location: "London, UK",
    },
    {
        name: "Priya K.",
        avatar: "PK",
        rating: 5,
        text: "The best hotel booking experience I've ever had. Beautiful property and incredibly seamless check-in process.",
        location: "Mumbai, India",
    },
];

const HomePage = () => {
    const [roomSearchResult, setRoomSearchResult] = useState([]);

    const handleSearchResult = (results) => {
        setRoomSearchResult(results);
    };

    return (
        <div className="home">

            {/* ── HERO ─────────────────────────────── */}
            <section className="home-hero">
                <img src="./images/bg.jpg" alt="Hotel" className="home-hero-img" />
                <div className="home-hero-overlay">
                    <h1>Welcome to <span>StaySync Hotel</span></h1>
                    <p>Step into a haven of comfort and care</p>
                    <a href="/rooms" className="hero-cta-btn">Explore Rooms →</a>
                </div>
            </section>



            {/* ── SEARCH BAR ───────────────────────── */}
            <RoomSearch handSearchResult={handleSearchResult} />

            {/* ── SEARCH RESULTS ───────────────────── */}
            {roomSearchResult.length > 0 && (
                <>
                    <p className="section-title">Available Rooms</p>
                    <RoomResult roomSearchResults={roomSearchResult} />
                </>
            )}

            <h4><a className="view-rooms-home" href="/rooms">Browse all rooms →</a></h4>

            {/* ── STATS STRIP ──────────────────────── */}
            <section className="stats-strip">
                {STATS.map((s) => (
                    <div key={s.label} className="stat-item">
                        <span className="stat-number">{s.number}</span>
                        <span className="stat-label">{s.label}</span>
                    </div>
                ))}
            </section>

            {/* ── SERVICES ─────────────────────────── */}
            <h2 className="home-services-heading">What StaySync Hotel offers</h2>
            <section className="service-section">
                <div className="service-card">
                    <img src="./images/ac.png" alt="Air Conditioning" />
                    <div>
                        <h3 className="service-title">Air Conditioning</h3>
                        <p className="service-description">Stay cool throughout your stay with individually controlled in-room air conditioning.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/mini-bar.png" alt="Mini Bar" />
                    <div>
                        <h3 className="service-title">Mini Bar</h3>
                        <p className="service-description">Enjoy a convenient selection of beverages and snacks stocked in your room's mini bar.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/parking.png" alt="Parking" />
                    <div>
                        <h3 className="service-title">Free Parking</h3>
                        <p className="service-description">We offer on-site parking for your convenience. Valet parking options also available.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/wifi.png" alt="WiFi" />
                    <div>
                        <h3 className="service-title">Free Wi-Fi</h3>
                        <p className="service-description">Stay connected with complimentary high-speed Wi-Fi in all guest rooms and public areas.</p>
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────── */}
            <section className="how-it-works">
                <h2 className="section-heading-center">How StaySync Hotel works</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Search</h3>
                        <p>Enter your dates and preferred room type to see all available options instantly.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Book</h3>
                        <p>Pick the perfect room and confirm your reservation in just a few clicks.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Enjoy</h3>
                        <p>Arrive, relax, and enjoy a premium hotel experience tailored to you.</p>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────── */}
            <section className="testimonials-section">
                <h2 className="section-heading-center">What our guests say</h2>
                <div className="testimonials-grid">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} className="testimonial-card">
                            <div className="testimonial-stars">{"★".repeat(t.rating)}</div>
                            <p className="testimonial-text">"{t.text}"</p>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{t.avatar}</div>
                                <div>
                                    <strong>{t.name}</strong>
                                    <span>{t.location}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────── */}
            <section className="cta-banner">
                <h2>Ready to find your perfect room?</h2>
                <p>Join thousands of happy guests who trust StaySync Hotel for their stays.</p>
                <a href="/rooms" className="cta-banner-btn">Browse Rooms</a>
            </section>

        </div>
    );
};

export default HomePage;
