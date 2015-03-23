var drachtio = require('../../..') ;
var fs = require('fs') ;
var assert = require('assert') ;

module.exports = function( config ) {

  var app = drachtio() ;

  app.invite( function(req,res){
    res.send(180) ;
    setTimeout( function(){
      assert(false, 'expected to receive a CANCEL request') ;
    }, 10000) ;
  }) ;
  
  app.cancel( function(req,res){
    res.send(200); 
  }) ;

  app.set('api logger',fs.createWriteStream(config.apiLog) ) ;
  app.connect(config.connect_opts) ;

  return app ;
} ;




