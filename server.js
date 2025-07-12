require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 200,
    message: 'Server is running',
    data: {}
  });
});

app.get('/test', (req, res) => {
  res.json({
    status: 200,
    message: 'Test endpoint working',
    data: {}
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 