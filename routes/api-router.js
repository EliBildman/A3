const express = require('express');
const router = express.Router();
const ApiManager = require('../managers/api-manager');

router.get('/page', (req, res) => {
    const page = ApiManager.getPage(req.query.ind);
    res.json(page);
});

router.post('/page', (req, res) => {
    if (req.body.type === 'ADD') {
        ApiManager.addPage(req.body.page);
    } else if (req.body.type === 'UPDATE') {
        ApiManager.updatePage(req.body.ind, req.body.page);
    } else if (req.body.type === 'DELETE') {
        ApiManager.deletePage(req.body.ind);
    }
    res.status(200);
});

module.exports = router;
