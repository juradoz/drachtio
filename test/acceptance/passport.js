var drachtio = require('../..') ;
var fs = require('fs') ;
var assert = require('assert');
var should = require('should');
var merge = require('merge') ;
var debug = require('debug')('drachtio-client') ;
var fixture = require('drachtio-test-fixtures') ;
var cfg = fixture(__dirname,[8060,8061,8062],[6060,6061,6062]) ;

var proxy, uas ;

function configureUac( app, config ) {
    app.set('api logger',fs.createWriteStream(config.apiLog) ) ;
    app.connect(config.connect_opts) ;
    return app ;
}

describe('passport integration', function() {
    this.timeout(6000) ;

    before(function(done){
        cfg.startServers(done) ;
    }) ;
    after(function(done){
        cfg.stopServers(done) ;
    }) ;
 
    it.only('should work with passport digest authentication', function(done) {
        var self = this ;
        var app = drachtio() ;
        configureUac( app, cfg.client[0] ) ;
        uas = require('../scripts/passport/app')(cfg.client[1]) ;
        cfg.connectAll([app, uas], function(err){
            if( err ) throw err ;
            app.request({
                uri: cfg.sipServer[1],
                method: 'REGISTER',
                headers: {
                    To: 'sip:dhorton@sip.drachtio.org',
                    From: 'sip:dhorton@sip.drachtio.org',
                    Subject: self.test.fullTitle()
                },
                username: 'dhorton',
                password: '1234'
            }, function( err, req ) {
                should.not.exist(err) ;
                req.on('response', function(res){
                    res.should.have.property('status',200); 

                    //TODO: generate an Authorization header and retry
                    app.idle.should.be.true ;
                    done() ;
                }) ;
            }) ;
        }) ;
    }) ;    
}) ;
