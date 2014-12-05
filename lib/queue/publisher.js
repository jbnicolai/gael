var Promise = require("bluebird")
  , redis = require("../redis");

var Publisher = function() {
  if (this instanceof Publisher === false) return new Publisher;
};

Publisher.prototype.publish = function(queue, data) {
  var conn = redis.connection
    , rpush = Promise.promisify(conn.rpush.bind(conn));

  return rpush("queue:" + queue, JSON.stringify(data));
};

module.exports = new Publisher;