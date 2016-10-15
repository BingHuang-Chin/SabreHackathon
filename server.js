var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


/*
	Simple route to send index.html
*/
app.get('/', function(request, response) {
	response.sendFile('./public/index.html');
});


var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log('Express server is listening on ' + app.get('port'));
});