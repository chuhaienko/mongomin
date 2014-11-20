var exec = require('child_process').exec;
var async = require('async');
var mongo = require('mongojs');

/**
 * Модель колекцій
 * @param {String} dbName
 */
function Collection(dbName)
{
	/**
	 * Назва бази даних
	 */
	this.dbName = dbName;
	/**
	 * Масив імен колекцій БД
	 */
	this.collsNames = [];
	/**
	 * Масив об'єктів колекцій {name, size, docs}
	 */
	this.colls = [];
}

/**
 * Буфер для роботи з командною строкою
 */
Collection.prototype.execBuffer = 1024*1024;

/**
 * Заповнює масиви колекцій, та повертає масив об'єктів колекцій
 * @param {Function(err, colls)} callback
 */
Collection.prototype.list = function(callback) {
	if(this.colls) {
		callback
	}
	var that = this;
	exec("mongo "+this.dbName+" --eval 'printjson(db.getCollectionNames())' --quiet", {maxBuffer: this.execBuffer,}, function (err, stdout, stderr) {
		if(!err) {
			try {
				that.collsNames = JSON.parse(stdout);
				for(var i in that.collsNames) {
					var name = that.collsNames[i];
					that.colls.push({name: name});
				}
				that.countDocs(function(err) {
					callback(err, that.colls);
				})
			} catch(err) {
				callback(err);
			}
		} else {
			callback(err);
		}
	});
}

/**
 * Підраховує кількість документів для кожної колекції, та доповню цими даними масив об'єктів колекцій
 * @param {Function(err)} callback
 */
Collection.prototype.countDocs = function(callback) {
	var colls = this.colls;
	var db = mongo.connect(this.dbName, this.collsNames);
	async.each(colls, function(coll, cb) {
		var dbColl = db;
		// Маніпуляції для колекцій, в імені якиє є крапка
		if(coll.name.indexOf('.') !== -1) {
			var path = coll.name.split('.');
			for(var i = 0; i < path.length; i++) {
				dbColl = dbColl[path[i]];
			}
		} else {
			dbColl = db[coll.name];
		}
		dbColl.find().count(function(err, result) {
			coll.docs = result;
			cb(err);
		});
	}, function(err) {
		callback(err);
	});
}

module.exports = function(app) {
	return Collection;
}