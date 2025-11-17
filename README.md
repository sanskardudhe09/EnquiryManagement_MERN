# Fullstack Enquiry Management System

A comprehensive enquiry management system built with React + Vite (Frontend) and Node.js + Express + MongoDB (Backend).

## 🚀 Tech Stack

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Radix UI
- Lucide React
- Class Variance Authority
- React Router DOM

### Backend

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Zod Validation
- Bcryptjs

## 📁 Project Structure

```
FullStack_Enquiry/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── .gitignore
├── README.md
└── LICENSE
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enquiry_db
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## 📝 Features

- ✅ User Authentication (Register/Login)
- ✅ Role-based Access Control (Admin/Staff)
- ✅ Enquiry Management (CRUD operations)
- ✅ Dashboard with filtering and search
- ✅ User Management (Admin only)
- ✅ Protected Routes
- ✅ Toast Notifications

## 🧪 Development

- ESLint + Prettier configured
- Husky pre-commit hooks
- TypeScript strict mode

## 📄 License

MIT
