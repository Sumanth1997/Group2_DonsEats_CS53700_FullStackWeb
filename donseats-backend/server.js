const express = require('express');
const app = express();

const testRoute = require('./routes/test');
app.use('/api', testRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
