var _ = require("underscore");

var serialize = function(o) {
  if (o == null) return null;

  o.id = o._id;
  delete o._id;
  return o;  
};

var deserialize = function(o) {
  if (o == null) return null;
  
  o._id = o.id;
  delete o.id;
  return o;  
};

var run = function(data, fn) {
  if (_(data).isArray()) {
    return data.map(fn);
  } else {
    return fn(data);
  }
};

module.exports.serialize = function(data) {
  return run(data, serialize);
};

module.exports.deserialize = function(data) {
  return run(data, deserialize);
};