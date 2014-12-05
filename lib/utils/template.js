var Promise = require("bluebird")
  , fs = require("fs")
  , jade = require("jade");

var load = function(directory, name, done) {
  fs.readFile(directory + "/" + name + ".html", "utf8", done);
};

module.exports = function(directory) {

  return function(name, data) {
    return new Promise(function(resolve, reject) {
      
      load(directory, name, function(err, template) {
        if (err) return reject(err);

        try {
          var text = jade.compile(template)(data);
          return resolve(text);
        } catch(err) {
          return reject(err);
        }
      });
    });
  };
};
