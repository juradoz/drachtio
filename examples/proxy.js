var drachtio = require('..') ;
var app = drachtio() ;
var client = require('drachtio-client') ;
var fs = require('fs') ;
var argv = require('minimist')(process.argv.slice(2));
var debug = require('debug')('proxy') ;
var assert = require('assert') ;

if( argv.apiTrace ) {
  app.set('api logger',fs.createWriteStream(argv.apiTrace)) ;
}

assert( argv.dest ) ;

app.invite( function(req,res){
  var user = req.msg.uri.match(/sip:(.*?)@(.*?)$/) ;
  var uri = 'sip:' + user[1] + '@' + argv.dest;

  req.proxy({
    remainInDialog: true,
    destination: [uri],
  }, function(err, results){
    if( err ) return console.error( 'Error attempting to proxy: ', err ) ;
    console.log('results: ', JSON.stringify( results ) ) ;
  }) ;
}) ;

app.connect({
  host: 'localhost',
  port: 9022,
  secret: 'cymru',
}) ;