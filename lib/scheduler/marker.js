var Promise = require("bluebird")
  , redis = require("../redis");

var Marker = function() {
  if (this instanceof Marker === false) return new Marker(identifier);
};

var promisify = function(method, args) {
  return Promise.promisify(redis.connection[method]).apply(redis.connection, args);
};

var key = function(identifier) {
  return redis.key("mark", identifier);
};

Marker.prototype.get = function(identifier) {
  return promisify("get", [ key(identifier) ]);
};

Marker.prototype.mark = function(identifier, seconds) {
  var id = key(identifier);

  return promisify("set", [ id, true ]).then(function() {
    return promisify("expire", [ id, seconds ]);
  });
};

Marker.prototype.guard = function(identifier, seconds, promise) {
  return this.get(identifier).then(function(marked) {
    if (marked) return;
    return this.mark(identifier, seconds).then(function() {
      return promise();
    });
  }.bind(this));
};

module.exports = new Marker;