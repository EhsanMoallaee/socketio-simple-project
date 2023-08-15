const express = require('express');
const http = require('http');
const redis = require('redis');
const socketIO = require('socket.io');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost';

const app = express();
app.set('view engine', 'ejs');

const server = http.createServer(app);

const redisClient = redis.createClient();

const io = socketIO(server, {
    cors: { origin: `${BASE_URL}:${PORT}`}
});

server.listen(PORT, () => {
    console.log(`Server is running on: ${BASE_URL}:${PORT}`);
})