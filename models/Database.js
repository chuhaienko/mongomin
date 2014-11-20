var exec = require('child_process').exec;
var async = require('async');
var mongo = require('mongojs');

/**
 * Модель бази даних
 */
function Database()
{
	/**
	 * Масив об'єктів баз даних
	 */
	this.dbs = [];
}

/**
 * Буфер для роботи з командною строкою
 */
Database.prototype.execBuffer = 1024*1024;

/**
 * Отримує список баз даних та наповнює масив об'єктів баз даних. Його і повертає
 * @param {Function(err, dbs)} callback
 */
Database.prototype.list = function(callback) {
	if(this.dbs.length) {
		callback
	}
	var that = this;
	exec("mongo --eval 'printjson(db.adminCommand(\"listDatabases\"))' --quiet", {maxBuffer: this.execBuffer,}, function (err, stdout, stderr) {
		if(!err) {
			try {
				that.dbs = JSON.parse(stdout);
				that.countColls(function(err) {
					callback(err, that.dbs);
				});
			} catch(err) {
				callback(err);
			}
		} else {
			callback(err);
		}
	});
}

/**
 * Підраховує кількість колекцій у базах даних. Цими даними доповнює масив об'єктів баз даних
 * @param {Function(err)} callback
 */
Database.prototype.countColls = function(callback) {
	var that = this;
	async.each(this.dbs.databases, function(database, cb) {
		var db = mongo(database.name);
		db.getCollectionNames(function(err, res) {
			database['colls'] = res.length;
			cb(err);
			db.close();
		})
	}, function(err) {
		callback(err);
	});
}

module.exports = function(app) {
	return Database;
}