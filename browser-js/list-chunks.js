(function () {

  var jsonEndpoints = require('../js-modules/client-endpoints'),
      ractiveHelpers = require('../js-modules/ractive-helpers'),
      _ = require('../node_modules/lodash'),
      templateHelpers = Ractive.defaults.data,
      chunkListRactive;

  templateHelpers.sortCollection = function (array, sortKey, direction) {
    var array = array.slice(); // clone, so we don't modify the underlying data

    direction = direction === 'asc' ? 1 : -1

    return array.sort( function ( a, b ) {
      return a[sortKey].toUpperCase() < b[sortKey].toUpperCase() ? -1 * direction : 1 * direction;
    });
  }

  chunkListRactive = new Ractive({
    el: 'chunkListContainer',
    template: '#chunkListTemplate',
    data: {
      newchunktype: '',
      newchunkname: '',
      chunks: [],
      sortKey: 'label',
      sortDirection: 'asc'
    }
  });

  function getIndexByTypeAndName (type, name) {
    var chunkIndex = 0;

    chunkListRactive.get('chunks').forEach(function (chunk, index) {
      if (chunk.type === type && chunk.name === name) {
        chunkIndex = index;
      }
    });

    return chunkIndex;
  }

  chunkListRactive.on('deleteChunk', function (event, type, name) {
    var confirm = window.prompt('Are you sure? Type "DELETE".'),
        postData = {
          type: type,
          name: name
        };

    if (confirm !== 'DELETE') {
      return false;
    }

    jsonEndpoints.deleteChunk(postData, function (result) {
      var index = getIndexByTypeAndName(type, name);

      if (result.success) {
        chunkListRactive.splice('chunks', index, 1);
      } else {
        alert('Sorry, there was a problem deleting the chunk');
      }
    });
  });

  chunkListRactive.on('makenewchunk', function (event, type, name) {
   var dataIsValid = document.getElementById('makeNewChunkForm').checkValidity(),
        postData = {
          type: type,
          name: name
        };

    if (!dataIsValid) {
      alert('Sorry, can\'t make a new chunk, as required fields are missing or invalid.');
      return;
    }

    jsonEndpoints.makeChunk(postData, function (result) {
      if (result.success) {
        chunkListRactive.push('chunks', result.data);
      } else {
        alert('Sorry, there was a problem making the new chunk');
      }
    });
  });

  chunkListRactive.on('sortChunks', function (event, sortKey) {
    var direction = 'asc';

    if (sortKey === this.get('sortKey')) {
      direction = this.get('sortDirection') === 'asc' ? 'desc' : 'asc';
    }

    this.set('sortKey', sortKey);
    this.set('sortDirection', direction);
  });

  jsonEndpoints.getChunkList(function (chunkData) {
    chunkListRactive.set('chunks', chunkData)
  });

})();

