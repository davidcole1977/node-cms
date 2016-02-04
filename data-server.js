(function () {

  var fs = require('fs'),
      express = require('express'),
      bodyParser = require('body-parser'),
      _ = require('lodash'),
      chalk = require('chalk'),
      ChunkTransformer = require('./js-modules/chunk-transformer').ChunkTransformer,
      expressApp = express(),
      publicDir = __dirname + '/public_html',
      contentDefDir = __dirname + '/_content-definitions',
      chunkDefDir = contentDefDir + '/chunks',
      fieldDefDir = contentDefDir + '/fields',
      fieldDefsSupportDir = fieldDefDir + '/support',
      fieldDefBaseDataFile = fieldDefsSupportDir + '/field-definition-base.json',
      contentDir = __dirname + '/_content',
      chunkDir = contentDir + '/chunks',
      defaultChunkData;

  defaultChunkData = {
    type: '',
    label: '',
    fields: []
  };

  function reduceArray (array, regExp) {
    return array.filter(function (value) {
      return regExp.test(value);
    });
  }

  function stripObjectKeys (object, regExp) {
    var strippedObject = {};

    _.forOwn(object, function (value, key) {
      strippedObject[key.match(regExp)[0]] = value;
    });

    return strippedObject;
  }

  function getFilteredFileNamesInDir (directory, regExp) {
    var fileNames = fs.readdirSync(directory);

    return fileNames.filter(function (fileName) {
      return regExp.test(fileName);
    });
  }

  function getFilesAsStrings (directory, fileNames) {
    var filesContents = {};

    fileNames.forEach(function (fileName) {
      filesContents[fileName] = fs.readFileSync(directory + '/' + fileName, {encoding: 'utf8'});
    });

    return filesContents;
  }

  function getFileAsObject (fileLocation) {
    var fileContent = fs.readFileSync(fileLocation, {encoding: 'utf8'});

    return JSON.parse(fileContent);
  }

  function getFilesAsObjects (directory, fileNames) {
    var filesContents = {};

    fileNames.forEach(function (fileName) {
      filesContents[fileName] = getFileAsObject(directory + '/' + fileName);
    });

    return filesContents;
  }

  function applyBaseData (baseDatum, data) {

    return _.mapValues(data, function (datum) {
      var clonedBaseDatum = _.cloneDeep(baseDatum);

      _.merge(clonedBaseDatum, datum);

      return clonedBaseDatum;
    });

  }

  /**
   * reduce the data to just type and label
   */
  function optimiseChunkDefData (chunkDefData) {
    return _.mapValues(chunkDefData, function (defData) {
      return {
        type: defData.type,
        label: defData.label
      }
    });
  }

  /**
   * reduce the data to just type, label and name
   */
  function optimiseChunkData (chunkData) {
    return _.mapValues(chunkData, function (chunk) {
      return {
        type: chunk.type,
        label: chunk.label,
        name: chunk.name
      }
    });
  }

  /**
   * take a simple object with a set of key / value pairs, and transform
   * it into an array of values, without the keys
   */
  function changeKeysToArray (simpleObject) {
    var keylessArray = [];

    _.forOwn(simpleObject, function (value) {
      keylessArray.push(value);
    });

    return keylessArray;
  }

  function getFieldDefSupportPartials () {
    var fileNameRegExp = /.+(?=\.partial)/,
        fileNames = getFilteredFileNamesInDir(fieldDefsSupportDir, fileNameRegExp),
        filesContents = getFilesAsStrings(fieldDefsSupportDir, fileNames);

    return stripObjectKeys(filesContents, fileNameRegExp);
  }

  function getFieldDefPartials () {
    var fileNameRegExp = /.+(?=\.fielddef\.partial)/,
        fileNames = getFilteredFileNamesInDir(fieldDefDir, fileNameRegExp),
        filesContents = getFilesAsStrings(fieldDefDir, fileNames);

    return stripObjectKeys(filesContents, fileNameRegExp);
  }

  function getFieldDefData () {
    var fileNameRegExp = /.+(?=\.fielddef\.json)/,
        fileNames = getFilteredFileNamesInDir(fieldDefDir, fileNameRegExp),
        fieldDefData = getFilesAsObjects(fieldDefDir, fileNames),
        fieldDefBaseData = getFileAsObject(fieldDefBaseDataFile),
        fieldDefData = applyBaseData(fieldDefBaseData, fieldDefData);

    return stripObjectKeys(fieldDefData, fileNameRegExp);
  }

  function getChunkDefList () {
    var fileNameRegExp = /.+(?=\.chunkdef\.json)/,
        fileNames = getFilteredFileNamesInDir(chunkDefDir, fileNameRegExp),
        chunkDefData = getFilesAsObjects(chunkDefDir, fileNames),
        chunkDefData = optimiseChunkDefData(chunkDefData),
        chunkDefData = changeKeysToArray(chunkDefData);

    return chunkDefData;
  }

  function getChunkList () {
    var fileNameRegExp = /.+(?=\.chunk\.json)/,
        fileNames = getFilteredFileNamesInDir(chunkDir, fileNameRegExp),
        chunkData = getFilesAsObjects(chunkDir, fileNames),
        chunkData = optimiseChunkData(chunkData),
        chunkData = changeKeysToArray(chunkData);

    return chunkData;
  }

  function getChunkDefPath (type) {
    return chunkDefDir + '/' + type + '.chunkdef.json';
  }

  function getChunkPath (name, type) {
    return chunkDir + '/' + name + '.' + type + '.chunk.json';
  }

  function getChunkBase (chunkDefType) {
    var chunkDefFilepath = getChunkDefPath(chunkDefType),
        chunkDef = getFileAsObject(chunkDefFilepath),
        chunkTransformer = new ChunkTransformer(),
        chunkBase = chunkTransformer.mapDefToChunk(chunkDef);

    return chunkBase;
  }

  // allows us to receive requests using JSON or URL encoded data
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({
    extended: true
  }));

  // serve static files
  expressApp.use(express.static(publicDir));

  /**
   * Data End Points
   */
  expressApp.get('/get-field-def-partials/', function (request, response) {
    response.send(getFieldDefPartials());
  });

  expressApp.get('/get-field-def-support-partials/', function (request, response) {
    response.send(getFieldDefSupportPartials());
  });

  expressApp.get('/get-field-def-data/', function (request, response) {
    response.send(getFieldDefData());
  });
   
  expressApp.get('/get-chunk-definition/:name', function (request, response) {
    response.sendFile(chunkDefDir + '/' + request.params.name + '.chunkdef.json');
  });

  expressApp.get('/get-chunk/:type/:name', function (request, response) {
    response.sendFile(chunkDir + '/' + request.params.name + '.' + request.params.type + '.chunk.json');
  });

  expressApp.get('/get-chunk-definition-list/', function (request, response) {
    response.send(getChunkDefList());
  });

  expressApp.get('/get-chunk-list/', function (request, response) {
    response.send(getChunkList());
  });

  expressApp.post('/make-chunk-definition/', function (request, response) {
    var chunkData = _.cloneDeep(defaultChunkData),
        filepath = getChunkDefPath(request.body.type);

    chunkData.type = request.body.type;

    fs.writeFile(filepath, JSON.stringify(chunkData, null, 2), function (error) {
      if (error) {
        console.log(chalk.red(error));
        response.send({ success: false });
      } else {
        response.send({
          success: true,
          data: chunkData
        });
      }
    });
  });

  expressApp.post('/make-chunk/', function (request, response) {
    var chunkBaseData = getChunkBase(request.body.type),
        chunkFilepath = getChunkPath(request.body.name, request.body.type);

    chunkBaseData.name = request.body.name;

    fs.writeFile(chunkFilepath, JSON.stringify(chunkBaseData, null, 2), function (error) {
      if (error) {
        console.log(chalk.red(error));
        response.send({ success: false });
      } else {
        response.send({
          success: true,
          data: {
            label: '',
            name: request.body.name,
            type: request.body.type
          }
        });
      }
    });
  });

  expressApp.post('/delete-chunk/', function (request, response) {
    var filepath = getChunkPath(request.body.name, request.body.type);

    fs.unlink(filepath, function (error) {
      if (error) {
        console.log(chalk.red(error));
        response.send({ success: false });
      } else {
        response.send({
          success: true,
          data: request.body
        });
      }
    });
  });

  expressApp.post('/delete-chunk-definition/', function (request, response) {
    var filepath = getChunkDefPath(request.body.type);

    fs.unlink(filepath, function (error) {
      if (error) {
        console.log(chalk.red(error));
        response.send({ success: false });
      } else {
        response.send({
          success: true,
          data: request.body
        });
      }
    });
  });

  expressApp.post('/save-chunk-definition/', function (request, response) {
    fs.writeFile(chunkDefDir + '/' + request.body.type + '.chunkdef.json', JSON.stringify(request.body, null, 2), function (error) {
      if (error) {
        console.log(chalk.red(error));
        response.send({ success: false });
      } else {
        response.send({ success: true });
      }
    });
  });

  // start server
  expressApp.listen(3000);
  console.log(chalk.cyan('Data server started at localhost:3000'));

})();