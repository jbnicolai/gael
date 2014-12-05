function NotAuthorizedError(message, status) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = "NotAuthorizedError";
  this.message = message || "NotAuthorized";
  this.status = status || 403;
}

NotAuthorizedError.prototype.__proto__ = Error.prototype;

module.exports = NotAuthorizedError;