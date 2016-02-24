var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/frontend'));
app.use(function(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.listen(3000, function () {
    console.log('Listening to port 3000');
});
