const Time = require('./heads/time');
const Utils = require('./heads/utils');
const Thermo = require('./heads/thermo');
const express = require('express');
const cors = require('cors');
const Constants = require('./constants');
const net = require('net');

const heads = [Time, Utils, Thermo];

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
    console.log(`HTTP Listening on ${HTTP_PORT}`);
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

// ----------- TCP Server -----------------------

const server = net.createServer();

const TCP_PORT = 3010;
server.listen(TCP_PORT, '0.0.0.0', () => {
    console.log(`TCP Listening on ${TCP_PORT}`);
});

const tcp_router = require('./routes/tcp-router');

server.on('connection', tcp_router.onConnection);
