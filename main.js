var express = require('express');
var app = express();
var path = require('path');

app.use('/css',express.static(__dirname+'/css'));
app.use('/img',express.static(__dirname+'/img'));
app.use('/js',express.static(__dirname+'/js'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
    console.log('Listening to port 3000');
});
