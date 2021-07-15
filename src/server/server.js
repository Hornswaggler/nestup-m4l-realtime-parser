const createError = require('http-errors');
const express = require('express');
var cors = require('cors')
const path = require('path');
const api = require('./api');
const maxApi = require('max-api');

const DEFAULT_PORT = '3000';

var app = express();

app.use(cors({
  origin: '*'
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(api);

app.use((req, res, next) => {
  const err = new Error('Request Failed');
  err.status = 404;
  next(err);
});

const server = app.listen(DEFAULT_PORT, () => {
  console.log('Listening on ' + DEFAULT_PORT);
  maxApi.outlet(['uiRefresh']);
});

module.exports = {
  app,
  server
};
