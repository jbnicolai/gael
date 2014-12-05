var should = require('should')
  , bcrypt = require('bcrypt')
  , sut = require('../../../lib/security/authenticator');

describe('When using the Authenticator service', function() {

  var suite = this;

  describe('When encrypting a password', function() {

    before(function(done) {
      sut.encrypt('password').then(function(result) {
        suite.hashedPassword = result.hash;
        suite.salt = result.salt;
        done();
      });
    });

    it('should not return the same value', function() {
      suite.hashedPassword.should.not.equal('password');
    });

    it('should hash the password', function() {
      suite.hashedPassword.should.equal(bcrypt.hashSync('password', suite.salt));
    });

    describe('When authenticating with a valid password', function() {

      before(function(done) {
        sut.authenticate(suite.hashedPassword, 'password').then(function(result) {
          suite.matches = result;
          done();
        });
      });

      it('should succeed', function() {
        suite.matches.should.be.true;
      });
    });

    describe('When generating a token', function() {

      before(function(done) {
        sut.generateToken().then(function(result) {
          suite.token = result.token;
          suite.hashedToken = result.hashedToken;
          done();
        });
      });

      it('should return a token and a hash of that token', function() {
        suite.token.should.exist;
        suite.hashedToken.should.not.equal(suite.token);
      });

      describe('When validating the token', function() {

        before(function(done) {
          sut.validate(suite.hashedToken, suite.token).then(function(validated) {
            suite.validated = validated;
            done();
          });
        });

        it('should return with the original token', function() {
          suite.validated.should.be.true;
        });

      });

      describe('When validating an invalid token', function() {

        before(function(done) {
          sut.validate(suite.hashedToken, 'invalid').then(null, function(err) {
            suite.error = err;
            done();
          });
        });

        it('should return an error', function() {
          suite.error.should.be.an.instanceOf(Error);
        });

        it('should return with an error message', function() {
          suite.error.message.should.equal('auth.token');
        });

      });
    });

    describe('When authenticating with an invalid password', function() {

      before(function(done) {
        sut.authenticate(suite.hashedPassword, 'invalid').then(null, function(err) {
          suite.error = err;
          done();
        });
      });

      it('should return an error', function() {
        suite.error.should.be.an.instanceOf(Error);
      });

      it('should return with an error message', function() {
        suite.error.message.should.equal('auth.credentials');
      });

    });
  });

});