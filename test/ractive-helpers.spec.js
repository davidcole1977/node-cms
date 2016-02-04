var expect = require('chai').expect,
    module = require('../js-modules/ractive-helpers');
 
describe("RactiveHelpers", function() {

  describe("getIndexFromKeypath", function() {

    it('should return 0 when passed "fields.0"', function() {
      var result = module.getIndexFromKeypath('fields.0');
      expect(result).to.equal(0);
    });

    it('should return 245 when passed "fields.446.fields.245"', function() {
      var result = module.getIndexFromKeypath('fields.446.fields.245');
      expect(result).to.equal(245);
    });

    it('should return 2 when passed "fields.5.fields.0.fields.0.options.2"', function() {
      var result = module.getIndexFromKeypath('fields.5.fields.0.fields.0.options.2');
      expect(result).to.equal(2);
    });
 
  });

  describe("getParentKeypath", function() {

    it('should return "fields" when passed "fields.0"', function() {
      var result = module.getParentKeypath('fields.0');
      expect(result).to.equal('fields');
    });

    it('should return "fields.0" when passed "fields.0.options"', function() {
      var result = module.getParentKeypath('fields.0.options');
      expect(result).to.equal('fields.0');
    });

    it('should return "fields.0.options.foo" when passed "fields.0.options.foo.bar"', function() {
      var result = module.getParentKeypath('fields.0.options.foo.bar');
      expect(result).to.equal('fields.0.options.foo');
    });

    it('should return "fields" when passed an empty string', function() {
      var result = module.getParentKeypath('');
      expect(result).to.equal('fields');
    });

  });

  describe("getFieldsKeypath", function() {

    it('should return "fields" when passed an empty string', function() {
      var result = module.getFieldsKeypath('');
      expect(result).to.equal('fields');
    });

    it('should return "foo.bar.fields" when passed "foo.bar"', function() {
      var result = module.getFieldsKeypath('foo.bar');
      expect(result).to.equal('foo.bar.fields');
    });

  });

});