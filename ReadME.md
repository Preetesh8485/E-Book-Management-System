# 📚 EBMS – E-Book Management System

![MERN](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

A full-stack **MERN-based Library Management System** designed to handle real-world workflows with **secure authentication, automation, and role-based dashboards**.

---

## 🧠 Overview

EBMS simulates a modern digital library system where:

* Users can browse, issue, and manage books
* Admins can control system operations and user activity
* Automated backend processes handle account cleanup, overdue tracking, and fine calculation

---

## ✨ Core Features

### 🔐 Authentication & Security

* OTP-based registration with bcrypt validation
* Secure password hashing using bcrypt
* JWT-based authentication & authorization
* Token-based session handling
* Role-based access control (Admin / Member)

---

### 👤 Member Features

* Register/Login securely
* Browse and search books
* Issue & return books
* View issued books and history
* Track overdue books and fines

---

### 🛠️ Admin Features

* Add / update / delete books
* Manage book availability
* Revoke user access
* Monitor issued books and records
* Upload admin avatar using Cloudinary (with crop feature for privacy)

---

### ⚙️ Automation & Backend Logic

* ⏱️ Automatic removal of unverified accounts using node-cron
* 💰 Automated overdue tracking and fine calculation
* 📧 SMTP-based email system:

  * OTP verification
  * Notifications
  * Custom alerts

---

### 🎨 UI/UX

* Smooth animations using Framer Motion
* Fully responsive (Mobile / Tablet / Desktop)
* Pagination for efficient data handling
* Clean login/registration transitions

---

## 🏗️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Tailwind CSS
* Redux Toolkit
* React Router DOM
* Axios
* Chart.js + React-ChartJS-2
* Framer Motion
* React Toastify
* Lucide React & React Icons
* React Easy Crop

---

### 🔹 Backend

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcrypt
* Nodemailer (SMTP)
* Cloudinary
* Node-Cron
* Express File Upload
* Cookie Parser
* CORS
* Dotenv

---

## 📁 Project Structure

```bash
E-Book-Management-System/
│
├── Backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Business logic
│   ├── middlewear/     # Authentication & validation middleware
│   ├── Models/         # Database schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── EBMS/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── layout/
│       │   ├── pages/
│       │   ├── popup/
│       │   ├── store/
│       │   │   ├── slices/
│       │   │   └── store.js
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── index.css
│       ├── index.html
│       └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Preetesh8485/E-Book-Management-System.git
cd E-Book-Management-System
```

---

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
npm run server
```

⚠️ Create a `.env` file inside the Backend folder and add:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development

SMTP_USER=your_email
SMTP_PASS=your_email_password
SENDER_EMAIL=your_sender_email

JWT_EXPIRE=3d
COOKIE_EXPIRE=3

FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLIENT_NAME=your_cloud_name
CLOUDINARY_CLIENT_API=your_api_key
CLOUDINARY_CLIENT_SECRET=your_api_secret
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend/EBMS
npm install
npm run dev
```

---

## 🌐 Live Demo

🚧 Deployment coming soon...

---

## 📸 Screenshots

*Add screenshots here after deployment*

---

## 🔌 API Overview

* RESTful API built with Express.js
* JWT-protected routes
* CRUD operations for books and users
* Secure authentication & authorization

---

## 📚 Learning Outcomes

* Implemented secure authentication using JWT & bcrypt
* Designed role-based access control system
* Built scalable REST APIs with Express & MongoDB
* Integrated Cloudinary for image storage and cropping
* Used cron jobs for automation tasks
* Developed responsive UI using React & Tailwind
* Advanced filtering & search
* Real-time notifications

---

## 🔮 Future Improvements

* AI-based book recommendation system
* Mobile application

---

## 👨‍💻 Author

**Preetesh Khadanga**

* GitHub: https://github.com/Preetesh8485

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

---
