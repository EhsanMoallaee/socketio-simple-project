async function sendMessages(socket, redisClient) {
    const result = await redisClient.lRange('messages', 0, -1);
    result.map(item => {
        const [username, message] = item.split(':');
        socket.emit('message', {username, message});
    })
}

module.exports = {
    sendMessages
}