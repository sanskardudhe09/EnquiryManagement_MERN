# Enquiry Management System

A full-stack application built with React + Vite (Frontend) and Node.js + Express + MongoDB (Backend) for managing customer enquiries with role-based access control.

## 🚀 Features

- **User Authentication**
  - Register, Login, and Profile management
  - JWT-based authentication
  - Role-based access control (Admin/Staff/User)

- **Enquiry Management**
  - Create, Read, Update, Delete enquiries
  - Filter and search functionality
  - Status tracking (New, In Progress, Closed)

- **User Management** (Admin Only)
  - View all users
  - Create/Edit/Delete users
  - Assign enquiries to staff

- **API Documentation**
  - Interactive API documentation with Swagger UI
  - Available at `/api-docs` in development

## 🛠 Tech Stack

**Frontend:**

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- React Hook Form
- React Query
- Axios

**Backend:**

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Zod for validation
- Swagger for API documentation

## 📦 Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sanskardudhe09/EnquiryManagement_MERN.git
cd EnquiryManagement_MERN
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# NODE_ENV=development

# Run in development
npm run dev

# Build for production
npm run build
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update VITE_API_URL to point to your backend
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

## 🔧 Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enquiry_management
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📚 API Documentation

The API documentation is available at:

- **Development:** `http://localhost:5000/api-docs`
- **Production:** `https://enquirymanagement-backend.onrender.com/api-docs`

## 🐳 Docker Setup

### Start MongoDB

```bash
docker run -d -p 27017:27017 --name mongo mongo:latest
```

### Backend with Docker

```bash
cd backend
docker build -t enquiry-backend .
docker run -p 5000:5000 --env-file .env --link mongo:mongo enquiry-backend
```

## 🚀 Deployment

### Backend (Render/Heroku)

1. Push your code to the repository
2. Connect to your deployment platform
3. Set environment variables
4. Deploy!

### Frontend (Vercel/Netlify)

1. Connect your repository
2. Set environment variables
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy!

## 📝 Project Structure

```
enquiry-management-system/
├── backend/                 # Backend code
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   └── package.json
│
├── frontend/               # Frontend code
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   └── package.json
│
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
