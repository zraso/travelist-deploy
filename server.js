/* eslint-disable consistent-return */
/* eslint-disable no-console */

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3001;
const logger = require('morgan');
const mongoose = require('mongoose');
const tripsRoutes = require('./src/routes/tripsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const itemsRoutes = require('./src/routes/itemsRoutes');
const HttpError = require('./src/models/http-error');

dotenv.config();
const app = express();

app.use(cors());

// optional: parses the request body to be a readable json format (for logging and bodyParser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use('/api/trips', tripsRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

// connect to DB and start the server
mongoose
  .connect(process.env.MONGODB_DEV, { useNewUrlParser: true }, () => console.log('connected to database'))
  .then(() => {
    app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));
  })
  .catch((err) => {
    console.log(err);
  });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
