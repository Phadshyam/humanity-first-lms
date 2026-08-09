# Humanity First Learning Hub (NGO LMS)

A role-based Learning Management System designed for NGOs, field staff, and volunteers. Built on the MERN stack with strict facial consistency assets, offline bandwidth optimization, interactive quiz evaluations, dynamic certificate issuance, and administrative progress analytics.

---

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Distinct workflows for Volunteers, Trainers, and Admins.
- **Interactive Modules & Video Player:** Embedded video lessons, takeaway keypoints, and multi-paragraph detailed field guides.
- **Dynamic Quiz Engine:** Module-specific knowledge checks with instant grading and pass/fail state persistence.
- **Cryptographic Certificate Generation:** Automatic credential issuance upon 100% course completion with printable PDF layout.
- **Admin Analytics Dashboard:** Live MongoDB aggregation tracking active learners, completion rates, and average quiz scores.
- **CSV Data Exporter:** Streamed CSV reports for donor auditing and network progress reporting.
- **Community Forum:** Threaded noticeboard with category filters (`Field Notes`, `Policy Questions`, `Announcements`).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6
- **Backend:** Node.js, Express.js, MongoDB, Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing

---

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Phadshyam/humanity-first-lms.git
cd humanity-first-lms

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 3. Environment Configuration
Create a `.env` file inside `server/` based on `server/.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ngo_lms
JWT_SECRET=super_secret_jwt_key
NODE_ENV=development
```

### 4. Seed Database
In the `server/` directory, seed default accounts, modules, quizzes, and forum threads:
```bash
npm run seed
```

### 5. Running the Application
```bash
# Terminal 1: Start Backend Server (from server/ directory)
npm run dev

# Terminal 2: Start Frontend Application (from client/ directory)
npm run dev
```

---

## 🔐 Default Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@humanityfirst.org` | `password123` |
| **Trainer** | `shyamphad03@gmail.com` | `password123` |
| **Volunteer** | `volunteer@humanityfirst.org` | `password123` |

---
