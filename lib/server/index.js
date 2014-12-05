var _ = require('underscore')
  , express = require('express')
  , chalk = require('chalk')
  , cons = require('consolidate')
  , path = require('path')
  , http = require('http')
  , https = require('https')
  , bodyParser = require('body-parser')
  , compress = require('compression')
  , morgan = require('morgan')
  , methodOverride = require('method-override')
  , gael = require('gael')
  , middleware = require('./middleware')
  , log = require('../log')
  , configuration = require('../configuration');

var Server = function(options) {
  if (this instanceof Server === false) return new Server(options);

  this.app = express();
  this.server = http.createServer(this.app);
  // this.secureServer = https.createServer(options, this.app);
  this.port = process.env.PORT || 3000;

  this.environment = process.env.NODE_ENV || 'development';
};

var noOp = function() {
  // Nothing
};

Server.prototype.configure = function(route) {
  if (configuration('logging:level') !== 'none') {
    this.app.use(morgan('dev', { skip: function(req, res) { return res.statusCode === 304; }}));
  }

  this.app.use(middleware.cors());

  this.app.use(bodyParser.urlencoded({ extended: false }))
  this.app.use(bodyParser.json())

  this.app.use(methodOverride());
  this.app.use(middleware.cookies());
  
  this.app.use(middleware.device.capture());
  middleware.device.enableViewRouting(this.app);

  route(this.app);

  this.app.engine('jade', cons.jade);
  this.app.set('view engine', 'jade');
  this.app.set('views', path.join(process.cwd(), 'lib/views'));

  this.app.use(compress());
  this.app.use(middleware.catchall());
  this.app.use(middleware.error());

  this.app.enable('trust proxy');
};

Server.prototype.runEnv = {
  development: function() { /* Nothing */ }
, ci: function() { /* Nothing */ }
, test: function() { /* Nothing */ }
, develop: function() { /* Nothing */ }
, testing: function() { /* Nothing */ }
, production: function() { /* Nothing */ }
};

Server.prototype.start = function(callback) {
  log.info('Starting ' + chalk.green(this.environment) + ' server at port ' + chalk.green(this.port));

  this.runEnv[this.environment]();

  // this.secureServer.listen(443)
  this.server.listen(this.port, callback || noOp);
};

Server.prototype.stop = function(callback) {
  // this.secureServer.close();
  this.server.close(callback || noOp);
};

module.exports = Server;