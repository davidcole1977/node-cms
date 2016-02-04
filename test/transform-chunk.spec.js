var expect = require('chai').expect,
    module = require('../js-modules/chunk-transformer');
 
describe("ChunkTransformer", function() {

  var chunkTransformer = null,
      chunkDefData = null;

  chunkDefData = {
    "label": "Mortgage Product",
    "name": "aproductname",
    "type": "mortgageproduct",
    "fields": [
      {
        "label": "Initial rate",
        "id": "initialrate",
        "type": "text",
        "value": "0"
      },
      {
        "label": "Mortgage Type",
        "id": "type",
        "type": "multiselect",
        "options": [
          {
            "label": "First Time Buyer",
            "value": "ftb",
            "selected": "false"
          },
          {
            "label": "Remortgage",
            "value": "rm",
            "selected": "true"
          },
          {
            "label": "Buy To Let",
            "value": "btl",
            "selected": "false"
          }
        ]
      },
      {
        "label": "Rates",
        "id": "rates",
        "type": "group",
        "fields": [
          {
            "label": "One Year Rate",
            "id": "oneyearrate",
            "type": "text",
            "value": "5"
          },
          {
            "label": "Two Year Rate",
            "id": "twoyearrate",
            "type": "text",
            "value": "4"
          },
          {
            "label": "Three Year Rate",
            "id": "threeyearrate",
            "type": "text",
            "value": "3"
          },
          {
            "label": "Five Year Rate",
            "id": "fiveyearrate",
            "type": "text",
            "value": "2"
          }
        ]
      },
      {
        "label": "Product Features",
        "id": "features",
        "type": "multiselect",
        "options": [
          {
            "label": "Payment Holiday",
            "value": "Payment Holiday",
            "selected": "true"
          },
          {
            "label": "Overpayments",
            "value": "Overpayments",
            "selected": "true"
          },
          {
            "label": "Cash Back",
            "value": "Cash Back",
            "selected": "false"
          }
        ]
      },
      {
        "label": "Featured Mortgage",
        "id": "featuredmortgage",
        "type": "boolean",
        "selected": "false"
      }
    ]
  };

  alteredChunkDefData = {
    "label": "Mortgage Product",
    "name": "aproductname",
    "type": "mortgageproduct",
    "fields": [
      {
        "label": "Mortgage Type",
        "id": "type",
        "type": "multiselect",
        "options": [
          {
            "label": "A new option",
            "value": "ano",
            "selected": "false"
          },
          {
            "label": "Another new option",
            "value": "anno",
            "selected": "false"
          },
          {
            "label": "Yet another new option",
            "value": "yano",
            "selected": "false"
          },
          {
            "label": "Buy To Let",
            "value": "btl",
            "selected": true
          }
        ]
      },
      {
        "label": "Rates",
        "id": "rates",
        "type": "group",
        "fields": [
          {
            "label": "One Year Rate",
            "id": "oneyearrate",
            "type": "text",
            "value": "5"
          },
          {
            "label": "Two Year Rate",
            "id": "twoyearrate",
            "type": "text",
            "value": "4"
          },
          {
            "label": "Three Year Rate",
            "id": "threeyearrate",
            "type": "text",
            "value": "3"
          },
          {
            "label": "New Five Year Rate",
            "id": "newfiveyearrate",
            "type": "text",
            "value": "14"
          }
        ]
      },
      {
        "label": "Product Features",
        "id": "features",
        "type": "multiselect",
        "options": [
          {
            "label": "Payment Holiday",
            "value": "Payment Holiday",
            "selected": "true"
          },
          {
            "label": "Cash Back",
            "value": "Cash Back",
            "selected": "false"
          },
          {
            "label": "Another product feature",
            "value": "Another product feature",
            "selected": "false"
          }
        ]
      },
      {
        "label": "Mortgage of the day",
        "id": "mortgageoftheday",
        "type": "boolean",
        "selected": "false"
      },
      {
        "label": "A random field label",
        "id": "arandomfieldlabel",
        "type": "text",
        "value": "default value"
      }
    ]
  };

  beforeEach(function () {
    chunkTransformer = new module.ChunkTransformer();
  });

  it('should exist', function () {
    expect(typeof module.ChunkTransformer).to.equal('function');
  });

  describe("mapDefToChunk", function() {

    it('should exist', function () {
      expect(typeof chunkTransformer.mapDefToChunk).to.equal('function');
    });

    it('should correctly transform data in chunk definition form into chunk form', function () {
      var result = null,
          expectedResult = null;

      expectedResult = {
        "type": "mortgageproduct",
        "name": "aproductname",
        "label": "Mortgage Product",
        "data": {
          "initialrate": "0",
          "type": [
            "rm"
          ],
          "rates": {
            "oneyearrate": "5",
            "twoyearrate": "4",
            "threeyearrate": "3",
            "fiveyearrate": "2"
          },
          "features": [
            "Payment Holiday",
            "Overpayments"
          ],
          "featuredmortgage": "false"
        }
      };

      result = chunkTransformer.mapDefToChunk(chunkDefData);

      expect(result).to.deep.equal(expectedResult);

    })

  });

  describe("mapChunkToDef", function() {

    var chunkData = {
      "label": "Ten Year Fixed Rate",
      "name": "tenyearfixedrate",
      "type": "mortgageproduct",
      "data": {
        "initialrate": "20.4",
        "type": [
          "ftb",
          "btl"
        ],
        "rates": {
          "oneyearrate": "12",
          "twoyearrate": "4.12",
          "threeyearrate": "3.34",
          "fiveyearrate": "18"
        },
        "features": [
          "Cash Back"
        ],
        "featuredmortgage": true
      }
    };

    it('should exist', function () {
      expect(typeof chunkTransformer.mapDefToChunk).to.equal('function');
    });

    it('should correctly transform data from chunk form into chunk definition form', function () {
      var result = null,
          expectedResult = null;

      expectedResult = {
        "label": "Ten Year Fixed Rate",
        "name": "tenyearfixedrate",
        "type": "mortgageproduct",
        "fields": [
          {
            "label": "Initial rate",
            "id": "initialrate",
            "type": "text",
            "value": "20.4"
          },
          {
            "label": "Mortgage Type",
            "id": "type",
            "type": "multiselect",
            "options": [
              {
                "label": "First Time Buyer",
                "value": "ftb",
                "selected": true
              },
              {
                "label": "Remortgage",
                "value": "rm",
                "selected": false
              },
              {
                "label": "Buy To Let",
                "value": "btl",
                "selected": true
              }
            ]
          },
          {
            "label": "Rates",
            "id": "rates",
            "type": "group",
            "fields": [
              {
                "label": "One Year Rate",
                "id": "oneyearrate",
                "type": "text",
                "value": "12"
              },
              {
                "label": "Two Year Rate",
                "id": "twoyearrate",
                "type": "text",
                "value": "4.12"
              },
              {
                "label": "Three Year Rate",
                "id": "threeyearrate",
                "type": "text",
                "value": "3.34"
              },
              {
                "label": "Five Year Rate",
                "id": "fiveyearrate",
                "type": "text",
                "value": "18"
              }
            ]
          },
          {
            "label": "Product Features",
            "id": "features",
            "type": "multiselect",
            "options": [
              {
                "label": "Payment Holiday",
                "value": "Payment Holiday",
                "selected": false
              },
              {
                "label": "Overpayments",
                "value": "Overpayments",
                "selected": false
              },
              {
                "label": "Cash Back",
                "value": "Cash Back",
                "selected": true
              }
            ]
          },
          {
            "label": "Featured Mortgage",
            "id": "featuredmortgage",
            "type": "boolean",
            "selected": true
          }
        ]
      };

      result = chunkTransformer.mapChunkToDef(chunkDefData, chunkData);

      expect(result).to.deep.equal(expectedResult);

    });

    it('should correctly transform data from chunk form into chunk definition form when the chunk definition has changed since the chunk was created', function () {
      var result = null,
          expectedResult = null;

      expectedResult = {
        "label": "Ten Year Fixed Rate",
        "name": "tenyearfixedrate",
        "type": "mortgageproduct",
        "fields": [
          {
            "label": "Mortgage Type",
            "id": "type",
            "type": "multiselect",
            "options": [
              {
                "label": "A new option",
                "value": "ano",
                "selected": false
              },
              {
                "label": "Another new option",
                "value": "anno",
                "selected": false
              },
              {
                "label": "Yet another new option",
                "value": "yano",
                "selected": false
              },
              {
                "label": "Buy To Let",
                "value": "btl",
                "selected": true
              }
            ]
          },
          {
            "label": "Rates",
            "id": "rates",
            "type": "group",
            "fields": [
              {
                "label": "One Year Rate",
                "id": "oneyearrate",
                "type": "text",
                "value": "12"
              },
              {
                "label": "Two Year Rate",
                "id": "twoyearrate",
                "type": "text",
                "value": "4.12"
              },
              {
                "label": "Three Year Rate",
                "id": "threeyearrate",
                "type": "text",
                "value": "3.34"
              },
              {
                "label": "New Five Year Rate",
                "id": "newfiveyearrate",
                "type": "text",
                "value": "14"
              }
            ]
          },
          {
            "label": "Product Features",
            "id": "features",
            "type": "multiselect",
            "options": [
              {
                "label": "Payment Holiday",
                "value": "Payment Holiday",
                "selected": false
              },
              {
                "label": "Cash Back",
                "value": "Cash Back",
                "selected": true
              },
              {
                "label": "Another product feature",
                "value": "Another product feature",
                "selected": false
              }
            ]
          },
          {
            "label": "Mortgage of the day",
            "id": "mortgageoftheday",
            "type": "boolean",
            "selected": "false"
          },
          {
            "label": "A random field label",
            "id": "arandomfieldlabel",
            "type": "text",
            "value": "default value"
          }
        ]
      };

      result = chunkTransformer.mapChunkToDef(alteredChunkDefData, chunkData);

      expect(result).to.deep.equal(expectedResult);

    });

  });

});