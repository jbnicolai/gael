var nconf = require("nconf");

require("./configure")();

module.exports = function(key) {
  return nconf.get(key.toUpperCase());
};