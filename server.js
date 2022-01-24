const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const path = require('path');
const passwordEntityRoutes = require('./routes/passwordEntityRoutes')
const authRoutes = require('./routes/authRoutes')
const { auth } = require('./middleware/auth');

// Database
const db = require('./config/database')

// Test DB
db.authenticate()
.then(() => console.log('Database connected ✔'))
.catch(err => console.log('Error: ' + err))

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200 // For legacy browser support
}

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors(corsOptions))
app.use(cookieParser())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => res.send('Welcome to Keeper API'))

// Routes
app.use('/auth', authRoutes)
app.use('/passwordEntity', auth, passwordEntityRoutes);

// 404 Error
app.use((req, res) => {
  res.status(404).json({ message: "Ooops... something went wrong" })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});