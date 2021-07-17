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

// app.use(api);

app.use('/', express.static(path.join(__dirname, '../../public')));

app.use((req, res, next) => {
  const err = new Error('Request Failed');
  err.status = 404;
  next(err);
});

const server = (port = DEFAULT_PORT) => {
  try{
    return app.listen(port, () => {
      console.log('Listening on ' + port);
    });
  } catch(e){
    console.error('Failed to start server: ', e);
  }
};

module.exports = {
  app,
  server
};
