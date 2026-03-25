const Footer = () => {
    return (
        <footer className="my-footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <div className="footer-brand-name">🏨 StaySync Hotel</div>
                    <p className="footer-tagline">Find your perfect room, anywhere in the world.</p>
                </div>
                <div className="footer-col">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="/rooms">All Rooms</a></li>
                        <li><a href="/find-booking">Find My Booking</a></li>
                        <li><a href="/register">Create Account</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li><a href="/home">Help Centre</a></li>
                        <li><a href="/home">Cancellation Options</a></li>
                        <li><a href="/home">Safety Information</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© 2026 StaySync Hotel. · Privacy · Terms · Sitemap</span>
                <span>🌐 English (IN)</span>
            </div>
        </footer>
    );
};

export default Footer;