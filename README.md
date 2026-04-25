# Global Net Worth Tracker - DA219B Fullstack Lab

A multi-currency finance tracker built for international students to aggregate checking, savings, and investment accounts from different countries into a single USD net worth dashboard.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Atlas), Mongoose
- **Styling**: Vanilla CSS

## Project Architecture
This project follows a strict **Router -> Controller -> Model** pattern.
1. `backend/models/`: Defines the Mongoose schemas (User, Account, Snapshot) with robust input validation.
2. `backend/controllers/`: Contains the core business logic and custom aggregation pipelines.
3. `backend/routes/`: Maps Express endpoints to the controller functions.

## Features Implemented
- **Custom React Dashboard**: Renders a dynamic `NetWorthSummary` component fetching aggregated metrics.
- **RESTful API Integration**: Complete CRUD functionality (`GET`, `POST`, `PUT`, `DELETE`) with the backend via a centralized `frontend/src/api.js`.
- **Advanced State Management**: Implemented controlled forms (`AccountForm`) with edit/populate states.
- **Auto-Refresh (Polling)**: Uses `setInterval` in `useEffect` to fetch live data every 30 seconds, including the required `clearInterval` cleanup function to prevent memory leaks.
- **Interactive UI Filter/Sort**: The `AccountList` allows users to dynamically search by country/type and click table headers to sort columns.
- **Robust Error Handling**: Explicit Loading and Error states are conditionally rendered across all fetching components.

## API Endpoints

### POST /api/accounts
Creates a new financial account.
**Body:** `{ name, type, country, currency, balance, institution }`
**Response:** `{ _id, userId, name, type, country, currency, balance, institution, createdAt }`

### GET /api/stats/networth
Returns total net worth in USD with breakdowns.
**Response:** `{ totalUSD: 28420, byCountry: { Sweden: 15640, Ecuador: 9900 }, byType: { savings: 11100, investment: 14800 } }`

## How to Run Locally

### 1. Installation
Install dependencies in the root directory (which runs concurrently for frontend and backend):
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file inside the `/backend` folder with the following:
```
PORT=8000
MONGODB_URI=mongodb+srv://<your_user>:<your_password>@<your_cluster>.mongodb.net/FinanceTracker
```

### 3. Database Seeding
To populate realistic mock data for your dashboard, run the seeder script from the root:
```bash
node backend/seed.js
```

### 4. Run the Servers
```bash
npm run dev
```
- Frontend starts at: `http://localhost:5173`
- Backend API starts at: `http://localhost:8000/api`
