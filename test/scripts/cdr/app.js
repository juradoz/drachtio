var drachtio = require('../../..') ;
var fs = require('fs') ;
var debug = require('debug')('drachtio-client:cdr') ;

module.exports = function( config ) {

  var app = drachtio() ;
  app.set('api logger',fs.createWriteStream(config.apiLog) ) ;
  var client = app.connect(config.connect_opts) ;

  if( !config.cdrOnly ) {
    app.invite( function(req, res) {
      req.proxy({
        destination: config.proxyTarget,
        followRedirects: config.followRedirects
      }, 
      function(err, results){
        if( err ) return  ;
        }) ;
    }) ;    
  } 

  var attempt = [] ;
  var start = [] ;
  var stop = [] ;

  client.on('cdr:attempt', function(cdr){
    debug('got an attempt cdr'); 
    attempt.push( cdr ) ;
  }) ;
  client.on('cdr:start', function(cdr){
    start.push( cdr ) ;
  }) ;
  client.on('cdr:stop', function(cdr){
    stop.push( cdr ) ;
  }) ;

  app.getStartCdr = function() { 
    return start; 
  }  ;
  app.getAttemptCdr = function() {
    return attempt ;
  } ;
  app.getStopCdr = function() { 
    return stop; 
  } ;

  return app ;
} ;




