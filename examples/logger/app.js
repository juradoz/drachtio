var connect = require('../..');
var app = connect() ;
var drachtio = require('drachtio-client') ;
var agent = new drachtio.Agent( app ) ;
var onSend = drachtio.onSend ;
var fs = require('fs') ;
var argv = require('minimist')(process.argv.slice(2));
var debug = require('debug')('basic') ;

module.exports = function( config ) {

	agent.set('api logger',fs.createWriteStream(config.apiLog) ) ;
	agent.connect(config.connect_opts) ;
	agent.route('invite') ;

	app.use('*', function( req, res, next){
		 var startAt = process.hrtime() ;

		 onSend( res, function() {
			var diff = process.hrtime(startAt) ;
			var ms = diff[0] * 1e3 + diff[1] * 1e-6 ;
			var val = ms.toFixed(3) + ' ms' ;
			this.set('X-Response-Time', val) ;
		 }) ;

		 next() ;
	}) ;
	app.use('*', function(req, res){
		res.send(486) ;
	}) ;

	return agent ;
} ;
