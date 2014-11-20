var exec = require('child_process').exec;
var mongo = require('mongojs');

var m;
module.exports = function(app) {
	m = app.models;
	return exports;
};

exports.path = '/:dbName/:collName';
exports.run = function(req, res, next)
{
	var dbName = req.params.dbName;
	var collName = req.params.collName;

	var document = new m.Document(dbName, collName);
	document.queryModifiers({skip: req.query.skip, limit: req.query.limit});

	document.list(function(err, docs) {
		res.render('collection', {err: err, dbName: dbName, collName: collName, docs: docs});
	});
}