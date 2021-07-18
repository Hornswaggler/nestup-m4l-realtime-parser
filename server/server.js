const createError = require('http-errors');
const express = require('express');
var cors = require('cors')
const path = require('path');
const api = require('./api');

var app = express();

app.use(cors({
  origin: '*'
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(api);

app.use('/', express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  const err = new Error('Request Failed');
  err.status = 404;
  next(err);
});

const startServer = () => {
  try{
    const server = app.listen(0, () => {
      console.log('Listening on ', server.address().port);
    });
    return server;
  } catch(e){
    console.error('Failed to start server: ', e);
  }
};

module.exports = {
  app,
  startServer
};
