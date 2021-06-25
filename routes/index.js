const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;
const fileApi = data.fileApi;


router.get('/', function (req, res, next) {
    res.render('index', {api: api, fileApi: fileApi, title: '구이앤금우통신'});
});
router.get('/login', function (req, res, next) {
    res.render('login/login', {api: api, title: '구이앤금우통신:로그인'});
});
router.get('/my-page', function (req, res, next) {
    res.render('my/my-page', {api: api, title: '구이앤금우통신:내 정보'});
});

module.exports = router;