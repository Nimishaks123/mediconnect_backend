# MediConnect Backend

The MediConnect Backend is a RESTful API built with Node.js, Express, TypeScript, and MongoDB. It powers the MediConnect healthcare platform by providing secure authentication, appointment management, payments, real-time communication, digital prescriptions, and administrative features.

## Features

### Authentication
- JWT Authentication
- Refresh Token Support
- Google OAuth
- Email OTP Verification
- Forgot & Reset Password
- Role-Based Access Control

### Patient
- Profile Management
- Doctor Search & Filtering
- Appointment Booking
- Appointment Cancellation & Rescheduling
- Wallet Management
- Payment Integration
- Chat & Video Consultation
- Prescription Access
- Notifications

### Doctor
- Professional Onboarding
- Document Verification
- Availability Management
- Appointment Management
- Prescription Management
- Earnings & Dashboard

### Administrator
- Doctor Verification
- User Management
- Appointment Monitoring
- Platform Wallet
- Transaction Management
- Dashboard & Analytics

## Technology Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

### External Services

- JWT
- Google OAuth
- Stripe
- Cloudinary
- Socket.IO
- WebRTC
- Node Cron
- Nodemailer

## Project Architecture

The project follows **Clean Architecture** to keep business logic independent from frameworks and infrastructure.

```
src
├── domain
├── application
├── infrastructure
├── presentation
├── main
└── shared
```

### Design Principles

- Clean Architecture
- Dependency Injection
- Repository Pattern
- SOLID Principles
- DTO-Based Communication
- Domain-Driven Design Concepts

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Environment Variables

Create a `.env` file and configure the required environment variables before running the application.

Typical configuration includes:

- MongoDB Connection
- JWT Secrets
- Google OAuth Credentials
- Stripe Keys
- Cloudinary Credentials
- SMTP Configuration
- Frontend URL
- Port

## API

The backend exposes REST APIs for:

- Authentication
- Patients
- Doctors
- Appointments
- Prescriptions
- Wallet
- Payments
- Chat
- Notifications
- Admin

## Project Status

The backend is production-ready and designed with scalability, maintainability, and modularity in mind.

## Author

**Nimisha K S**

MERN Stack Developer