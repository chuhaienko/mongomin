var exec = require('child_process').exec;

module.exports.path = '/';
module.exports.run = function(req, res, next)
{
	exec('mongo '+__dirname+'/../load/dbs.js', {maxBuffer: 1024*1024,}, function (err, stdout, stderr) {
		if(!err) {
			var bracketPos = (stdout ? stdout.indexOf('{') : -1);
			if(bracketPos !== -1) {
				var jsonStr = stdout.substring(bracketPos);
				var data;
				try {
					data = JSON.parse(jsonStr);
				} catch(err) {
					res.render('dbs', {err: err});
					return;
				}
				res.render('dbs', {err: err, data: data});
			}
		} else {
			res.render('dbs', {err: err});
		}
	});
}