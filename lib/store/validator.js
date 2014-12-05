var _ = require('underscore')
  , joi = require('joi');

var Validator = function(schema, options) {
  if (this instanceof Validator === false) return new Validator(schema);

  this.schema = schema;

  this.options = _.extend({ stripUnknown: true, shouldThrow: true }, options);
};

Validator.prototype.validate = function(data) {
  var result = joi.validate(data, this.schema, this.options);

  if (result.error) {
    if (this.options.shouldThrow) {
      throw result.error;
    } else {
      return result.error;
    }
  }

  return result.value;
};

module.exports = Validator;