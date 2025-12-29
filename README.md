# 🎫 EventBook - Event Booking Management System

---

## � Summary

**EventBook** is a full-stack web application for booking event tickets online. Users can browse various events like concerts, conferences, workshops, and sports matches, then book tickets seamlessly. The platform also includes an admin panel for managing events, bookings, and users.

### Key Features:
- **User Registration & Login** with secure authentication
- **Password Reset** using OTP verification
- **Event Browsing** with search and category filters
- **Ticket Booking** with seat availability tracking
- **Personal Calendar** showing user's booked events
- **Admin Dashboard** for event and user management
- **Real-time Notifications** for booking updates

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library for building user interfaces |
| Vite | Fast build tool and development server |
| Tailwind CSS | Utility-first CSS framework for styling |
| React Router DOM | Client-side routing |
| Axios | HTTP client for API requests |
| FullCalendar | Calendar component for event display |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime environment |
| Express.js | Web application framework |
| MongoDB Atlas | Cloud-hosted NoSQL database |
| Mongoose | MongoDB object modeling |
| JWT | JSON Web Tokens for authentication |
| bcryptjs | Password hashing |

---

## � Steps to Run the Application

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)
- MongoDB Atlas account

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/event-booking-system.git
cd event-booking-system
```

### Step 2: Setup Backend Server
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Setup Frontend Client
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Run the Application

**Start the Backend:**
```bash
cd server
npm run dev
```

**Start the Frontend (in a new terminal):**
```bash
cd client
npm run dev
```

### Step 5: Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Step 6: Seed Sample Data (Optional)
To add sample events to the database:
```bash
# Make a POST request to the seed endpoint
curl -X POST http://localhost:5000/api/seed
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventmanagement.com | admin123456 |
| User | user@test.com | user123 |

---

## 📁 Project Structure

```
event_managment/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── context/        # Auth context
│   └── package.json
│
├── server/                 # Backend (Node.js)
│   ├── controllers/        # Request handlers
│   ├── models/             # Database schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   └── package.json
│
└── README.md
```


