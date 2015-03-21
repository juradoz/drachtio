var EventEmitter = require('events').EventEmitter ;
var proto = require('./proto') ;
var merge = require('utils-merge');
var methods = require('sip-methods') ;

exports = module.exports = createServer;

/**
 * Create a new server.
 *
 * @return {Function}
 * @api public
 */

function createServer() {
	function app(req, res, next){ app.handle(req, res, next); }
	merge(app, proto);
	merge(app, EventEmitter.prototype);
	app.method = '*';
	app.stack = [];
	for (var i = 0; i < arguments.length; ++i) {
		app.use(arguments[i]);
	}

	//create methods app.invite, app.register, etc..
	methods.forEach( function(method) {
		app[method.toLowerCase()] = app.use.bind( app, method.toLowerCase() ) ;		
	}) ;

  return app;
}