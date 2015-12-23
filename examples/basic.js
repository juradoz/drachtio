var connect = require('../');
var app = connect() ;
var fs = require('fs') ;
var argv = require('minimist')(process.argv.slice(2));
var debug = require('debug')('basic') ;

app.use('invite', function( req, res, next){
	debug('hey Im in middleware!') ;
	next() ;
}) ;
app.use('invite', function( req, res, next){
	debug('hey Im in middleware!') ;
	throw new Error('whoopse!') ;
}) ;
app.use('invite', function( req, res){
	res.send(486) ;
}) ;
app.use('invite', function( err, req, res, next){
	debug('got eror: ', err) ;
	res.send(500, 'My bad') ;
}) ;

app.connect({
	host: '127.0.0.1',
	port: 9022,
	secret: 'cymru',
	methods: ['invite','bye'],
	set: {
		'api logger': fs.createWriteStream(argv.apiTrace) 
	}
}) ;
