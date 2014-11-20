var exec = require('child_process').exec;

var m;
module.exports = function(app) {
	m = app.models;
	return exports;
};

exports.path = '/';
exports.run = function(req, res, next)
{
	var database = new m.Database();
	database.list(function(err, dbs) {
		var menu = m.Menu({dbs: dbs});
		res.render('index', {err: err, dbs: dbs});
	});



}