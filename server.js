const express = require('express');
const http = require('http');
const redis = require('redis');
const socketIO = require('socket.io');
const { sendMessages } = require('./functions/sendMessages');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || 'http://localhost';

const app = express();
app.set('view engine', 'ejs');

const server = http.createServer(app);

const redisClient = redis.createClient();
redisClient.connect();
// redisClient.del('messages'); //-> to clear redis list

const io = socketIO(server, {
    cors: { origin: `${BASE_URL}:${PORT}`}
});
io.on('connection', async socket => {
    await sendMessages(socket, redisClient);
    socket.on('message', async ({username, message}) => {
        await redisClient.rPush('messages', `${username}:${message}`);
        io.emit('message', {username, message});
    })
})

app.get('/', (req, res) => {
    res.render('login');
})
app.get('/chat', (req, res) => {
    const { username } = req.query;
    res.render('chat', {username})
})

server.listen(PORT, () => {
    console.log(`Server is running on: ${BASE_URL}:${PORT}`);
})