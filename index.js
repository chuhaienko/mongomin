var util = require('util');
var swig = require('swig');
var swigExt = new require('./lib/SwigExt.js')(swig);
var bodyParser = require('body-parser');
var express = require('express');
var load = require('express-load');
var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(8081, function() {
	util.log('Application started');
	console.log(server.address());

	load('models').then('controllers').then('routes').into(app);
})