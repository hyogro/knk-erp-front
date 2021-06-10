const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/', function (req, res, next) {
    res.render('schedule/schedule', {api: api, title: '구이앤금우통신:일정'});
});
router.get('/manage-schedule', function (req, res, next) {
    res.render('schedule/manage-schedule', {api: api, title: '구이앤금우통신:일정생성'});
});
router.get('/manage-vacation', function (req, res, next) {
    res.render('schedule/manage-vacation', {api: api, title: '구이앤금우통신:휴가일정생성 요청'});
});


module.exports = router;