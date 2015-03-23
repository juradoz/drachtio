var drachtio = require('../../..') ;
var fs = require('fs') ;
var assert = require('assert') ;

module.exports = function( config ) {

  var app = drachtio() ;

  app.invite( function(req,res){
     res.send(200, { body: config.sdp}) ;
  }) ;

  app.bye( function(req,res){
    res.send(200, function(err) {
        //all done
        assert( app.idle ); 
        app.disconnect() ;                
    }) ;
  }) ;

  app.set('api logger',fs.createWriteStream(config.apiLog) ) ;
  app.connect(config.connect_opts) ;

  return app ;
} ;




