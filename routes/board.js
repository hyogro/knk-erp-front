const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/notice', function (req, res, next) {
    res.render('board/notice-board', {api: api, title: '구이앤금우통신:공지게시판'});
});
router.get('/work', function (req, res, next) {
    res.render('board/work-board', {api: api, title: '구이앤금우통신:업무게시판'});
});

module.exports = router;