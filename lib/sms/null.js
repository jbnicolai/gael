var Promise = require("bluebird")
  , log = require("../log");

module.exports = function(user, text) {
  log.info(text);

  return new Promise(function(resolve, reject) {
    process.nextTick(resolve);
  });
};