var assert = require('assert');
var should = require('should');
var drachtio = require('../..') ;


describe('drachtio', function(){
  it('app#request should throw if not connected', function(){
    var app = drachtio() ;
    app.request.bind(app, 'nobody@nobody', {method: 'OPTIONS'}).should.throw('cannot call app#request in unconnected state') ;
  }) ;

}) ;