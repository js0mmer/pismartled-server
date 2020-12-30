require('dotenv').config()
const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const { Gpio } = require('onoff');
const socketIO = require('socket.io');
const led = new Gpio(process.env.GPIO_PORT, 'out');

const index = require('./routes/index');

const app = express();

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', socket => {
  socket.on('led', data => {
    if (data != led.readSync()) {
      led.writeSync(data);
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGINT', () => { // ctrl + c
  led.writeSync(0); 
  led.unexport();
  process.exit();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

app.use(index);

module.exports = app;
