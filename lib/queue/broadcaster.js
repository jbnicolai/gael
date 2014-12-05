var Promise = require("bluebird")
  , debug = require("debug")("sockets")
  , redis = require("../redis")
  , configuration = require("../redis/connection");

var Broadcaster = function() {
  if (this instanceof Broadcaster === false) return new Broadcaster;
};

Broadcaster.prototype.broadcast = function(channel, data, user) {
  var conn = redis.connection
    , publish = Promise.promisify(conn.publish.bind(conn));

  debug("Broadcasting message on channel " + channel);

  return publish("channel:" + channel, JSON.stringify({ data: data, user: user }));
};

module.exports = new Broadcaster;