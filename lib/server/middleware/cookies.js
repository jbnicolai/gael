var keygrip = require('keygrip')
  , cookies = require('cookies').express

module.exports = function() {
  var keys = keygrip([ 'versus', 'games' ]);
  return cookies(keys);
};