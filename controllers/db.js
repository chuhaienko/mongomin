var exec = require('child_process').exec;

module.exports.path = '/:dbName';
module.exports.run = function(req, res, next)
{
	var dbName = req.params.dbName;

	exec('mongo '+dbName+' '+__dirname+'/../load/collections.js', {maxBuffer: 1024*1024,}, function (err, stdout, stderr) {
		if(!err) {
			var bracketPos = (stdout ? stdout.indexOf('[') : -1);
			if(bracketPos !== -1) {
				var jsonStr = stdout.substring(bracketPos);
				var data;
				try {
					data = JSON.parse(jsonStr);
				} catch(err) {
					res.render('db', {err: err, dbName: dbName});
					return;
				}
				res.render('db', {err: err, dbName: dbName, collections: data});
			}
		} else {
			res.render('db', {err: err, dbName: dbName});
		}
	});
}