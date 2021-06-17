const express = require('express');
const router = express.Router();

const api = 'https://api.leescode.com/';


router.get('/', function (req, res, next) {
    res.render('vacation/vacation', {api: api, title: '구이앤금우통신:휴가'});
});
router.get('/apply', function (req, res, next) {
    res.render('vacation/vacation-create', {api: api, title: '구이앤금우통신:휴가'});
});
router.get('/view', function (req, res, next) {
    res.render('vacation/vacation-view', {api: api, title: '구이앤금우통신:휴가'});
});


module.exports = router;