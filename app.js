require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { port, mongoAdress, allowedCors } = require('./utils/const');
const rateLimiter = require('./middlewares/rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errors');
const router = require('./routes/index');

const app = express();

const { PORT = port, MONGO_ADRESS, NODE_ENV } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_ADRESS : mongoAdress);

app.use(requestLogger);
app.use(rateLimiter);
app.use(
  cors({
    option: allowedCors,
    origin: allowedCors,
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
