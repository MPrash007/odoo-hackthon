# ✈️ Traveloop

**Traveloop** is a full-stack travel planning web application that lets users build multi-city itineraries, track budgets, share journeys with the community, and even generate complete AI-powered trip plans — all in one beautiful, dark-themed interface.

---

## 🌟 Features

- **AI Trip Planner** — Generate full day-by-day itineraries with a single prompt using the Groq LLaMA AI model.
- **My Trips** — Create, manage, and track all your personal travel plans.
- **Itinerary Builder** — Build detailed itineraries with activities, costs, dates, and notes.
- **Community Feed** — Explore and like public trip plans shared by other travelers. Copy any community trip to your own plans.
- **Discover Cities** — Browse curated cities and activities.
- **Budget Tracker** — Track spending per trip with real-time budget summaries.
- **User Authentication** — Secure JWT-based register/login with profile photo upload (Cloudinary).
- **Responsive UI** — Premium dark glassmorphism design with smooth animations (Framer Motion).

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Purpose |
|---|---|
| React + Vite | UI Framework & Build Tool |
| React Router DOM | Client-side Routing |
| Framer Motion | Animations & Transitions |
| Lucide React | Icon Library |
| Axios | HTTP Client |
| React Hot Toast | Notifications |
| Recharts | Data Visualizations |
| Vanilla CSS | Custom Design System |

### Backend (Server)
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API Server |
| MongoDB Atlas | Cloud Database |
| Mongoose | ODM / Schema Validation |
| JSON Web Tokens (JWT) | Authentication |
| Groq SDK (LLaMA 3.3) | AI Itinerary Generation |
| Cloudinary | Profile Photo Uploads |
| Multer | File Handling |
| Bcrypt.js | Password Hashing |
| dotenv | Environment Configuration |

---

## 📁 Project Structure

```
Traveloop/
├── client/                      # React + Vite frontend
│   └── src/
│       ├── assets/              # Images & logo
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── TripCard.jsx
│       │   ├── AIForm.jsx
│       │   ├── ItineraryResult.jsx
│       │   └── LoadingSpinner.jsx
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state
│       ├── pages/               # Route-level page components
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── TripsPage.jsx
│       │   ├── CommunityPage.jsx
│       │   ├── AITripPlannerPage.jsx
│       │   ├── ItineraryBuilderPage.jsx
│       │   └── ItineraryViewPage.jsx
│       ├── services/            # API service modules
│       │   ├── authService.js
│       │   ├── tripService.js
│       │   └── activityService.js
│       └── index.css            # Global design system
│
├── server/                      # Node.js + Express backend
│   ├── config/
│   │   ├── db.js                # MongoDB Atlas connection
│   │   └── groqClient.js        # Groq AI SDK setup
│   ├── controllers/             # Route handler logic
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── itineraryController.js
│   │   ├── activityController.js
│   │   └── aiController.js      # AI generation + save
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Trip.js
│   │   ├── Itinerary.js
│   │   ├── Activity.js
│   │   ├── City.js
│   │   ├── Note.js
│   │   └── ChecklistItem.js
│   ├── routes/                  # Express route definitions
│   ├── utils/
│   │   ├── seedData.js          # Database seeder
│   │   ├── seedCities.js        # City seeder
│   │   ├── createDemoTrip.js    # Demo trip creator
│   │   └── migrateToAtlas.js   # Local → Atlas migration
│   └── server.js                # App entry point
│
├── .env                         # Environment variables
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local) or a **MongoDB Atlas** account
- A **Groq API Key** (free at [console.groq.com](https://console.groq.com))
- A **Cloudinary** account (free) for photo uploads

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/traveloop.git
cd traveloop
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/traveloop?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Client (Vite)
VITE_API_BASE_URL=http://localhost:5000/api

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Run the App

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🤖 AI Trip Planner

The AI Planner uses the **Groq API** with the `llama-3.3-70b-versatile` model to generate structured itineraries via **Server-Sent Events (SSE)** for real-time streaming.

To use it:
1. Navigate to the **AI Planner** tab.
2. Fill in destination, dates, budget, and travel style.
3. Click **Generate Itinerary**.
4. Review the plan and click **Save to My Trips** to persist it.

---

## 🗄️ Database Migration (Local → Atlas)

If you have existing data in a local MongoDB instance that you want to move to Atlas, run the migration utility:

```bash
node server/utils/migrateToAtlas.js
```

This will copy all collections and documents from `mongodb://localhost:27017/traveloop` into your Atlas cluster, clearing any existing Atlas data first to prevent duplicates.

---

## 📸 Screenshots

> _Add screenshots of the Dashboard, AI Planner, Community, and Itinerary Builder pages here._

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Prakash Gupta**  
Built with ❤️ for the Odoo Hackathon
