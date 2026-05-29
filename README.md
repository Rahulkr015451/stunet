# 🚀 STUNET - Next Generation Talent Acquisition Platform

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-96.6%25-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

[**Live Demo**](https://stunet-blush.vercel.app) • [**Report Bug**](https://github.com/Rahulkr015451/stunet/issues) • [**Request Feature**](https://github.com/Rahulkr015451/stunet/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**STUNET** is a comprehensive, full-stack talent acquisition platform designed to bridge the gap between students seeking career opportunities and employers looking for fresh talent. Built with modern web technologies, it provides a seamless experience for job discovery, applications, and networking.

The platform supports three user roles:
- **Students**: Browse jobs, apply to positions, build profiles, and showcase projects
- **Employers**: Post jobs, review applications, and discover top talent
- **Admins**: Manage platform content, jobs, and courses

---

## ⭐ Key Features

### 🎓 **For Students**
- **Profile Management**: Create comprehensive profiles with education, skills, and experience
- **Skill Showcasing**: Add both predefined and custom skills with proficiency levels (Beginner, Intermediate, Advanced)
- **Project Portfolio**: Showcase projects with GitHub links, live URLs, and tech stack details
- **Job Browsing**: Filter and search jobs by type (Job/Internship) and location
- **Application Tracking**: Submit applications and track their status
- **Resume Upload**: Upload and manage resumes for applications
- **Social Networking**: Follow other students and employers, build your network
- **Direct Messaging**: Real-time communication with employers and other students
- **Course Library**: Access curated learning resources and courses

### 💼 **For Employers**
- **Job Posting**: Create and manage job listings with detailed descriptions
- **Talent Discovery**: Browse and search through verified student profiles
- **Application Management**: Review, shortlist, and manage applicant submissions
- **Application Tracking**: Track status of posted jobs and incoming applications
- **Employer Dashboard**: Centralized hub for all hiring activities
- **Candidate Communication**: Direct messaging with interested candidates

### 🔒 **For Admins**
- **Content Management**: Manage job listings and course content
- **Platform Moderation**: Oversee application processes and user activities
- **Analytics**: Monitor platform statistics and user engagement

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: Next.js 16.1.0 (React 19.2.3)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4 with custom PS5-inspired design system
- **UI Components**: Lucide React (icons)
- **Theme Management**: Next Themes
- **Build Tool**: Next.js built-in tooling

### **Backend**
- **Framework**: Express.js 4.19.2
- **Language**: TypeScript 5.0
- **Database**: PostgreSQL
- **ORM**: Prisma 6.19.1
- **Authentication**: 
  - JWT (JSON Web Tokens)
  - Google OAuth 2.0 (Passport.js)
  - Password-based with bcrypt hashing
- **Security**: 
  - Helmet.js (security headers)
  - CORS protection
  - Rate limiting
  - HTTP Parameter Pollution prevention
- **Environment**: Node.js with dotenv

### **Database**
- **Primary**: PostgreSQL
- **Schema Management**: Prisma Migrations
- **Data Validation**: Prisma schemas with strict typing

---

## 🏗 Project Architecture

```
STUNET/
├── stunet-frontend/          # Next.js frontend application
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   └── public/               # Static assets
│
├── stunet-backend/           # Express.js backend API
│   ├── src/
│   │   ├── auth/            # Authentication logic & Passport config
│   │   ├── routes/          # API route handlers
│   │   │   ├── protected.ts
│   │   │   ├── profile.ts
│   │   │   ├── skills.ts
│   │   │   ├── projects.ts
│   │   │   ├── jobs.ts
│   │   │   ├── applications.ts
│   │   │   ├── chat.ts
│   │   │   └── ...more routes
│   │   ├── middleware/       # Express middleware
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**: Package manager
- **PostgreSQL**: Database (local or cloud)
- **Git**: Version control

### **Before You Begin**
- Ensure you have a PostgreSQL database ready
- Obtain Google OAuth 2.0 credentials from Google Cloud Console
- Prepare environment variable files

---

## 📦 Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/Rahulkr015451/stunet.git
cd stunet
```

### **2. Install Backend Dependencies**
```bash
cd stunet-backend
npm install
```

### **3. Install Frontend Dependencies**
```bash
cd ../stunet-frontend
npm install
```

---

## ⚙️ Configuration

### **Backend Configuration (.env)**

Create a `.env` file in the `stunet-backend` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stunet"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your-secret-key-min-32-characters"
JWT_EXPIRE="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/auth/google/callback"

# Frontend URLs
FRONTEND_URL="http://localhost:3000"
```

### **Frontend Configuration (.env.local)**

Create a `.env.local` file in the `stunet-frontend` directory:

```env
# API
NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"

# Build
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🏃 Running the Application

### **Backend Development Server**

```bash
cd stunet-backend

# Install dependencies (first time only)
npm install

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### **Frontend Development Server**

```bash
cd stunet-frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### **Production Build**

```bash
# Backend
cd stunet-backend
npm run build
npm start

# Frontend
cd stunet-frontend
npm run build
npm start
```

---

## 📁 Project Structure

### **Backend Routes**

```
/auth                          # Authentication routes
  - POST /auth/register       # Register new user
  - POST /auth/login          # Login with email/password
  - GET /auth/google          # Google OAuth login
  - GET /auth/google/callback # OAuth callback

/api/profile                    # Student profile management
  - GET /profile              # Get user profile
  - PUT /profile              # Update profile

/api/skills                     # Skill management
  - GET /skills               # Get all skills
  - POST /skills              # Add skill to user
  - DELETE /skills/:id        # Remove skill

/api/projects                   # Project portfolio
  - GET /projects             # Get user projects
  - POST /projects            # Create new project
  - PUT /projects/:id         # Update project
  - DELETE /projects/:id      # Delete project

/api/employer/jobs              # Employer job management
  - POST /jobs                # Post new job
  - GET /jobs/:id             # Get job details
  - PUT /jobs/:id             # Update job

/api/employer/applications      # Employer application review
  - GET /applications         # Get applications for jobs
  - PUT /applications/:id     # Update application status

/api/jobs                       # Public job listings
  - GET /jobs                 # Get all jobs
  - GET /jobs/:id             # Get job details

/api/applications               # Student applications
  - POST /applications        # Submit application
  - GET /applications         # Get user applications

/api/follow                     # Social networking
  - POST /follow/:userId      # Follow user
  - DELETE /follow/:userId    # Unfollow user

/api/chat                       # Messaging
  - GET /conversations        # Get conversations
  - POST /conversations/:userId # Start conversation
  - GET /conversations/:id    # Get messages

/api/public/courses             # Course listings
  - GET /courses              # Get all courses

/api/admin                      # Admin management
  - GET /admin/jobs           # Admin job management
  - GET /admin/courses        # Admin course management
```

---

## 🗄 Database Schema

### **Core Models**

#### **User**
Central model for all users (students, employers, admins)
```prisma
- id: UUID (primary key)
- googleId: String (optional, for OAuth)
- email: String (unique)
- password: String (hashed)
- name: String
- image: String (profile picture URL)
- role: Role (student | employer | admin)
- createdAt: DateTime
```

#### **StudentProfile**
Extended profile for students
```prisma
- id: UUID
- college: String
- degree: String
- graduationYear: String
- bio: String
- resumeUrl: String (optional)
- linkedInUrl: String (optional)
- location: String (optional)
```

#### **Skill & UserSkill**
Skills management system
```prisma
Skill:
  - id: UUID
  - name: String (unique)

UserSkill:
  - id: UUID
  - userId: String (FK)
  - skillId: String (FK)
  - level: SkillLevel (beginner | intermediate | advanced)
```

#### **CustomSkill**
User-defined skills
```prisma
- id: UUID
- userId: String (FK)
- name: String
- level: SkillLevel
```

#### **Project**
Student portfolio projects
```prisma
- id: UUID
- userId: String (FK)
- title: String
- description: String
- techStack: String
- githubUrl: String (optional)
- liveUrl: String (optional)
- isPublic: Boolean (default: true)
```

#### **Job**
Job listings posted by employers
```prisma
- id: UUID
- employerId: String (FK)
- title: String
- company: String
- location: String
- description: String
- type: String (Job | Internship)
- status: String (PENDING | APPROVED)
```

#### **Application**
Job applications from students
```prisma
- id: UUID
- jobId: String (FK)
- studentId: String (FK)
- employerId: String (FK)
- status: String (APPLIED | SHORTLISTED | REJECTED | SELECTED)
- resumeUrl: String (optional)
- createdAt: DateTime
```

#### **Course**
Learning resources and courses
```prisma
- id: UUID
- title: String
- description: String
- link: String
```

#### **Follow**
Social network connections
```prisma
- id: UUID
- followerId: String (FK)
- followingId: String (FK)
- createdAt: DateTime
```

#### **Conversation & Message**
Direct messaging system
```prisma
Conversation:
  - id: UUID
  - userAId: String (FK)
  - userBId: String (FK)

Message:
  - id: UUID
  - conversationId: String (FK)
  - senderId: String (FK)
  - text: String
```

---

## 🔐 Security Features

### **Implemented Security Measures**

✅ **Authentication & Authorization**
- JWT-based token authentication
- Google OAuth 2.0 integration
- Password hashing with bcryptjs
- Role-based access control (RBAC)

✅ **API Security**
- Helmet.js for security headers
- CORS protection with allowed origins
- Rate limiting (100 requests per 15 minutes)
- HTTP Parameter Pollution (HPP) prevention
- Request size limits (10MB for JSON)

✅ **Database Security**
- Prisma ORM for SQL injection prevention
- Environment variable management
- Prepared statements

✅ **Best Practices**
- HTTPS support
- Secure cookie handling
- Load balancer trust configuration
- Trusted proxy setup for production

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🌐 Deployment

The application is deployed on:
- **Frontend**: [Vercel](https://stunet-blush.vercel.app)
- **Backend**: [Render](https://render.com)

### **Deployment Environment Variables**
Ensure all production environment variables are configured properly before deployment.

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/Rahulkr015451/stunet/issues)
- **Developer**: [@Rahulkr015451](https://github.com/Rahulkr015451)

---

## 🙏 Acknowledgments

- Built with modern TypeScript and full-stack technologies
- Inspired by professional talent acquisition platforms
- Community contributions and feedback

---

<div align="center">

**[⬆ back to top](#-stunet---next-generation-talent-acquisition-platform)**

Made with ❤️ by [Rahulkr015451](https://github.com/Rahulkr015451)

</div>