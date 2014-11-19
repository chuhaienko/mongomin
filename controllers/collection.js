var exec = require('child_process').exec;
var mongo = require('mongojs');

module.exports.path = '/:dbName/:collectName';
module.exports.run = function(req, res, next)
{
	var dbName = req.params.dbName;
	var collectName = req.params.collectName;

	var db = mongo(dbName, [collectName]);
	db[collectName].find({}).skip(0).limit(3).toArray(function(err, docs) {
		console.log(docs);
		res.render('collection', {err: err, dbName: dbName, collectName: collectName, docs: docs});
	});
}