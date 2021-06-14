const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/', function (req, res, next) {
    res.render('index', {api: api, title: '구이앤금우통신'});
});
router.get('/login', function (req, res, next) {
    res.render('login/login', {api: api, title: '구이앤금우통신:로그인'});
});
router.get('/my-page', function (req, res, next) {
    res.render('my_page/my-page', {api: api, title: '구이앤금우통신:내 정보'});
});

module.exports = router;