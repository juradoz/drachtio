var fixtures = require('drachtio-test-fixtures') ;

before( function(done){
    var fn = fixtures.beforeTest.bind( this ) ;
    fn( done, process.cwd() + '/test') ;
}) ;

after( function(done) {
    var fn = fixtures.afterTest.bind( this ) ;
    fn( done ) ;
}) ;

