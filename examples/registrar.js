var drachtio = require('../');
var app = drachtio() ;
var passport       = require('passport') ;
var DigestStrategy = require('passport-http').DigestStrategy; 
var registrationParser = require('drachtio-mw-registration-parser') ;
var argv = require('minimist')(process.argv.slice(2));
var debug = require('debug')('registrar') ;
var realm = 'sip.drachtio.org'; 

app.connect({
  host: argv.host,
  port: argv.port,
  secret: argv.secret
}) ;
var users = [
    { id: 1, username: 'dhorton', password: 'pass1234', domain: realm}
];
function findByUsername( username, fn )
{
    for (var i = 0, len = users.length; i < len; i++)
    {
        var user = users[i];
        if (user.username === username) { return fn( null, user ); }
    }
    return fn(null, null);
}

passport.use
(
  new DigestStrategy(
    { qop: 'auth', realm: realm },
    function( username, done )
    {
        // Find the user by username. If there is no user with the given username
        // set the user to `false` to indicate failure. Otherwise, return the
        // user and user's password.
        
        findByUsername(
            username, 
            function( err, user )
            {
                if ( err )   { return done( err ); }
                if ( !user ) { return done( null, false ); }
                return done( null, user, user.password );
            }
        );
    },
    function( params, done ) // second callback
    {
        // asynchronous validation, for effect...
        process.nextTick(
            function ()
            {
                // check nonces in params here, if desired
                debug('nonces sent: ', params );
                /*
                nonce: 'MYto1vSuu6eK9PMNNYAqIdsmUXOA2ppU',
                cnonce: 'MDA4NjY5',
                nc: '00000001',
                opaque: undefined }
                */
                return done( null, true );
            }
        );
    }
));

app.use(passport.initialize());
app.use('register', registrationParser); 
app.use('register', passport.authenticate('digest', { session: false })) ;

app.register(function(req, res) {
  console.log('received an authenticated registration request: ', req.registration) ;
  if( 'unregister' === req.registration.type ) {
    res.send(200) ;
  }
  else {
  res.send(200, {
    headers: {
      'Contact': '<' + req.registration.aor + '>;expires=' + req.registration.expires
    }
  }) ;

  }
});
