# CENG316 - Graduation Management System

A modern web application built with Next.js, utilizing [Neon PostgreSQL](https://neon.tech) as the database and [Prisma](https://prisma.io/) as the ORM. This system is designed to manage graduation processes efficiently.

## 🚀 Features

- Modern Next.js framework
- Vercel Postgres database integration
- Prisma ORM for database management
- Tailwind CSS for styling
- RESTful API endpoints for UBYS integration

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm package manager
- Git
- A Neon PostgreSQL database account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DogukanTopcu/iyte-gms.git
cd iyte-gms
```

### 2. Environment Setup

Copy the example environment file and configure your variables.
Update the `.env` file with your Vercel Storage Dashboard credentials.

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

The application is deployed to the cloud with [Vercel](https://vercel.com/).

## 📚 API Documentation

### UBYS API Endpoints

#### 1. Admins API
```bash
/ubys/admins
```

**GET Requests:**
- Get all admins: `/ubys/admins`
- Get admin by ID: `/ubys/admins?id={user_id}`
- Get admin by unit: `/ubys/admins?unitName={unit_name}`

**POST Request:**
```json
POST /ubys/admins
{
  "email": "",
  "password": ""
}
```

#### 2. Advisors API
```bash
/ubys/advisors
```

**GET Requests:**
- Get all advisors: `/ubys/advisors`
- Get advisor by ID: `/ubys/advisors?id={user_id}`
- Get advisor by department: `/ubys/advisors?departmentName={department_name}`

**POST Request:**
```json
POST /ubys/advisors
{
  "email": "",
  "password": ""
}
```

#### 3. Initialization API
```bash
/ubys/init
```

**Endpoints:**
- Fetch all admins: `/ubys/init/fetchAdmins`
- Fetch institutions data: `/ubys/init/fetchInstitutions`
  ```json
  {
    "units": [],
    "departments": [],
    "faculties": []
  }
  ```

#### 4. Students API
```bash
/ubys/students
```

**GET Requests:**
- Get all students: `/ubys/students`
- Get students by grade: `/ubys/students?grade={grade}`
- Get student by ID: `/ubys/students?id={student_id}`
- Get student by student ID: `/ubys/students?studentId={student_id}`
- Get students by department: `/ubys/students?departmentId={department_id}`
- Get students by advisor: `/ubys/students?advisorId={advisor_id}`
- Get specific student by advisor: `/ubys/students?advisorId={advisor_id}&studentId={student_id}`

**POST Request:**
```json
POST /ubys/students
{
  "email": "",
  "password": ""
}
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.