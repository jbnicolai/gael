var _ = require("underscore")
  , Promise = require("bluebird")
  , Validator = require("./validator")
  , serializer = require("./serializer")
  , store = require("./");

var PAGE_SIZE = 10;

var Repository = function(model) {
  if (this instanceof Repository === false) return new Repository(model);

  this.database = store.database;
  this.model = this.database.get(model);
};

var promisify = function(promise) {
  return new Promise(function(resolve, reject) {
    promise.success(function(data) {
      resolve(serializer.serialize(data));
    })
    .error(reject);
  });
};

Repository.prototype.promisify = promisify;
Repository.prototype.serialize = serializer.serialize;
Repository.prototype.deserialize = serializer.deserialize;

Repository.prototype.validate = function(data, schema, options) {
  var validator = new Validator(schema, options);
  return validator.validate(data);
};

Repository.prototype.id = function(id) {
  try {
    return this.model.id(id);
  } catch(e) {
    return undefined;
  }
};

Repository.prototype.paging = function(page, size, defaultPage) {
  if (page == null) page = defaultPage || 1;
  if (size == null) size = PAGE_SIZE;

  page = parseInt(page, 10);

  var skip = (page-1) * size;
  return { skip: skip, limit: size, from: skip, to: skip + size-1, page: page };
};

Repository.prototype.get = function(id) {
  return promisify(this.model.findById(id));
};

Repository.prototype.find = function(query) {
  return promisify(this.model.findOne(query));
};

Repository.prototype.list = function(query, options) {
  return promisify(this.model.find(query, options));
};

Repository.prototype.ids = function(ids, options) {
  if (_(ids).isArray() === false) ids = [ ids ];

  ids = ids.map(this.id.bind(this));  // Cast to ObjectId
  
  return this.list({ _id: { $in: ids }}, options);
};

Repository.prototype.all = function(options) {
  return promisify(this.model.find({}, options));
};

Repository.prototype.count = function(query) {
  return promisify(this.model.count(query));
};

Repository.prototype.create = function(data) {
  return promisify(this.model.insert(data));
};

Repository.prototype.update = function(id, data) {
  return promisify(this.model.updateById(id, { $set: data }));
};

Repository.prototype.remove = function(query) {
  return promisify(this.model.remove(query));
};

Repository.prototype.destroy = function(id) {
  return promisify(this.model.remove({ _id: id }));
};

Repository.prototype.truncate = function() {
  return promisify(this.model.remove());
};

Repository.prototype.createIndex = function(index, options) {
  return promisify(this.model.index(index, options));
};

Repository.prototype.createIndexes = function() {
  var model = this.model
    , indexes = Array.prototype.slice.call(arguments);

  return Promise.all(indexes.map(function(index) {
    return promisify(model.index(index));
  }));
};

module.exports = Repository;