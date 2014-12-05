var _ = require('underscore')
  , should = require('should')
  , Sut = require('../../../lib/security/key');

describe('When using the Key service', function() {

  var suite = this;

  before(function() {
    suite.sut = new Sut([ 1, 10 ]);
  });

  describe('When generating a key', function() {

    before(function() {

      suite.keys = _(10).times(function(index) {
        return suite.sut.generate({ low: 0, high: 1000 }, 0, index);
      });

      suite.first = _(suite.keys).first();
    });

    it('should generate a key with a low range', function() {
      suite.first.low.should.exist;
    });

    it('should generate a key with a high range', function() {
      suite.first.low.should.exist;
    });
 
  });

});