var Promise = require("bluebird")
  , knox = require("knox")
  , configuration = require("../configuration");

var Store = function() {
  if (this instanceof Store === false) return new Store;

  this.client = knox.createClient({
    key: configuration("S3:KEY")
  , secret: configuration("S3:SECRET")
  , bucket: configuration("S3:BUCKET")
  , region: configuration("S3:REGION")
  });
};

Store.prototype.upload = function(name, file, type) {
  var client = this.client;

  return new Promise(function(resolve, reject) {
    client.putFile(file, name, { "Content-Type": type, "x-amz-acl": "public-read" }
    
    , function(err, result) {
      if (err) return reject(err);
      
      if (result.statusCode === 200) {
        return resolve(result.req.url);
      }

      return reject(new Error("Error uploading to S3"));
    });
  });
};

Store.prototype.remove = function(url) {
  var deleteFile = Promise.promisify(this.client.deleteFile.bind(this.client));
  return deleteFile(url);
};

Store.prototype.download = function(url) {
  var client = this.client;

  return new Promise(function(resolve, reject) {
    var data = "";

    client.get(url).on("response", function(response) {
      response.setEncoding("binary");

      if (response.statusCode !== 200) return resolve();

      response.on("data", function(chunk) {
        data += chunk;
      });

      response.on("end", function() {
        return resolve(data);
      });
    })

    .end();    
  });
};

module.exports = new Store;