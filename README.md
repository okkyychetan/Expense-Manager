# 💰 Expenses Manager

Expenses Manager is a full-stack finance management web application built using React.js, Spring Boot, and MySQL. The application helps users manage their income and expenses efficiently through a secure and user-friendly dashboard.

This project includes authentication, transaction management, analytics, category management, profile handling, and data visualization features. It is designed with a modern responsive UI and focuses on both backend architecture and frontend user experience.

---

# 🚀 Features

## 🔐 Authentication & Security
- User Registration & Login
- JWT Authentication
- Secure REST APIs
- Protected Routes

## 💵 Income & Expense Management
- Add Income & Expenses
- Edit Transactions
- Delete Transactions
- Real-time Balance Calculation
- Transaction History

## 🗂️ Category Management
- Create Categories
- Update Categories
- Delete Categories
- Separate Income & Expense Categories

## 📊 Dashboard & Analytics
- Financial Dashboard
- Income vs Expense Overview
- Interactive Charts & Graphs
- Transaction Filtering
- Financial Insights

## 👤 User Profile
- User Profile Management
- Profile Picture Upload using Cloudinary

## 📁 Additional Features
- Excel Export Functionality
- Email Report Support
- Toast Notifications
- Responsive UI Design

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Recharts

## Backend
- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs
- Maven

## Database
- MySQL

## Cloud Services
- Cloudinary


---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/expenses-manager.git
```

---

# 🔧 Backend Setup

## Navigate to Backend Folder

```bash
cd backend
```

## Configure Database

Open `application.properties` and configure MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expenses_manager
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Run Backend Server

```bash
mvn spring-boot:run
```

Backend will run on:

```bash
http://localhost:8080
```

---

# 🎨 Frontend Setup

## Navigate to Frontend Folder

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend Server

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔑 Environment Variables

## Backend Configuration

```properties
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 📊 Core Modules

| Module | Description |
|--------|-------------|
| Authentication | User Login & Registration |
| Dashboard | Financial Overview & Analytics |
| Income | Income Management |
| Expense | Expense Management |
| Categories | Transaction Categories |
| Reports | Charts & Financial Reports |
| Profile | User Profile Management |

---

# 📸 Screenshots

Add project screenshots here:

- Login Page
- Register Page
- Dashboard
- Income Module
- Expense Module
- Analytics Dashboard
- Reports Section

---

# 📚 Learning Outcomes

This project helped in understanding:

- Full-Stack Development
- REST API Development
- Spring Security & JWT
- Database Management with MySQL
- Frontend & Backend Integration
- State Management in React
- Responsive UI Design
- Financial Data Visualization

---

---


# ⭐ Support

If you found this project useful, give it a ⭐ on GitHub.

---

# 📌 Project Status

✅ Completed  
🚀 Open for Improvements & Contributions
