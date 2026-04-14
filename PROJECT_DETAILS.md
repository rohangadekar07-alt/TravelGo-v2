# Project TravelGO - Technical Documentation 🚀

This document provides a comprehensive overview of the **TravelGO** application, covering its architecture, features, and technical implementation for presentation purposes.

---

## 1. Project Overview
**TravelGO** is a high-end, professional travel booking and inquiry platform. It allows users to explore curated travel destinations, submit inquiries directly via the website or WhatsApp, and make secure bookings with integrated payment gateways. It features a robust **Admin Panel** for managing leads, bookings, and site operations.

### Key Goals:
- Provide a luxury, modern user experience (UX).
- Enable seamless multi-channel support (Inquiry Form + Multiple WhatsApp Contacts).
- Secure payment processing via Razorpay.
- Comprehensive administrative control with role-based access.

---

## 2. Tech Stack 🛠️
The project follows a **MERN-like** architecture (without React, using Vanilla JS for performance and SEO efficiency).

- **Frontend:**
  - **HTML5:** Semantic structure for better SEO and accessibility.
  - **CSS3:** Custom CSS Variables, Flexbox/Grid layouts, and cinematic animations.
  - **JavaScript (Vanilla ES6):** Asynchronous API interactions (Fetch API), Client-side routing logic.
  - **Libraries:** FontAwesome (Icons), Google Fonts (Outfit & Inter), SweetAlert2 (Popups), AOS (Scroll animations).

- **Backend:**
  - **Node.js:** Runtime environment.
  - **Express.js:** Web framework for handling routes and middleware.
  - **MongoDB Atlas:** Cloud-based NoSQL database for flexible data storage.
  - **Mongoose:** ODM for schema modeling and database validation.

- **Authentication & Security:**
  - **JWT (JSON Web Tokens):** Secure session management.
  - **Bcrypt:** Password hashing (where applicable).
  - **Dotenv:** Environment variable management to keep secrets secure.

---

## 3. Folder Structure 📂
```text
TravelGO/
├── models/             # Mongoose Schemas (Inquiry, Booking, User, OTP, etc.)
├── public/             # Static Frontend Files
│   ├── images/         # Asset library (Hero images, destination photos)
│   ├── index.html      # Main Landing Page
│   ├── admin.html      # Admin Dashboard (Protected via Login)
│   ├── script.js       # Main Frontend Logic
│   └── style.css       # Core Styling & Theme System
├── uploads/            # Local storage for profile/receipt images (Local only)
├── .env                # Critical Environment Variables (Secret)
├── server.js           # Main Express Entry Point & API Definitions
├── package.json        # Dependencies & Start Scripts
└── vercel.json         # Deployment configuration for Vercel
```

---

## 4. Key Workflows 🔄

### A. Customer Inquiry Workflow
1. User chooses a destination from the **Destination Grid**.
2. User fills the **Inquiry Form** or clicks **WhatsApp Inquiry**.
3. If WhatsApp is chosen, the user selects between **Travel Desk** or **Support Line** via a professional selection card.
4. Data is stored in MongoDB and also sent to the admin via WhatsApp message.

### B. Secure Booking & Payment
1. User initiates a booking of a specific spot.
2. The server creates a **Razorpay Order ID**.
3. Frontend triggers the **Razorpay Checkout** popup.
4. Upon successful payment, the server **verifies the HMAC signature** to ensure authenticity.
5. A unique **Booking ID** is generated, and data is stored as a "Paid" booking.

### C. Admin Dashboard
1. Admin logs in with credentials (Stored in `.env`).
2. **Dashboard** displays real-time statistics (Total Revenue, Active Bookings, New Inquiries).
3. **Roles:**
   - **Admin/Super Admin:** Full control (Clear data, confirm cash, view all).
   - **Viewer (Rohan):** Read-only access to historical bookings for data verification.

---

## 5. APIs & Endpoints 🔌

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/inquiries` | Submits a new customer inquiry to the database. |
| `POST` | `/api/bookings` | Creates a new booking entry (Pre-confirm). |
| `POST` | `/api/payments/create-order` | Generates a Razorpay Order ID. |
| `POST` | `/api/payments/verify-payment` | Validates Razorpay signature and finalizes booking. |
| `PATCH` | `/api/bookings/:id/confirm-cash`| Marks a cash booking as confirmed (Admin only). |
| `GET` | `/api/admin/data` | Fetches all inquiries and bookings for the dashboard. |
| `POST` | `/api/admin/login` | Validates admin credentials and returns role. |
| `GET` | `/api/bookings/status/:code`| Public endpoint to check specific booking status/receipt. |

---

## 6. Third-Party Integrations 🔗

- **Razorpay Integration:** Handles INR payments securely. Supports UPI, Cards, and Netbanking.
- **Brevo (formerly Sendinblue):** Uses SMTP relay to send automated booking confirmations and inquiry alerts via email.
- **MongoDB Atlas:** Scalable cloud database with automated backups.
- **Vercel:** Used for deployment with Serverless Functions support.

---

## 7. Professional Knowledge "Smart Points" 💡
*For your presentation, highlight these technical features:*

1. **Serverless Ready:** The backend is optimized for **Vercel Serverless Functions**. We use a **Cached MongoDB Connection** pattern in `server.js` to prevent database connection exhaustion during cold starts.
2. **Cinematic UX:** The website uses **AOS (Animate On Scroll)** and custom keyframe animations (`cinematicDrift`) for high-resolution hero sections, creating a premium first impression.
3. **Payment Integrity:** We don't just trust the frontend for payment success. The backend **re-verifies the digital signature** using a SHA-256 HMAC hash before saving the booking.
4. **Adaptive Preloading:** Implemented a **Safety Fallback Preloader** that ensures the site content is accessible within 5 seconds even if large media assets are slow to load.
5. **Role-Based Flexibility:** Features a built-in **Viewer Role** which allows external collaborators to monitor data without compromising administrative security (no delete/clear permissions).

---

## 8. Requirements for Setup 🚀
- **Node.js**: v18+
- **MongoDB**: Atlas Connection URI
- **Provider Keys**: Razorpay Key ID & Secret, Brevo SMTP Credentials.

---
*Created for TravelGO Presentation - 2026*
