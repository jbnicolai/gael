var Promise = require("bluebird")
  , elasticsearch = require("elasticsearch")
  , chalk = require("chalk")
  , configuration = require("../configuration")
  , log = require("../log");

var PAGE_SIZE = 10;

var Search = function(type) {
  if (this instanceof Search === false) return new Search(type);

  this.url = configuration("elasticsearch:url");
  this.env = process.env.NODE_ENV || "development";
  this.type = type;
  this.client = elasticsearch.Client({ host: this.url });

  log.info("Connected to elasticsearch at " + chalk.green(this.url));
};

var promisify = function(method) {
  return Promise.promisify(this.client[method].bind(this.client));
};

Search.prototype.paging = function(page, size, defaultPage) {
  if (page == null) page = defaultPage || 1;
  if (size == null) size = PAGE_SIZE;

  page = parseInt(page, 10);

  return { from: (page-1) * size, limit: size };
};

Search.prototype.index = function(doc) {
  var index = promisify.call(this, "index");

  return index({ index: this.env, type: this.type, id: doc.id, body: doc });
};

Search.prototype.search = function(query, page, sort) {
  var search = promisify.call(this, "search")
    , paging = this.paging(page);

  return search({ 
    index: this.env
  , type: this.type
  , body: { from: paging.from, size: paging.size, query: query, sort: sort }
  })

  .then(function(results) {
    return { 
      total: results[0].hits.total
    , results: results[0].hits.hits.map(function(hit) {
        return hit._source;
      })
    };
  });
};

Search.prototype.remove = function(id) {
  var remove = promisify.call(this, "delete");

  return remove({ index: this.env, type: this.type, id: id });
};

module.exports = Search;
