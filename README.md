# Humanity First Learning Hub

> **Empowering NGO volunteers, trainers, and field representatives with purpose-driven learning and operational readiness.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🔗 Live Application Link

* **Live Web Application:** [https://humanity-first-ngo.vercel.app/](https://humanity-first-ngo.vercel.app/)

---

## ✨ Project Overview & Highlights

Humanity First Learning Hub is a production-ready Learning Management System (LMS) specifically tailored for non-governmental organizations (NGOs) and humanitarian aid groups. The platform equips field volunteers, instructors, and operational staff with core ethics, child safeguarding protocols, emergency first aid guidelines, and field safety procedures prior to deployment.

### Key Capabilities

* **Role-Based Access Control (RBAC):** Strict multi-tiered access control enforcing distinct permissions across `admin`, `trainer`, `volunteer`, and `field_worker` roles.
* **Interactive Course Engine:** Step-by-step orientation curriculum featuring formatted Markdown field manuals, responsive 16:9 ratio embedded video lessons, progress tracking, and dynamic module status badges (`Not Started`, `In Progress`, `Completed`).
* **Knowledge Checks & Assessment Editor:** Automated scoring engine for student quizzes with explanation feedback, alongside an intuitive quiz creation/editing workspace for instructors.
* **Community Discussion Forum:** Real-time thread feed with category filters (`Field Notes`, `Policy Questions`, `Announcements`), full-screen modal overlays, and nested reply threads.
* **Administration Dashboard:** Real-time platform analytics, pass-rate progress visualizers, CSV report generation, and full user account management (role switching, adding users, account deletion).
* **Serverless Backend Architecture:** Connection-cached Mongoose driver optimized for zero-cold-start execution on Vercel Serverless Functions.

---

## 🔒 Access Control Matrix

| Feature / Page Route | Admin | Trainer | Volunteer | Field Worker | Public |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Overview / Dashboard (`/`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| My Learning / Courses (`/course`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Study Modules & Videos (`/module/:id`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Knowledge Check Quizzes | ✅ | ✅ | ✅ | ✅ | ❌ |
| Community Forum (`/forum`) | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create / Edit Modules & Quizzes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Admin Control Panel (`/admin`) | ✅ | ❌ | ❌ | ❌ | ❌ |
| User Sign In & Registration | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🛠️ Architecture & Tech Stack

```
HUMANITY FIRST LMS
├── client/ (React 18 + Vite + Tailwind CSS + Lucide Icons)
└── server/ (Node.js + Express.js + Mongoose + JWT + Vercel Serverless)
```

* **Frontend:** React 18, Vite 5, Tailwind CSS, Lucide React Icons, React Router v6
* **Backend:** Node.js, Express.js, Mongoose ODM, JSON Web Tokens (JWT), Bcrypt.js
* **Database:** MongoDB Atlas (Cloud Database)
* **Deployment:** Vercel (Client App & Serverless API Functions)

---

## 💻 Local Developer Setup

### Prerequisites
* [Node.js (v18+)](https://nodejs.org/)
* [Git](https://git-scm.com/)
* [MongoDB Atlas Account or Local MongoDB Instance](https://www.mongodb.com/cloud/atlas)

### Installation

1. **Clone Repository:**
   ```bash
   git clone https://github.com/Phadshyam/humanity-first-lms.git
   cd humanity-first-lms
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside `server/`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Run initial seed script:
   ```bash
   npm run seed
   ```
   Start development API server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file inside `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start development Vite server:
   ```bash
   npm run dev
   ```

---

## 🔑 Demo Account Roles

| Role | Sample Email | Access Capabilities |
| :--- | :--- | :--- |
| **Admin** | `admin@humanityfirst.org` | Full administrative platform control, user directory management, CSV exports |
| **Trainer** | `trainer@humanityfirst.org` | Curriculum creation, module management, quiz editing, student assessment |
| **Volunteer** | `volunteer@humanityfirst.org` | Standard orientation curriculum, video lessons, quiz participation |
| **Field Worker** | `fieldworker@humanityfirst.org` | Operational protocols, emergency response guides, community forum participation |

---

## 📜 License

Developed for **Humanity First NGO Learning Hub** © 2026. All rights reserved.
