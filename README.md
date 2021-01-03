# pismartled-server

A simple Socket.IO server for interfacing with a pi-connected LED strip. This project also includes a basic web interface to toggle the LEDs which can be expanded upon.

## Table of Contents
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Setup](#setup)
  * [Development](#development)
  * [Production](#production)
* [Communicating with the socket](#communicating-with-the-socket)
  * [Examples](#examples)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/)

### Setup

1. Clone the repository onto your pi and enter the directory

```sh
git clone https://github.com/js0mmer/pismartled-server pismartled && cd pismartled
```
2. Install node packages

```sh
yarn
```

3. Copy .env.example to .env and edit your port numbers with your text editor of choice.  You should have the - end of your LED strip connected to ground and the + end to the GPIO port defined in .env. [Here is a pinout diagram](https://www.raspberrypi.org/documentation/usage/gpio/) for reference. The number you define GPIO_PORT to should be the number that appears on the label `GPIO ##` in the first image, **not** the number within the circle.

```sh
cp .env.example .env
nano .env
```

### Development

To run the project, simply run

```sh
yarn start
```

If everything was installed correctly, you should be able to view the web interface at http://*your-pi-ip*:*port*

### Production

You'll want to set up a systemd service for the project to run in the background and on startup.

1. Copy the pismartled.service file to the systemd services folder

```sh
sudo cp pismartled.service /etc/systemd/system/pismartled.service
```

2. Open up the file you copied with your text editor of choice and verify that the working directory is correctly configured.

```sh
sudo nano /etc/systemd/system/pismartled.service
```

3. Start the service and enable automatic startup on boot

```sh
sudo systemctl start pismartled
sudo systemctl enable pismartled
```

If everything is working correctly, you should be able to view the web interface at http://*your-pi-ip*:*port*

You can also view the logs with

```sh
journalctl -u pismartled
```

## Communicating with the socket

To control the LED from a client, simply run

```js
socket.emit('led', 1);
```

or

```js
socket.emit('led', 0);
```

where 1 is on and 0 is off.

Upon receiving an update to the LED, the server will emit an led event to all clients with the new value to keep them updated. A client can listen to updates by listening to the led event.

```js
socket.on('led', data => {
  if (data == 1) {
    console.log('The light has been turned on!')
  } else if (data == 0) {
    console.log('The light has been turned off!')
  }
});
```

A client can retrieve the current status of the LED by emitting the status event and listening to a response on the led event

```js
socket.emit('status');
```

```js
socket.on('led', data => {
  if (data == 1) {
    console.log('The light is currently on!');
  } else if (data == 0) {
    console.log('The light is currently off!');
  }
});
```

### Examples

Check out [pismartled-android](https://github.com/js0mmer/pismartled-android)