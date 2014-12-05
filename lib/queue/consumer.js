var redis = require("redis")
  , util = require("util")
  , events = require("events")
  , chalk = require("chalk")
  , log = require("../log")
  , configuration = require("../redis/connection");

var noOp = function() {};

var Consumer = function() {
  if (this instanceof Consumer === false) return new Consumer;

  this.config = configuration();

  events.EventEmitter.call(this);
};

util.inherits(Consumer, events.EventEmitter);

var connect = function(name) {  
  var connection = redis.createClient(this.config.port, this.config.host);
  if (this.config.password) connection.auth(this.config.password, noOp);

  log.info("Connected to redis for message queue " + chalk.green(name) + " at " + chalk.green(this.config.host) + " on port " + chalk.green(this.config.port));

  return connection;
};

Consumer.prototype.listen = function(name) {
  var that = this
    , conn = connect.call(that, name);

  var listen = function() {
    conn.blpop("queue:" + name, 0, function(err, data) {
      if (err) that.emit("error", err);
      if (!err && data && data.length > 0) that.emit("data", JSON.parse(data[1]));

      listen(); // again
    });
  };

  return listen();
};

module.exports = Consumer;