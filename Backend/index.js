const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const HomeRoutes = require('./routes/Home');
const ChatBotRoutes = require('./routes/ChatBot');
const { checkForAuthenticationCookie } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./db/Connect');

require('dotenv').config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-ai-two-nu.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());


app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(checkForAuthenticationCookie());

app.use('/user', userRoutes);
app.use('/', HomeRoutes);
app.use("/blog", blogRoutes);
app.use("/chatbot", ChatBotRoutes);

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`) });