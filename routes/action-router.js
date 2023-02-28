const express = require('express');
const router = express.Router();
const ActionManager = require('../managers/action-manager');

router.get('/', (req, res) => {
    const actions = ActionManager.getActions(true);
    res.json(actions);
});

module.exports = router;
