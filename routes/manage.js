const express = require('express');
const router = express.Router();
const fs = require('fs');

const dataBuffer = fs.readFileSync('/home/ubuntu/node-config/api.json');
const dataJSON = dataBuffer.toString();
const data = JSON.parse(dataJSON);
const api = data.api;
const fileApi = data.fileApi;


router.get('/attendance', function (req, res, next) {
    res.render('manage/attendance', {api: api, fileApi: fileApi, title: '구이앤금우통신:엑셀관리'});
});
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
router.get('/department', function (req, res, next) {
    res.render('manage/department', {api: api, title: '구이앤금우통신:부서관리'});
});
router.get('/department/view', function (req, res, next) {
    res.render('manage/department-view', {api: api, title: '구이앤금우통신:부서관리'});
});

module.exports = router;