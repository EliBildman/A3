const express = require('express');
const cors = require('cors');
const Constants = require('./constants');
const net = require('net');
const fs = require('fs');
const socketio = require('socket.io');
require('dotenv').config();

const log = require('./loggers/system-logger');

const heads = fs.readdirSync(__dirname + '/heads').map((file) => {
  return require('./heads/' + file);
});

heads.forEach((head) => {
  head.initialize();
});

// ----------- HTTP Server -----------------------

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(fileUpload());

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// app.use(http_log);

const HTTP_PORT = 3005;
const http_server = app.listen(HTTP_PORT, () => {
  log.info(`HTTP Listening on ${HTTP_PORT}`);
});

const action_router = require('./routes/action-router');
const event_router = require('./routes/event-router');
const api_router = require('./routes/api-router');

app.use('/actions', action_router);
app.use('/events', event_router);
app.use('/api', api_router); // has fragments and listeners

app.get('/constants', (req, res) => {
  res.json(Constants);
});

//index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ----------- SocketIO Server -----------------------

const io = socketio(http_server, {
  cors: { origin: '*' },
});

const socket_manager = require('./managers/socket-manager');

io.on('connection', (socket) => {
  log.info('a user connected');
  socket_manager.register(socket);
});

// ----------- TCP Server -----------------------

const server = net.createServer();

const TCP_PORT = 3010;
server.listen(TCP_PORT, '0.0.0.0', () => {
  log.info(`TCP Listening on ${TCP_PORT}`);
});

const tcp_router = require('./routes/tcp-router');

server.on('connection', tcp_router.onConnection);
