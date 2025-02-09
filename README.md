# Group2_DonsEats_CS53700_FullStackWeb

DonsEats is a Purdue Fort Wayne food ordering website designed to simplify on-campus food ordering and pickup for students and restaurant teams.

---

## Project Description
DonsEats is an on-campus food ordering and pickup system tailored for students. The platform offers features like real-time order updates, scheduling future pickups, and bulk ordering, making it convenient for students and enhancing efficiency for restaurant teams.

---

## Key Features
- **User Authentication**:
  - Login and sign up using Firebase Authentication.
  - Role-based sign-up as a student or restaurant owner.
- **Ordering System**:
  - Place bulk orders and schedule future pickups.
  - Real-time updates for order statuses.
- **Dashboard**:
  - Dedicated restaurant dashboard to manage orders efficiently.

---

## Environment Configuration

### Backend
Create a `.env` file in the backend directory and configure the following variables. You can change the `PORT` and `FRONTEND_URL` to your desired values:

```env
PORT=5001
FRONTEND_URL=http://localhost:3000
```

### Frontend
Create a `.env` file in the frontend directory and configure the following variables:

```env
REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_STORAGE_BUCKET=""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
REACT_APP_FIREBASE_MEASUREMENT_ID=""
REACT_APP_API_URL=http://localhost:5001
```

---

## Technologies Used

### Frontend
- **React.js**
- **HTML5**
- **CSS3**
- **JavaScript**

### Backend
- **Node.js**
- **Express.js**
- **Firebase/Auth0**

### Database
- **Firebase**

---

## Deployment Links
- **Deployed Website**: [DonsEats](https://donseats-w5su.onrender.com/)
- **Restaurant Dashboard**: [Dons Restaurant Dashboard](https://donseats-w5su.onrender.com/donsdashboard)

---

## Setup Instructions
1. Clone the repository.
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Configure `.env` files for both backend and frontend as described above.
5. Start the backend server:
   ```bash
   npm start
   ```
6. Start the frontend server:
   ```bash
   npm start
   ```

---

Thank you for exploring DonsEats!
