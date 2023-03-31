const sockets = [];
const LOG_EVENT_NAME = 'LOG';

module.exports.register = (socket) => {
  sockets.push(socket);
  socket.on('disconnect', () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });
};

module.exports.sendLog = (message) => {
  sockets.forEach((socket) => {
    socket.emit(LOG_EVENT_NAME, message);
  });
};
