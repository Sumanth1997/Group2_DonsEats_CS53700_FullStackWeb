const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authenticateToken = require('./middleware/middleware');

// Middleware
app.use(cors()); // Enable CORS (configure it as needed)
app.use(express.json()); // Enable JSON parsing

// Routes
const testRoute = require('./routes/test');
app.use('/api', testRoute);

const { login, register } = require('./controllers/Login');
app.post('/login', login);
app.post('/register', register);

const { home } = require('./controllers/Home');
app.use("/api", home)


// Server Listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
