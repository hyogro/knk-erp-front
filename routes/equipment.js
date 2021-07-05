const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;

router.get('/apply', function (req, res, next) {
    res.render('equipment/apply', {api: api, title: '구이앤금우통신:비품신청하기'});
});

router.get('/apply/write', function (req, res, next) {
    res.render('equipment/apply-write', {api: api, title: '구이앤금우통신:비품신청하기'});
});

router.get('/manage', function (req, res, next) {
    res.render('equipment/manage', {api: api, title: '구이앤금우통신:요청목록'});
});


module.exports = router;