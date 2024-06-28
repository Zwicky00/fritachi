import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import mongoose from 'mongoose';
import log from './utils/logger';
import deserializeUser from './middleware/deserializeUser';

dotenv.config();
const app = express();
const port = process.env.PORT;
const cookieParser = require('cookie-parser');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(deserializeUser);



const MONGO_URL = process.env.MONGO_URL as string
mongoose
  .connect(MONGO_URL)
  .then(() => {
    log.info('Database sucessfully connected');
  }).catch(error => {
    log.error(error,'Failed to connect to the database');
  });

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
  

// Use routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  log.info(`Server is running at http://localhost:${port}`);
});