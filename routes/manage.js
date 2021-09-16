const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;
const fileApi = data.fileApi;


router.get('/member', function (req, res, next) {
    res.render('manage/member', {api: api, fileApi: fileApi, title: '구이앤금우통신:직원관리'});
});
router.get('/member/view', function (req, res, next) {
    res.render('manage/member-view', {api: api, fileApi: fileApi, title: '구이앤금우통신:직원관리'});
});
router.get('/member/vacation', function (req, res, next) {
    res.render('manage/member-vacation', {api: api, title: '구이앤금우통신:직원관리'});
});
router.get('/member/create', function (req, res, next) {
    res.render('manage/member-create', {api: api, title: '구이앤금우통신:직원관리'});
});

router.get('/record', function (req, res, next) {
    res.render('manage/record', {api: api, fileApi: fileApi, title: '구이앤금우통신:출근기록관리'});
});

router.get('/department', function (req, res, next) {
    res.render('manage/department', {api: api, title: '구이앤금우통신:부서관리'});
});
router.get('/department/view', function (req, res, next) {
    res.render('manage/department-view', {api: api, title: '구이앤금우통신:부서관리'});
});

router.get('/safe', function (req, res, next) {
    res.render('manage/safety-check', {api: api, title: '구이앤금우통신:현장팀안전점검'});
});
router.get('/safe/view', function (req, res, next) {
    res.render('manage/safety-check-view', {api: api, fileApi: fileApi, title: '구이앤금우통신:현장팀안전점검'});
});
router.get('/safe/write', function (req, res, next) {
    res.render('manage/safety-check-write', {api: api, fileApi: fileApi, title: '구이앤금우통신:현장팀안전점검'});
});

module.exports = router;