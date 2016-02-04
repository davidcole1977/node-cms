module.exports = (function () {

  var RactiveHelpers = function () {};

  RactiveHelpers.getIndexFromKeypath = function (keypath) {
    return parseInt(keypath.match(/\d+$/)[0]);
  };

  RactiveHelpers.getParentKeypath = function (keypath) {
    if (keypath.length === 0) {
      return 'fields';
    }

    return keypath.replace(/\.\w+$/, '');
  };

  RactiveHelpers.getFieldsKeypath = function (keypath) {
    return keypath.length === 0 ? 'fields' : keypath + '.fields';
  };

  return RactiveHelpers;

})();