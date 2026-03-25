# StaySync Hotel (React Frontend)

StaySync Hotel is a premium, modern single-hotel booking application built with React. It provides a luxurious user experience featuring glassmorphism design, sleek dynamic animations, and an intuitive room booking flow with secure payment integration.

## ✨ Features

- **Premium UI/UX Design**: Bespoke CSS styling featuring a Royal Blue luxury palette, frosted-glass (glassmorphism) navigation, and smooth `fadeUp` entrance animations.
- **Room Browsing & Filtering**: Easily search and view detailed information for available hotel rooms.
- **Secure Booking Flow**: Select check-in and check-out dates using dynamic calendars and initiate seamless bookings.
- **Razorpay Integration**: Integrated interactive secure payment gateway that auto-populates upon booking, complete with a 30-minute expiration timer to ensure booking availability.
- **User Authentication**: JWT-based login, registration, and user profile management system.
- **Admin Dashboard**: Comprehensive administration panel to manage rooms, monitor guest reservations, and update booking statuses.
- **Find Your Booking**: A dedicated portal for guests to search and check the status of their upcoming reservations using a unique Confirmation Code.

## 🛠 Tech Stack

- **Frontend Framework**: React.js (Create React App)
- **Routing**: `react-router-dom`
- **HTTP Client**: Axios (configured with token-based Interceptors/Headers)
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`)
- **Date Picker**: `react-day-picker`
- **Security & Encryption**: `crypto-js` (for local token/role encryption)
- **Payment Gateway**: Razorpay Checkout SDK

## ⚙️ Prerequisites

- **Node.js** (v14 or higher is recommended)
- **npm** or **yarn**
- A running instance of the StaySync Hotel backend API (default connection expects `http://localhost:7070/api`).

## 🚀 Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-link>
   cd react-fronend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment / Backend**:
   - Ensure the backend REST API is running.
   - By default, the application is configured to connect to `http://localhost:7070/api`. If you need to change this, update the `BASE_URL` in `src/service/ApiService.js`.

4. **Start the development server**:
   ```bash
   npm start
   ```
   The application will run on [http://localhost:3000](http://localhost:3000) by default.

## 🗂 Project Structure
```text
src/
 ├── component/
 │    ├── admin/          # Admin pages (Manage Rooms, View Bookings)
 │    ├── auth/           # Login and Registration components
 │    ├── booking_rooms/  # Room listing, Date Selection, Find Booking Code portal
 │    ├── common/         # Global shared components (Navbar, Footer, Pagination)
 │    ├── home/           # Landing page with hero slider and services
 │    ├── payment/        # Razorpay Checkout page & payment status handling
 │    └── profile/        # User dashboard & edit-profile controls
 ├── service/
 │    ├── ApiService.js   # Master API hook managing Axios calls and JWT routing
 │    └── Guard.js        # Protected route handlers (Admin / Customer walls)
 ├── App.js               # Main application routing logic
 └── index.css            # Global CSS styles including animations and UI variables
```

## 💳 Payment Flow Note
The payment component integrates Razorpay to immediately launch the checkout modal securely as soon as a room is successfully reserved on the backend. The frontend handles dismissal gracefully and leverages persistent session logic (`localStorage`) to enforce a visual 30-minute confirmation threshold before declaring the booking inactive.

## 📄 License
This project is proprietary and built for StaySync Hotel. All rights reserved.

