const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;


router.get('/', function (req, res, next) {
    res.render('schedule/schedule', {api: api, title: '구이앤금우통신:일정'});
});

module.exports = router;