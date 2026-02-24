📊 Savra Teacher Insights Dashboard

Savra Teacher Insights Dashboard is a web app that helps school administrators track and understand teacher performance. It shows data about lessons, quizzes, and assessments in a clear and visual way.

It gives real-time insights, charts, and summaries so schools can easily monitor teaching activity and trends.

🎯 Main Features

- Live Dashboard – Quick overview of key numbers and activity
- Teacher Analytics – View and compare individual teacher performance
- Filters – Filter by teacher and time period (Week / Month / Year)
- Charts & Graphs – Clean visual reports using Recharts
- AI Insights – Smart summaries and trend highlights
- Responsive Design – Works smoothly on mobile and desktop
- Multiple Pages – Dashboard, Analytics, Teachers, Settings

🏗️ Architecture 
1️⃣ Frontend (Client Side)

Built with React (Vite)

Styled using Tailwind CSS

Uses Recharts for data visualization

Uses Axios to call backend APIs

# Pages:

Dashboard

Analytics

Teachers

Settings

# Components:

Dashboard Cards

Trend Chart

Teacher Table

Filters & Period Toggle

2️⃣ Backend (Server Side)

Built with Node.js + Express

Handles all API requests

Uses controllers for logic:

Get overview data

Get teacher data

Get trends

Create activity

Validates data before saving

Prevents duplicate entries

3️⃣ Database (Data Layer)

MongoDB Atlas (cloud database)

Uses Mongoose for schemas

Stores activities collection

Indexed fields:

teacher_id

created_at

compound index (teacher_id + activity_type + created_at)

🔗 API Endpoints (Simple Overview)

GET /api/overview → Dashboard summary

GET /api/teachers → All teachers list

GET /api/teacher/:id → Single teacher details

GET /api/trends → Activity trends

POST /api/activity → Add new activity

🚀 Tech Stack
Frontend

React 18 (Vite)

Tailwind CSS

Recharts

React Router

Axios

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

📱 Responsive Design
Mobile

Hamburger sidebar

Single column layout

Stacked charts

Scrollable tables

Desktop

Fixed sidebar

4 summary cards in a row

Side-by-side charts

Full table view

🔒 Data Safety

Duplicate prevention using compound index

Server-side validation

Proper error handling

Loading and retry states

🚦 How to Run
# Backend
cd backend
npm install
npm run import
npm run dev
# Frontend
cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

Backend runs on:
http://localhost:3000

📈 Future Improvements 

- Add Authentication (JWT, roles)

- Real-time updates with WebSockets

- Advanced analytics & reports

- Microservices architecture

- Mobile app version

- AI-powered insights