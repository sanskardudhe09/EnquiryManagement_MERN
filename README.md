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

## 👨‍💻 Developer Guide

### Running the Application

#### Development Mode

1. **Start Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Start Frontend** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

#### Production Build

1. **Build Frontend**

   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend in Production**
   ```bash
   cd backend
   npm run build
   npm start
   ```

## 🧪 Testing

### Backend Tests

#### Unit Tests

```bash
cd backend
npm run test:unit
```

#### Integration Tests

```bash
cd backend
npm run test:integration
```

#### All Tests (Unit + Integration)

```bash
cd backend
npm test
```

### Frontend Tests

#### Unit Tests

```bash
cd frontend
npm run test:unit
```

#### Component Tests

```bash
cd frontend
npm run test:component
```

#### All Tests

```bash
cd frontend
npm test
```

#### Test Coverage

```bash
# For backend
cd backend && npm run test:coverage

# For frontend
cd frontend && npm run test:coverage
```

## 🏗️ System Architecture

```mermaid
graph TD
    %% Client Layer
    A[Web Browser] -->|HTTPS| B[Frontend]
    A -->|PWA Capable| B

    %% Frontend Layer
    subgraph Frontend ["Frontend (React + Vite + TypeScript)"]
        B --> B1[Authentication]
        B --> B2[Enquiry Management]
        B --> B3[User Management]

        B1 --> B1a[Login/Register]
        B1 --> B1b[JWT Handling]

        B2 --> B2a[Create Enquiry]
        B2 --> B2b[View/Edit Enquiry]
        B2 --> B2c[Filter/Search]

        B3 --> B3a[User Profile]
        B3 --> B3b[Admin Dashboard]

        B --> B4[State Management]
        B4 --> B4a[Context API]
        B4 --> B4b[Local Storage]

        B --> B5[API Client]
        B5 --> B5a[Axios]
        B5 --> B5b[Request Interceptors]
    end

    %% API Layer
    B5 -->|REST API| C[Backend API]

    %% Backend Layer
    subgraph Backend ["Backend (Node.js + Express + TypeScript)"]
        C --> C1[API Routes]
        C1 --> C1a[/auth/*]
        C1 --> C1b[/api/enquiries/*]
        C1 --> C1c[/api/users/*]

        C1 --> C2[Middleware]
        C2 --> C2a[JWT Auth]
        C2 --> C2b[Input Validation]
        C2 --> C2c[Error Handling]

        C2 --> C3[Controllers]
        C3 --> C3a[AuthController]
        C3 --> C3b[EnquiryController]
        C3 --> C3c[UserController]

        C3 --> C4[Services]
        C4 --> C4a[AuthService]
        C4 --> C4b[EnquiryService]
        C4 --> C4c[UserService]

        C4 --> C5[Models]
        C5 --> C5a[User]
        C5 --> C5b[Enquiry]
    end

    %% Database Layer
    C5 -->|Mongoose ODM| D[(MongoDB Atlas)]

    %% External Services
    C -->|Logging| E[(Winston Logger)]
    C -->|API Docs| F[Swagger UI]

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px;
    classDef backend fill:#e8f5e9,stroke:#4caf50,stroke-width:2px;
    classDef database fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#ff9800,stroke-width:2px;

    class B,Frontend frontend;
    class C,Backend backend;
    class D database;
    class E,F external;
```

### Architecture Overview

1. **Frontend Layer**
   - Built with React, Vite, and TypeScript for type safety
   - Responsive UI with Tailwind CSS
   - State management using React Context API
   - Protected routes for authenticated access
   - Form handling with React Hook Form

2. **Backend Layer**
   - RESTful API built with Express.js and TypeScript
   - JWT-based authentication
   - Role-based access control (RBAC)
   - Input validation using Zod
   - Centralized error handling
   - Request logging with Winston

3. **Data Layer**
   - MongoDB for flexible document storage
   - Mongoose ODM for schema validation
   - Indexes for optimized queries
   - Data population for related documents

4. **API Documentation**
   - Interactive Swagger UI at `/api-docs`
   - Auto-generated from JSDoc comments
   - Includes request/response schemas
   - Authentication requirements

5. **Development & Build**
   - Hot module replacement in development
   - TypeScript compilation
   - ESLint and Prettier for code quality
   - Husky for git hooks

## 🚀 Deployment

## 📚 API Documentation

The API documentation is available at:

- **Development:** `http://localhost:5000/api-docs`
- **Production:** `https://enquirymanagement-backend.onrender.com/api-docs`

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
