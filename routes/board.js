const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;
const fileApi = data.fileApi;


router.get('/notice', function (req, res, next) {
    res.render('board/notice', {api: api, title: '구이앤금우통신:공지게시판'});
});
router.get('/notice/view', function (req, res, next) {
    res.render('board/notice-view', {api: api, fileApi: fileApi, title: '구이앤금우통신:공지게시판'});
});
router.get('/notice/write', function (req, res, next) {
    res.render('board/notice-write', {api: api, fileApi: fileApi, title: '구이앤금우통신:공지게시판'});
});
router.get('/work', function (req, res, next) {
    res.render('board/work', {api: api, title: '구이앤금우통신:업무게시판'});
});
router.get('/work/view', function (req, res, next) {
    res.render('board/work-view', {api: api, fileApi: fileApi, title: '구이앤금우통신:업무게시판'});
});
router.get('/work/write', function (req, res, next) {
    res.render('board/work-write', {api: api, fileApi: fileApi, title: '구이앤금우통신:업무게시판'});
});

module.exports = router;