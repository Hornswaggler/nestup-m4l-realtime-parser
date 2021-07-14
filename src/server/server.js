const createError = require('http-errors');
const express = require('express');
const path = require('path');
const http = require('http');

const DEFAULT_PORT = '3000';

var app = express();

app.use(express.static(path.join(__dirname, '../../public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', DEFAULT_PORT);
const server = http.createServer(app);
server.listen(DEFAULT_PORT);
server.on('listening', onListening);

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = {
  app,
  server
};
