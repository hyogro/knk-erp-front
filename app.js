const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 3000;

const indexRouter = require('./routes/index');
const scheduleRouter = require('./routes/schedule');
const vacationRouter = require('./routes/vacation');
const attendanceRouter = require('./routes/attendance');
const boardRouter = require('./routes/board');

server.listen(port, hostname, () => {
    console.log('server start');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// app.set('public', path.join(__dirname, 'public'));

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/jsCookie', express.static(__dirname + '/node_modules/jquery.cookie'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/fullcalendar', express.static(__dirname + '/node_modules/fullcalendar'));

app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/schedule', scheduleRouter);
app.use('/vacation', vacationRouter);
app.use('/attendance', attendanceRouter);
app.use('/board', boardRouter);

module.exports = app;