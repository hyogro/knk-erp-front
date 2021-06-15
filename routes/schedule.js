const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/', function (req, res, next) {
    res.render('schedule/schedule', {api: api, title: '구이앤금우통신:일정'});
});
router.get('/manage-schedule', function (req, res, next) {
    res.render('schedule/manage-schedule', {api: api, title: '구이앤금우통신:근무일정'});
});
router.get('/manage-vacation', function (req, res, next) {
    res.render('schedule/manage-vacation', {api: api, title: '구이앤금우통신:휴가일정'});
});
router.get('/manage-vacation/apply', function (req, res, next) {
    res.render('schedule/manage-vacation-create', {api: api, title: '구이앤금우통신:휴가일정'});
});
router.get('/manage-vacation/view', function (req, res, next) {
    res.render('schedule/manage-vacation-view', {api: api, title: '구이앤금우통신:휴가일정'});
});


module.exports = router;