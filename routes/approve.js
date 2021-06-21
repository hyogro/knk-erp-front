const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;

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