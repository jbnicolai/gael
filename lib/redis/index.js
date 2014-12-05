var Promise = require("bluebird")
  , redis = require("redis")
  , redback = require("redback")
  , chalk = require("chalk")
  , configuration = require("./connection")
  , log = require("../log");

var noOp = function() {};

var Redis = function() {
  if (this instanceof Redis === false) return new Redis();

  var config = configuration();
  
  this.connection = redis.createClient(config.port, config.host);
  if (config.password) this.connection.auth(config.password, noOp);

  this.redback = redback.use(this.connection);

  log.info("Connected to redis at " + chalk.green(config.host) + " on port " + chalk.green(config.port));
};

Redis.prototype.key = function() {
  var args = Array.prototype.slice.call(arguments);
  return args.join(":");
};

Redis.prototype.close = function() {
  var quit = Promise.promisify(this.connection.quit.bind(this.connection));

  return quit();
};

module.exports = new Redis;
