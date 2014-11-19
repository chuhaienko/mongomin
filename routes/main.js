
module.exports = function(app)
{
	for(var ctrl in app.controllers) {
		var c = app.controllers[ctrl];
		if(typeof c.path === 'string' && typeof c.run === 'function') {
			console.log('Controller: '+ctrl);
			console.log('Path: '+c.path+(c.verb ? ' ('+c.verb+')' : ''));
			if(c.verb) {
				if(app[c.verb]) {
					app[c.verb](c.path, c.run);
				} else {
					console.error('No such verb: '+c.verb);
				}
			} else {
				app.all(c.path, c.run);
			}
		}
	}
}