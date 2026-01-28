# NFC-Based Smart Campus Platform (SaaS)

A SaaS-based Smart Campus system that uses NFC-enabled student ID cards to manage **canteen payments, attendance tracking, and library automation** through a unified platform.

This project is developed as part of our **Project-Based Learning (PBL)** coursework.

---

## 🚀 Project Overview

Educational institutions often rely on separate systems for attendance, library management, and canteen payments. These systems are either manual or poorly integrated, leading to inefficiencies, long queues, and lack of centralized control.

This project proposes a **Software-as-a-Service (SaaS)** solution that integrates all three services using **NFC-based student identification**, accessible from any device with a USB NFC reader.

---

## 🎯 Key Features

- NFC-based student identification
- Cashless canteen payments using a digital wallet
- Automated attendance marking
- Library book issue and return tracking
- Web-based admin dashboard
- Centralized backend and database
- Platform-independent (Windows, Linux, macOS)
- Scalable SaaS architecture

---

## 🏗️ System Architecture

All business logic, security, and data storage are handled on the backend.  
Client devices act only as secure interfaces.

---

## 🧰 Tech Stack

### Backend
- Python
- FastAPI
- SQLite / PostgreSQL
- REST APIs

### Frontend
- HTML, CSS, JavaScript
- React (planned)

### NFC Integration
- USB NFC Reader (ACR122U / compatible)
- Python NFC libraries

### Deployment (Planned)
- Docker
- Cloud hosting (AWS / Render / Railway)

---

## 🧪 Modules

### 1. Canteen Module
- Item selection
- NFC-based payment
- Wallet balance deduction
- Transaction logging

### 2. Attendance Module
- Tap-based attendance marking
- Time-bound validation
- Attendance reports

### 3. Library Module
- Book issue/return using NFC
- Due date tracking
- Student-library mapping

---

## 🔐 Security Considerations

- No sensitive data stored on NFC cards
- NFC cards used only for UID identification
- All validations handled on backend
- Role-based access control (planned)

---

## 👥 Team Members

- **Harman**  
- **Jalaj**  

---

## 📅 Project Status

🟡 In Development  
Currently implementing core SaaS backend and NFC integration.

---

## 📌 Future Scope

- Mobile application
- Analytics dashboard
- Integration with ERP systems
- Biometric + NFC hybrid authentication
- Multi-campus SaaS deployment

---

## 📜 License

This project is developed for academic purposes under MIT License 

