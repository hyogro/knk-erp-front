const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/attendance', function (req, res, next) {
    res.render('approve/attendance', {api: api, title: '구이앤금우통신:출퇴근정정요청관리'});
});

router.get('/attendance/view', function (req, res, next) {
    res.render('approve/attendance-view', {api: api, title: '구이앤금우통신:출퇴근정정요청관리'});
});

router.get('/vacation', function (req, res, next) {
    res.render('approve/vacation', {api: api, title: '구이앤금우통신:휴가요청관리'});
});

router.get('/vacation/view', function (req, res, next) {
    res.render('approve/vacation-view', {api: api, title: '구이앤금우통신:휴가요청관리'});
});


module.exports = router;