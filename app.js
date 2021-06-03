const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 3000;

const indexRouter = require('./routes/index');

server.listen(port, hostname, () => {
    console.log('server start');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/jsCookie', express.static(__dirname + '/node_modules/jquery.cookie'));

app.use(express.static('public'));
app.use('/', indexRouter);

module.exports = app;