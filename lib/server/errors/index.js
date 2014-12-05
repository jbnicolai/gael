module.exports = {
  NotFoundError: require('./notfound')
, UnauthenticatedError: require('./unauthenticated')
, NotAuthorizedError: require('./notauthorized')
, DuplicateError: require('./duplicate')
, DeclinedError: require('./declined')
, ValidationError: require('./validation')
};