var connect = require('../..');
var app = connect() ;
var drachtio = require('drachtio-client') ;
var agent = new drachtio.Agent( app ) ;
var fs = require('fs') ;
var argv = require('minimist')(process.argv.slice(2));
var debug = require('debug')('basic') ;

module.exports = function( config ) {

	agent.set('api logger',fs.createWriteStream(config.apiLog) ) ;
	agent.connect(config.connect_opts) ;
	agent.route('invite') ;

	//app.use('invite', function( req, res, next){
	//	res.send(486); 
	//}) ;
	app.invite( function testInvite(req) {
		return req.method === 'INVITE' ;
	}, function( req, res, next){
		res.send(486); 
	}) ;

	return agent ;
} ;
