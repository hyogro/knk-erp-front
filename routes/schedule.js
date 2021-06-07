const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/', function (req, res, next) {
    res.render('schedule/schedule', {api: api, title: '구이앤금우통신:일정'});
});
router.get('/create-schedule', function (req, res, next) {
    res.render('schedule/create-schedule', {api: api, title: '구이앤금우통신:일정생성'});
});
router.get('/create-vacation', function (req, res, next) {
    res.render('schedule/create-vacation', {api: api, title: '구이앤금우통신:휴가일정생성 요청'});
});


module.exports = router;