var assert = require('assert');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var should = require('should');
var merge = require('merge') ;
var fs = require('fs') ;
var debug = require('debug')('drachtio-client') ;
var async = require('async') ;
var Agent = require('drachtio-client').Agent ;
var fixture = require('drachtio-test-fixtures') ;
var uac, uas ;
var cfg = fixture(__dirname,[9022,9023,9024],[6060,6061,6062]) ;

function configureUac( config ) {
    uac = new Agent(function(req,res){}) ;
    uac.set('api logger',fs.createWriteStream(config.apiLog) ) ;
    uac.connect(config.connect_opts) ;
    return uac ;
}
function connectAll( agents, cb ) {
    async.each( agents, function( agent, callback ) {
        if( agent.connected ) agent.disconnect() ;
        agent.on('connect', function(err) {
            return callback(err) ;
        }) ;
    }, function(err) {
        if( err ) return cb(err) ;
        cb() ;
    }) ;
}

describe('drachtio', function() {
    this.timeout(6000) ;

    before(function(done){
        cfg.startServers(done) ;
    }) ;
    after(function(done){
        cfg.stopServers(done) ;
    }) ;

    it('must be able to reject an INVITE', function(done) {
        uac = configureUac( cfg.client[0] ) ;
        uas = require('../examples/logger/app')(cfg.client[1]) ;
        connectAll([uac, uas], function(err){
            uac.request({
                uri: cfg.sipServer[1],
                method: 'INVITE',
                body: cfg.client[0].sdp
            }, function( err, req ) {
                should.not.exist(err) ;
                req.on('response', function(res){
                    res.should.have.property('status',486); 
                    uac.idle.should.be.true ;
                    uas.idle.should.be.true ;
                    done() ;
                }) ;
            }) ;
        }) ;
    }) ;
    it('must set response time in a custom header', function(done) {
        uac = configureUac( cfg.client[0] ) ;
        uas = require('../examples/invite-non-success/app')(cfg.client[1]) ;
        connectAll([uac, uas], function(err){
            uac.request({
                uri: cfg.sipServer[1],
                method: 'INVITE',
                body: cfg.client[0].sdp
            }, function( err, req ) {
                should.not.exist(err) ;
                req.on('response', function(res){
                    res.should.have.property('status',486); 
                    uac.idle.should.be.true ;
                    uas.idle.should.be.true ;
                    done() ;                    
                }) ;
            }) ;
        }) ;
    }) ; 
}) ;
