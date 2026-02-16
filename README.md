# SKILLBRIDGE - Industry-Grade MERN Learning Platform

A professional, monorepo-based learning platform built with modern technologies.

## 🏗️ Project Structure

```text
skillbridge-monorepo/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
├── backend/           # Node.js + Express + MongoDB + JWT
├── .prettierrc        # Code formatting standards
├── .gitignore         # Version control exclusion rules
└── package.json       # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Setup & Installation

1. **Install all dependencies** (from the root directory):
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables**:
   - `backend/.env`: Update `MONGODB_URI` and `JWT_SECRET`.
   - `frontend/.env`: Ensure `VITE_API_URL` points to your backend.

3. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   This will start both the frontend (Port 5173) and backend (Port 5000) concurrently.

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS** & **Shadcn UI** for premium design
- **Lucide React** for consistent iconography
- **React Router 7** for navigation

### Backend
- **Express.js** RESTful API
- **Mongoose** (MongoDB ODM)
- **JWT** (JSON Web Tokens) for secure authentication
- **Bcrypt.js** for password hashing
- **Express Validator** for request sanitization

## 📜 Key Features
- **Monorepo Architecture**: Simplified dependency management and unified dev workflow.
- **Industry Standards**: Prettier configuration and consistent folder structure.
- **Role-Based Access**: Student, Instructor, and Admin roles.
- **Mock Data Ready**: Frontend works with mock data when backend is offline.

## 📄 License
MIT License
