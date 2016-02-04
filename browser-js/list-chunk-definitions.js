(function () {

  var jsonEndpoints = require('../js-modules/client-endpoints'),
      ractiveHelpers = require('../js-modules/ractive-helpers'),
      _ = require('../node_modules/lodash'),
      chunkDefListRactive;

  chunkDefListRactive = new Ractive({
    el: 'chunkDefListContainer',
    template: '#chunkDefListTemplate',
    data: {
      newchunkdeftype: '',
      chunkdefinitions: []
    }
  });

  chunkDefListRactive.on('deleteChunkDef', function (event, type) {
    var confirm = window.prompt('Are you sure? Type "DELETE".'),
        postData = {
          type: type
        };

    if (confirm !== 'DELETE') {
      return false;
    }

    jsonEndpoints.deleteChunkDef(postData, function (result) {
      var index = ractiveHelpers.getIndexFromKeypath(event.keypath);

      if (result.success) {
        chunkDefListRactive.splice('chunkdefinitions', index, 1);
      } else {
        alert('Sorry, there was a problem deleting the chunk definition');
      }
    });
  });

  chunkDefListRactive.on('makenewchunkdef', function (event, type) {
   var dataIsValid = document.getElementById('makeNewChunkDefForm').checkValidity(),
        postData = {
          type: type
        };

    if (!dataIsValid) {
      alert('Sorry, can\'t make a new chunk definition, as required fields are missing or invalid.');
      return;
    }

    jsonEndpoints.makeChunkDef(postData, function (result) {
      if (result.success) {
        chunkDefListRactive.push('chunkdefinitions', result.data);
      } else {
        alert('Sorry, there was a problem making the new chunk definition');
      }
    });
  });

  jsonEndpoints.getChunkDefList(function (chunkListData) {
    chunkDefListRactive.set('chunkdefinitions', chunkListData);
  });

})();

