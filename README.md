# 🌿 EcoTwin AI – AI-Powered Sustainability Intelligence Platform

> Transforming sustainability data into intelligent insights using Artificial Intelligence, Machine Learning, and Digital Twins.

![License](https://img.shields.io/badge/License-MIT-green)
![React](https://img.shields.io/badge/React-19-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![FastAPI](https://img.shields.io/badge/FastAPI-AI%20Service-009688)
![Gemini](https://img.shields.io/badge/Google-Gemini-orange)

---

## 📖 Overview

EcoTwin AI is an enterprise-grade AI-powered Sustainability Intelligence Platform designed for universities, industries, smart campuses, and organizations.

The platform enables users to monitor, analyze, predict, and optimize sustainability metrics including:

- ⚡ Electricity Consumption
- 💧 Water Usage
- ♻️ Waste Generation
- 🌍 Carbon Emissions

EcoTwin AI combines Artificial Intelligence, Machine Learning, Digital Twin visualization, and interactive analytics to help organizations make smarter environmental decisions.

---

# 🚀 Features

## 📊 Sustainability Dashboard

- Real-time KPI Cards
- Interactive Charts
- Building-wise Analytics
- Campus Sustainability Score
- Dark / Light Mode

---

## 🏢 Building Management

- Building-wise Monitoring
- Health Status (Green / Yellow / Red)
- Occupancy Analytics
- Building Comparison
- Baseline Consumption

---

## 🤖 EcoTwin Copilot (AI Assistant)

Google Gemini powered RAG Assistant capable of:

- Executive Summaries
- Building Comparison
- Sustainability Insights
- Carbon Reduction Recommendations
- Natural Language Queries
- AI Generated Reports

Example Questions

- Why is Engineering Hall consuming more electricity?
- Compare Science Complex and Innovation Tower.
- Generate a campus sustainability summary.
- Suggest ways to reduce carbon emissions.

---

## 📈 AI Predictions

Machine Learning powered forecasting

- 7-Day Forecast
- 30-Day Forecast
- 90-Day Forecast

Algorithms

- Random Forest
- Prophet

---

## 🚨 AI Anomaly Detection

Isolation Forest detects

- Electricity Spikes
- Water Leaks
- Waste Anomalies
- Carbon Outliers

---

## 🌎 Digital Twin

Interactive Campus Map

- Live Building Status
- Color-coded Buildings
- Energy Monitoring
- Solar Data
- HVAC Monitoring
- Occupancy Information

---

## ♻️ Carbon Calculator

Calculate

- Scope 1 Emissions
- Scope 2 Emissions
- Scope 3 Emissions

Includes

- Tree Equivalence
- Offset Simulation
- Carbon Reduction Planner

---

## 📁 Data Upload

Supports

- CSV Upload
- Excel Upload
- Manual Data Entry
- Data Preview
- Validation

---

## 📄 Report Generator

Generate professional sustainability reports

- PDF Reports
- Executive Summary
- Building Reports
- Date Filters
- Download Reports

---

## 🔔 Notifications

Receive alerts for

- Electricity Spike
- Water Leakage
- High Carbon Emissions
- Low Sustainability Score

---

# 🏗️ System Architecture

```
                     Frontend (Next.js + React)
                              │
                              │ REST API
                              ▼
                     Express.js Backend
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
       MongoDB Database                FastAPI AI Service
                                              │
                              ┌───────────────┴──────────────┐
                              ▼                              ▼
                   Machine Learning                 Google Gemini API
```

---

# 🛠️ Tech Stack

## Frontend

- Next.js 16
- React 19
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons
- React Hot Toast

---

## Backend

- Express.js
- Node.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Nodemailer
- PDFKit
- XLSX
- CSV Parser

---

## AI & Machine Learning

- Python
- FastAPI
- Pandas
- Scikit-Learn
- Isolation Forest
- Random Forest
- Prophet
- Google Gemini API

---

## Database

MongoDB Collections

- Users
- Buildings
- SustainabilityData
- Predictions
- Reports
- Notifications
- ChatHistory

---

# 📂 Project Structure

```
EcoTwin-AI/

│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── seed.js
│
├── ai-service/
│   ├── main.py
│   ├── models/
│   └── services/
│
└── README.md
```

---

# 🔐 User Roles

### 👨‍💼 Admin

- User Management
- Building Management
- Report Generation
- Dashboard Access
- System Configuration

---

### 👨‍💻 Staff

- Upload Sustainability Data
- Generate Reports
- AI Insights
- Carbon Calculator

---

### 👀 Viewer

- View Dashboard
- Analytics
- AI Reports

---

# 🧠 AI Features

- Google Gemini RAG Assistant
- Executive Summary Generator
- Sustainability Recommendations
- Building Comparison
- AI Forecasting
- Anomaly Detection
- Carbon Optimization

---

# 📷 Screenshots

## Dashboard

<img width="1888" height="921" alt="image" src="https://github.com/user-attachments/assets/03424475-a0c6-42ba-8697-48de30248a78" />
---

## Analytics

<img width="1909" height="783" alt="image" src="https://github.com/user-attachments/assets/21af5663-aa01-410f-86ed-2951443e82ec" />

---

## AI Copilot

<img width="1893" height="919" alt="image" src="https://github.com/user-attachments/assets/227693da-4b85-44de-9682-88a60edd6cf7" />

---

## Digital Twin

<img width="1894" height="752" alt="image" src="https://github.com/user-attachments/assets/65a84d38-3b24-4a90-83d7-f737705aaf25" />

---

## Predictions

<img width="1896" height="910" alt="image" src="https://github.com/user-attachments/assets/a953efc6-d3b2-41fd-b9a5-6215a9d02f63" />

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/EcoTwin-AI.git

cd EcoTwin-AI
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## AI Service

```bash
cd ai-service

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 🔑 Environment Variables

Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

GEMINI_API_KEY=your_api_key

EMAIL_USER=your_email

EMAIL_PASS=your_password
```

---

Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

AI Service (.env)

```env
GEMINI_API_KEY=your_api_key
```

---

# 🧪 Testing

- JWT Authentication
- Role-Based Access
- CSV Upload
- AI Chat
- Forecasting
- PDF Generation
- Digital Twin
- Carbon Calculator

---

# 🎯 Future Scope

- IoT Sensor Integration
- Live Smart Meter Data
- Mobile Application
- ESG Reporting
- Multi-Campus Deployment
- Renewable Energy Analytics
- Predictive Maintenance
- Real-Time Streaming

---

# 👩‍💻 Author

**Saumya Kushwaha**

Final Year B.Tech Student

Full Stack Developer | AI Enthusiast

GitHub: https://github.com/saumya-2005

LinkedIn: https://www.linkedin.com/in/saumya-kushwaha-691457301/

---

# 📜 License

This project is licensed under the MIT License.

---

## ⭐ If you like this project, consider giving it a Star on GitHub!
