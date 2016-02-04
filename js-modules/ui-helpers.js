module.exports = (function () {

  var UIHelpers = function () {};

  UIHelpers.getHashSlash = function () {
    var hashSlashRegex = /#\/([A-Za-z0-9\-_]+)$/;
    return window.location.hash.match(hashSlashRegex)[1];
  };

  // supports drag and drop reordering of fields
  UIHelpers.getInsertIndex = function (yCoord, positionsData) {
    var insertIndex = 0;

    positionsData.forEach(function (datum, index) {
      var halfHeight = (datum.bottom - datum.top) / 2;

      if (yCoord >= datum.top - halfHeight) {
        insertIndex = index;
      }
    });

    return insertIndex;
  };

  // supports drag and drop reordering of fields
  UIHelpers.getFieldYCoordsAndHeights = function (fieldElem, parentArray) {
    var positions = [],
        fieldElems = fieldElem.siblings('.nodecms-field').andSelf();

    fieldElems.each(function (i) {
      var currentFieldElem = $(this),
          top = Math.ceil(currentFieldElem.offset().top),
          height = currentFieldElem.outerHeight(),
          bottom = top + height;

      positions.push({
        top: top,
        bottom: bottom,
        elem: currentFieldElem
      });

    });

    return positions;
  };

  return UIHelpers;

})();