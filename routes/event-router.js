const express = require('express');
const router = express.Router();
const EventManager = require('../managers/event-manager');

router.get('/', (req, res) => {
    const events = EventManager.getEvents(true);
    res.json(events);
});

module.exports = router;
