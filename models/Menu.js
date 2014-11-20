
function Menu(obj)
{
	this.dbName		= obj.dbName;
	this.collName	= obj.collName;
	this.colls		= obj.colls;
	this.dbs		= obj.dbs;

	this.arr = [];
}


Menu.prototype.getArray = function() {
	for(var i in this.dbs.databases) {
		
	}
}

module.exports = function(app) {
	return Menu;
}