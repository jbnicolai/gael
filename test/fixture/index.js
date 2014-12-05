var faker = require('faker');

module.exports = function(factory) {

  var userName = function(i) {
    return faker.Internet.userName().toLowerCase();
  };

  var securityKey = function(i) {
    return { low: 0, high: faker.random.number(999999) }
  };

  var randomNumber = function(i) { 
    return faker.random.number(999999).toString() 
  };

  factory.define('group', [
    'name'.as(userName)
  , 'code'.as(randomNumber)
  , 'key'.as(securityKey)
  , 'apiKey'
  ]);

  factory.define('role', [
    'name'.as(userName)
  ]);

  factory.define('user', [
    'name'.as(userName)
  , 'networkId'.as(randomNumber)
  ]);

  factory.define('event', [
    'name'.as(userName)
  , 'description'
  , 'startsAt'.asDate()
  , 'price'.asNumber()
  ]);

};