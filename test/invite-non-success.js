var assert = require('assert');
var should = require('should');
var fs = require('fs') ;
var merge = require('merge') ;
var drachtio = require('drachtio-client') ;
var fixtures = require('drachtio-test-fixtures') ;
var config = fixtures.localConfig;
var debug = require('debug')('drachtio:connect') ;
var localAgent;
var remoteAgent;

var noop = function(req,res){} ;

describe('invite non-success final response', function() {
    this.timeout(3000) ;

    before(function(done){
        debug('mocked remote config: ', fixtures.remoteConfig) ;
        var mockedConfig = merge({status: 486}, fixtures.remoteConfig) ;
       remoteAgent = require('../examples/invite-non-success/app')(mockedConfig) ;
        remoteAgent.on('connect', function() {
            localAgent = drachtio.Agent(noop) ;
            localAgent.set('api logger',fs.createWriteStream(config.apiLog) ) ;
            localAgent.connect(config.connect_opts, function(err){
                done() ;
            });        
        }) ;
    }) ;
    after(function(done){
        localAgent.disconnect() ;
        remoteAgent.disconnect() ;
        done() ;
    }) ;
 
    it('must be able to reject an INVITE', function(done) {
        localAgent.request({
            uri: config.request_uri,
            method: 'INVITE',
            body: config.sdp
        }, function( err, req ) {
            should.not.exist(err) ;
            req.on('response', function(res){
                res.should.have.property('status',486); 
                localAgent.idle.should.be.true ;
                remoteAgent.idle.should.be.true ;
                done() ;
            }) ;
        }) ;
    }) ;
}) ;
