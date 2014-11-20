var exec = require('child_process').exec;

var m;
module.exports = function(app) {
	m = app.models;
	return exports;
};

exports.path = '/:dbName';
exports.run = function(req, res, next)
{
	var dbName = req.params.dbName;

	var collection = new m.Collection(dbName);
	collection.list(function(err, colls) {
		res.render('db', {err: err, dbName: dbName, collections: colls});
	});
}