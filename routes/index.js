const express = require('express');
const router = express.Router();
const { Gpio } = require('onoff');
const led = new Gpio(process.env.GPIO_PORT, 'out');

router.get('/', function(req, res, next) {
  res.render('index', { status: led.readSync() });
});

module.exports = router;
