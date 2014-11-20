var mongo = require('mongojs');

/**
 * Модель документів
 * @param {String} dbName
 * @param {String} collName
 */
function Document(dbName, collName)
{
	/**
	 * Назва БД
	 */
	this.dbName = dbName;
	/**
	 * Назва колекції
	 */
	this.collName = collName;
	/**
	 * Документи
	 */
	this.docs = [];
	/**
	 * Ліміт для вибірки
	 */
	this.limit = 1000;
	/**
	 * Пропуск для вибірки
	 */
	this.skip = 0;
}

/**
 * Встановлення модифікаторів запиту для вибірки
 * @param {Object} obj {limit, skip}
 */
Document.prototype.queryModifiers = function(obj) {
	if(obj.limit && (obj.limit -0) > 0)
		this.limit = obj.limit -0;
	if(obj.skip && (obj.skip -0) >= 0)
		this.skip = obj.skip -0;
}

/**
 * Робть вибірку та повертає документи
 * @param {Function(err, docs)} callback
 */
Document.prototype.list = function(callback) {
	var db = mongo(this.dbName, [this.collName]);
	var dbColl = db;
	// Маніпуляції для колекцій, в імені якиє є крапка
	if(this.collName.indexOf('.') !== -1) {
		var path = this.collName.split('.');
		for(var i = 0; i < path.length; i++) {
			dbColl = dbColl[path[i]];
		}
	} else {
		dbColl = db[this.collName];
	}
	dbColl.find({}).skip(this.skip).limit(this.limit).toArray(function(err, docs) {
		callback(err, docs);
	});
}

module.exports = function(app) {
	return Document;
}