var configuration = require("../configuration")
  , winston = require("winston")
  , fs = require("fs")

var Papertrail = require("winston-papertrail").Papertrail;

var type = configuration("logging:type")
  , level = configuration("logging:level");

var papertrailLogger = function() {
  var getVersion = function() {
    var json = require(process.cwd() + "/package.json");
    return json.version;
  };

  var options = {
    host            : configuration("papertrail:host") 
  , port            : configuration("papertrail:port")
  , hostname        : process.env.NODE_ENV
  , program         : "thenewshub-" + getVersion()
  , level           : level
  , maximumAttempts : 10
  };

  winston.add(Papertrail, options);
  
  return winston;
};

var fileLogger = function() {
  var filename = "logs/" + name + ".log";
  
  winston.add(winston.transports.File, { level: level, filename: filename });
  
  return winston;
};

var consoleLogger = function() {
  return new winston.Logger({
    transports: [
      new winston.transports.Console({ 
        level: level 
      })
    ]
  });
};

var logger;

if (type === "papertrail") 
  logger = papertrailLogger() 
else if (type === "file")
  logger = fileLogger();
else
  logger = consoleLogger();

module.exports = logger;
