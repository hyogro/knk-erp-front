const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/', function (req, res, next) {
    res.render('schedule/schedule', {api: api, title: '구이앤금우통신:일정'});
});

module.exports = router;