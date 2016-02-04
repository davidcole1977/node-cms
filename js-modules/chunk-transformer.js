module.exports = (function () {

  var _ = require('lodash');

  function ChunkTransformer () {}

  ChunkTransformer.prototype.mapString = function (field, id, targetData) {
    targetData[id] = field.value;
  };

  ChunkTransformer.prototype.mapBoolean = function (field, id, targetData) {
    targetData[id] = field.selected;
  };

  ChunkTransformer.prototype.mapOptions = function (field, id, targetData) {
    var self = this;

    targetData[id] = [];

    field.options.forEach(function (option) {
      self.mapOption(option, targetData[id]);
    });
  };

  ChunkTransformer.prototype.mapOption = function (option, targetData) {
    if (option.selected === 'true') {
      targetData.push(option.value);
    }
  };

  ChunkTransformer.prototype.reverseMapOption = function (option, chunkField) {
    option.selected = _.includes(chunkField, option.value) ? true : false;
  };

  ChunkTransformer.prototype.reverseMapOptions = function (targetField, chunkField) {
    var self = this;

    targetField.options.forEach(function (option) {
      self.reverseMapOption(option, chunkField);
    });
  };

  ChunkTransformer.prototype.reverseMapBoolean = function (targetField, chunkValue) {
    if (typeof chunkValue !== 'undefined') {
      targetField.selected = chunkValue;
    }
  };

  ChunkTransformer.prototype.reverseMapString = function (targetField, chunkValue) {
    if (typeof chunkValue !== 'undefined') {
      targetField.value = chunkValue;
    }
  };

  ChunkTransformer.prototype.reverseMapFields = function (targetData, chunkField) {
    var self = this;

    targetData.fields.forEach(function (field) {
      
      // if it's a string
      if (typeof field.value !== 'undefined') {
        self.reverseMapString(field, chunkField[field.id]);
      }

      // if it's a boolean
      if (typeof field.selected !== 'undefined') {
        self.reverseMapBoolean(field, chunkField[field.id]);
      }

      // if it's a field group (fields)
      if (typeof field.fields !== 'undefined') {
        self.reverseMapFields(field, chunkField[field.id]);
      }

      // if it's an options group
      if (typeof field.options !== 'undefined') {
        self.reverseMapOptions(field, chunkField[field.id]);
      }
    });
  };

  ChunkTransformer.prototype.mapFields = function (field, id, targetData) {
    var self = this;

    targetData[id] = {};

    field.fields.forEach(function (field) {

      // if it's a string
      if (typeof field.value !== 'undefined') {
        self.mapString(field, field.id, targetData[id]);
      }

      // if it's a boolean
      if (typeof field.selected !== 'undefined') {
        self.mapBoolean(field, field.id, targetData[id]);
      }

      // if it's a field group (fields)
      if (typeof field.fields !== 'undefined') {
        self.mapFields(field, field.id, targetData[id]);
      }

      // if it's an options group
      if (typeof field.options !== 'undefined') {
        self.mapOptions(field, field.id, targetData[id]);
      }
    });
  };

  ChunkTransformer.prototype.mapDefToChunk = function (chunkDefinition) {
    var targetObject = {};

    this.mapFields(chunkDefinition, chunkDefinition.type, targetObject);

    targetObject.data = targetObject[chunkDefinition.type];
    targetObject.type = chunkDefinition.type;
    targetObject.name = typeof chunkDefinition.name != 'undefined' ?  chunkDefinition.name : '';
    targetObject.label = typeof chunkDefinition.label != 'undefined' ?  chunkDefinition.label : '';
    
    delete targetObject[chunkDefinition.type];
    
    return targetObject;
  };

  ChunkTransformer.prototype.mapChunkToDef = function (chunkDefinition, chunk) {
    var targetObject = _.cloneDeep(chunkDefinition);

    this.reverseMapFields(targetObject, chunk.data);

    targetObject.label = typeof chunk.label != 'undefined' ?  chunk.label : chunkDefinition.label;
    targetObject.name = typeof chunk.name != 'undefined' ?  chunk.name : chunkDefinition.name;

    return targetObject;
  };

  return {
    ChunkTransformer: ChunkTransformer
  };

})();
  