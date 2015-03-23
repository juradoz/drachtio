var drachtio = require('../../..');
var fs = require('fs') ;

module.exports = function( config ) {

  var app = drachtio() ;

  app.options( function(req,res){
      res.send(200, {
        headers: {
          'X-Custom': 'drachtio rocks!'
        }
      }) ;
  }) ;

  app.message( function(req, res ){
      res.send(200, {
        headers: {
          'subject': 'pure awesomeness'
        }
      }) ;
  }); 


  app.set('api logger',fs.createWriteStream(config.apiLog) ) ;
  app.connect(config.connect_opts) ;

  return app ;
} ;




