var LEVELS = [ 1, 10, 100000 ];

var Key = function(levels) {
  if (this instanceof Key === false) return new Key(levels);

  this.levels = levels || LEVELS;
};

Key.prototype.generate = function(parentKey, parentLevel, existingChildren) {
  var range = parentKey.high / this.levels[parentLevel]
    , low = parseInt((existingChildren * range) + parentKey.low, 10)
    , high = parseInt(((existingChildren + 1) * range) + parentKey.low - 1, 10);

  return { low: low, high: high };
};

Key.prototype.authorize = function(key, resource) {
  if (resource == null || resource.key == null) return true;

  return resource.key.low >= key.low && resource.key.high <= key.high;
};

module.exports = Key;