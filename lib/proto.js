var SIP_STATUS = require('sip-status') ;
var debug = require('debug')('connect:dispatcher');
var drachtio = require('drachtio-client') ;


var app = module.exports = {};

/**
 * Utilize the given middleware `handle` to the given `method`,
 * defaulting to _*_, which means execute for all methods. 
 *
 * @param {String|Function} method or callback 
 * @param {Function} callback 
 * @return {Server} for chaining
 * @api public
 */

app.use = function(method, fn){
  // default method to '*'
  if ('string' != typeof method) {
    fn = method;
    method = '*';
  }

  // wrap sub-apps
  if ('function' == typeof fn.handle) {
    var server = fn;
    fn.method = method;
    fn = function(req, res, next){
      server.handle(req, res, next);
    };
  }

  // add the middleware
  debug('use %s %s', method || '*', fn.name || 'anonymous');
  this.stack.push({ method: method, handle: fn });

  return this;
};

/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 * @api private
 */

app.handle = function(req, res, out) {
  var stack = this.stack ;
  var index = 0;

  function next(err) {
    var layer;

    // next callback
    layer = stack[index++];

    // all done
    if (!layer || res.finalResponseSent) {
      // delegate to parent
      if (out) return out(err);

      // unhandled error
      if (err) {
        // default to 500
        if (res.status < 400) res.status = 500;
        debug('default %s', res.status);

        // respect err.status
        if (err.status) res.status = err.status;

        // production gets a basic error message
        var msg = SIP_STATUS[res.status] ;

        // log to stderr in a non-test env
        console.error(err.stack || err.toString());
        if (res.finalResponseSent) return ; 
        res.send(res.status, msg);
      } else {
        if( req.method !== 'ACK' ) {
          res.send(404) ;
        }
      }
      return;
    }

    try {

      // skip this layer if the route doesn't match.
      if (0 !== req.method.toLowerCase().indexOf(layer.method.toLowerCase()) && layer.method !== '*') return next(err);

      debug('%s %s : %s', layer.handle.name || 'anonymous', layer.method, req.uri);
      var arity = layer.handle.length;
      if (err) {
        if (arity === 4) {
          layer.handle(err, req, res, next);
        } else {
          next(err);
        }
      } else if (arity < 4) {
        layer.handle(req, res, next);
      } else {
        next();
      }
    } catch (e) {
      console.error(e.stack) ;
      next(e);
    }
  }
  next();
};
