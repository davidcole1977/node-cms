(function () {

  var jsonEndpoints = require('../js-modules/client-endpoints'),
      ractiveHelpers = require('../js-modules/ractive-helpers'),
      uiHelpers = require('../js-modules/ui-helpers'),
      _ = require('../node_modules/lodash');

  var fields = [];
      // fieldDefs = {};

  function onFieldsListRactiveInit () {

    jsonEndpoints.getChunkDef(uiHelpers.getHashSlash(), function (chunkDefJSON) {
      fieldsListRactive.set('label', chunkDefJSON.label);
      fieldsListRactive.set('type', chunkDefJSON.type);
      fieldsListRactive.set('fields', chunkDefJSON.fields);
    });

    jsonEndpoints.getFieldDefData(function (data) {
      fieldsListRactive.set('fieldDefs', data);
    });

  }

  var fieldsListRactive;

  function initFieldsListRactive (partials) {
    var previouslyFocusedFieldElems = {};
        previouslyFocusedFieldElem = null;

    fieldsListRactive = new Ractive({
      el: 'fields-container',
      template: '#fields-container-template',
      data: {
        label: '',
        type: '',
        fields: fields,
        fieldDefs: {}
      },
      oninit: onFieldsListRactiveInit
    });

    fieldsListRactive.on( 'change', function (event) {
      var dataString = JSON.stringify(fieldsListRactive.get(), null, 2);
      
      $('#show-json').html(dataString);
    });

    fieldsListRactive.on( 'savechunkdef', function (event) {
      var dataIsValid = document.getElementById('chunkDefinitionForm').checkValidity(),
          postData = {
            label: fieldsListRactive.get('label'),
            type: fieldsListRactive.get('type'),
            fields: fieldsListRactive.get('fields')
          };

      if (!dataIsValid) {
        alert('Sorry, can\'t save, as required fields are missing or invalid.');
        return;
      }

      jsonEndpoints.saveChunkDef(postData, function (result) {
        if (result.success) {
          alert('saved :)');
        } else {
          alert('sorry, there was a problem saving :(');
        }
      });
    });

    fieldsListRactive.on( 'focusfield', function (event) {
      var focusedFieldElem = $(event.node),
          parentContext = ractiveHelpers.getParentKeypath(event.keypath),
          childContext = event.keypath + '.fields';

      if (focusedFieldElem.attr('data-being-dragged') === 'true') {
        return;
      }

      if (previouslyFocusedFieldElem !== null) {
        previouslyFocusedFieldElem.removeClass('nodecms-field_current');
      }

      if (typeof previouslyFocusedFieldElems[parentContext] !== 'undefined') {
        previouslyFocusedFieldElems[parentContext].removeClass('nodecms-field_focused');
      }

      if (typeof previouslyFocusedFieldElems[childContext] !== 'undefined') {
        previouslyFocusedFieldElems[childContext].removeClass('nodecms-field_focused');
      }

      focusedFieldElem.addClass('nodecms-field_focused');
      focusedFieldElem.addClass('nodecms-field_current');

      previouslyFocusedFieldElem = focusedFieldElem;
      previouslyFocusedFieldElems[parentContext] = focusedFieldElem;
    });

    fieldsListRactive.on('removeArrayEntry', function (event) {
      var optionsArray = fieldsListRactive.get(ractiveHelpers.getParentKeypath(event.keypath)),
          optionIndex = ractiveHelpers.getIndexFromKeypath(event.keypath);

      optionsArray.splice(optionIndex, 1);
    });

    fieldsListRactive.on('duplicateArrayEntry', function (event) {
      var optionsArray = fieldsListRactive.get(ractiveHelpers.getParentKeypath(event.keypath)),
          clonedOption = _.cloneDeep(fieldsListRactive.get(event.keypath)),
          optionIndex = ractiveHelpers.getIndexFromKeypath(event.keypath);

      optionsArray.splice(optionIndex, 0, clonedOption);
    });

    function moveArrayEntry (array, oldIndex, newIndex) {
      var clonedEntry = _.cloneDeep(array[oldIndex]);

      array.splice(oldIndex, 1);
      array.splice(newIndex, 0, clonedEntry);
    }

    fieldsListRactive.on('startDraggingArrayEntry', function (event) {
      var parentKeypath = ractiveHelpers.getParentKeypath(event.keypath),
          parentArray = fieldsListRactive.get(parentKeypath),
          fieldIndex = ractiveHelpers.getIndexFromKeypath(event.keypath),
          fieldElem = $(event.original.target).closest('.nodecms-field'),
          clonedFieldElem = null,
          viewportOffset = $('#field-maker-ui').scrollTop(),
          fieldPositions = uiHelpers.getFieldYCoordsAndHeights(fieldElem, parentArray);

      fieldElem.removeClass('nodecms-field_focused');
      clonedFieldElem = fieldElem.clone();
      fieldElem.attr('data-being-dragged', 'true');
      clonedFieldElem.addClass('nodecms-field_clone');
      clonedFieldElem.css('top', event.pageY + viewportOffset - 40);
      clonedFieldElem.appendTo('#fieldsListContainer');

      $('html').on('mousemove', function (event) {
        var mouseY = event.pageY,
            insertIndex = uiHelpers.getInsertIndex(mouseY, fieldPositions);

        if (fieldIndex !== insertIndex) {
          moveArrayEntry (parentArray, fieldIndex, insertIndex);
          fieldIndex = insertIndex;
        }

        clonedFieldElem.css('top', event.pageY + viewportOffset - 40);
        clonedFieldElem.addClass('nodecms-field_clone_moving');
      });

      $('html').on('mouseup', function (event) {
        $('html').off('mousemove mouseup');
        fieldElem.attr('data-being-dragged', 'false');

        clonedFieldElem.remove();
      });

    });

    fieldsListRactive.on('hideShowField', function (event) {
      var fieldElem = $(event.node).closest('.nodecms-field');

      if (fieldElem.hasClass('nodecms-field_minified')) {
        fieldElem.removeClass('nodecms-field_minified');
      } else {
        fieldElem.addClass('nodecms-field_minified');
      }

    });

    fieldsListRactive.on('openMenu', function (event) {
      var menu = $(event.node).find('.menu');

      if (menu.hasClass('hidden')) {
        menu.addClass('visible').removeClass('hidden');
      } else {
        menu.addClass('hidden').removeClass('visible');
      }

    });

    fieldsListRactive.on('makeField', function (event) {
      var fieldType = $(event.original.target).data('fieldType'),
          clonedData = _.cloneDeep(fieldsListRactive.get('fieldDefs')[fieldType]);

      fieldsListRactive.push(ractiveHelpers.getFieldsKeypath(event.keypath), clonedData);
    });

  }

  function addPartialsToRactive (partialsObject) {
    var partialName;
    
    for (partialName in partialsObject) {
      if (partialsObject.hasOwnProperty(partialName)) {
        Ractive.partials[partialName] = partialsObject[partialName];
      }
    }
  }  

  function getFieldsListPartial (fieldDefPartials) {
    var fieldsListPartial = '';

    fieldsListPartial += '{{#each fields}}';

    _.forOwn(fieldDefPartials, function (value, key) {

      fieldsListPartial += '{{#if (type === "' + key + '")}}';
      fieldsListPartial += '{{> ' + key + ' }}';
      fieldsListPartial += '{{/if}}';

    });

    fieldsListPartial += '{{/each}}';

    return fieldsListPartial;
  }

  function getAddFieldsPartial(fieldDefPartials) {
    var addFieldsPartial = '';

    addFieldsPartial += '<div class="ui icon buttons">';
    addFieldsPartial += '  <div tabindex="0" class="ui top left pointing dropdown button" on-click="openMenu">';
    addFieldsPartial += '    <i class="plus icon small"></i>';
    addFieldsPartial += '    <div style="" tabindex="-1" class="menu transition hidden">';

    _.forOwn(fieldDefPartials, function (value, key) {

      addFieldsPartial += '    <div class="item" on-click="makeField" data-field-type="' + key + '"><i class="angle right icon"></i>' + key + '</div>';

    });

    addFieldsPartial += '    </div>';
    addFieldsPartial += '  </div>';
    addFieldsPartial += '</div>';

    return addFieldsPartial;
  }

  function initApp () {

    jsonEndpoints.getFieldDefPartials(function (fieldDefPartials) {

      addPartialsToRactive(fieldDefPartials);
      addPartialsToRactive({
        'fieldsList': getFieldsListPartial(fieldDefPartials),
        'addFieldsMenu': getAddFieldsPartial(fieldDefPartials)
      });

      jsonEndpoints.getFieldDefSupportPartials(function (supportPartials) {
        addPartialsToRactive(supportPartials);

        initFieldsListRactive();
      });
      
    });

  }
  
  initApp();

})();

