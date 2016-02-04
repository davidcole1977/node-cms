module.exports = (function () {

  var JsonEndpoints = function () {};

  // GET endpoints

  JsonEndpoints.getChunkDefList = function (callback) {
    $.getJSON('/get-chunk-definition-list/', callback);
  };

  JsonEndpoints.getChunkList = function (callback) {
    $.getJSON('/get-chunk-list/', callback);
  };

  JsonEndpoints.getChunkDef = function (chunkName, callback) {
    $.getJSON('/get-chunk-definition/' + chunkName, callback);
  };

  JsonEndpoints.getFieldDefSupportPartials = function (callback) {
    $.getJSON('/get-field-def-support-partials/', callback);
  };

  JsonEndpoints.getFieldDefPartials = function (callback) {
    $.getJSON('/get-field-def-partials/', callback);
  };

  JsonEndpoints.getFieldDefData = function (callback) {
    $.getJSON('/get-field-def-data/', callback);
  };

  // POST endpoints

  JsonEndpoints.deleteChunkDef = function (chunkDefData, callback) {
    $.post('/delete-chunk-definition/', chunkDefData, callback, 'json');
  };

  JsonEndpoints.makeChunkDef = function (chunkDefData, callback) {
    $.post('/make-chunk-definition/', chunkDefData, callback, 'json');
  };

  JsonEndpoints.saveChunkDef = function (chunkDefData, callback) {
    $.post('/save-chunk-definition/', chunkDefData, callback, 'json');
  };

  JsonEndpoints.deleteChunk = function (chunkData, callback) {
    $.post('/delete-chunk/', chunkData, callback, 'json');
  };

  JsonEndpoints.makeChunk = function (chunkData, callback) {
    $.post('/make-chunk/', chunkData, callback, 'json');
  };

  return JsonEndpoints;

})();