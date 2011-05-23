var $G, assert, testArray, testArray2, testArray3, testObj, testObj2, vows;
vows = require('vows');
assert = require('assert');
$G = require('../').$G;
testArray = [1];
testArray2 = [2];
testArray3 = [3];
testObj = {
  'one': true
};
testObj2 = {
  'two': true
};
vows.describe('Component Extra').addBatch({
  'A pimped-out component object': {
    'acts like a normal one, so': {
      topic: new ($G()),
      'can be extended': function(obj) {
        obj.extend({
          omg: 'wth'
        });
        return assert.equal(obj.omg, 'wth');
      },
      'with init': {
        topic: new ($G({
          init: function() {
            return this.initx = 1;
          }
        })),
        'runs init': function(obj) {
          return assert.equal(obj.initx, 1);
        }
      },
      'with compSetup': {
        topic: new ($G({
          compSetup: function() {
            return this.compx = 1;
          }
        })),
        'runs compSetup': function(obj) {
          return assert.equal(obj.compx, 1);
        }
      },
      'with multiple sub-objects': {
        topic: new ($G({
          x: 2,
          y: 2
        }, {
          x: 1,
          z: 3
        })),
        'has properties from each': function(obj) {
          assert.equal(obj.y, 2);
          return assert.equal(obj.z, 3);
        },
        'overwrites properties which are repeated': function(obj) {
          return assert.equal(obj.x, 1);
        }
      },
      'built from a sub-component': {
        topic: new ($G($G({
          x: 1,
          y: 2
        }))),
        'inherits the sub-component\'s properties': function(obj) {
          assert.equal(obj.x, 1);
          return assert.equal(obj.y, 2);
        }
      }
    },
    'without init': {
      topic: {
        f: $G({
          init: function() {}
        })
      },
      'gets a generated init': function(obj) {
        return assert.isTrue(obj.f.prototype.init._generated);
      }
    },
    'with init': {
      topic: {
        f: $G({
          init: function() {
            return this.x = 1;
          }
        })
      },
      'gets a generated init': function(obj) {
        return assert.isTrue(obj.f.prototype.init._generated);
      }
    },
    'with compInit': {
      topic: new ($G({
        compInit: function() {
          return this.compInitx = 99;
        }
      })),
      'runs compInit': function(obj) {
        return assert.equal(obj.compInitx, 99);
      }
    },
    'with lookup array': {
      topic: new ($G({
        lookup: testArray,
        lookupx: 1
      })),
      'adds to lookup array': function(obj) {
        return assert.equal(obj, testArray.pop());
      }
    },
    'with multiple lookup arrays': {
      topic: new ($G({
        lookup: testArray2,
        lookupx: 1
      }, {
        lookup: testArray3
      })),
      'adds to all lookup arrays': function(obj) {
        assert.equal(obj, testArray2.pop());
        return assert.equal(obj, testArray3.pop());
      }
    },
    'with lookup object': {
      topic: new ($G({
        lookup: testObj,
        lookupx: 1
      })),
      'adds to lookup array': function(obj) {
        assert.equal(obj, testObj[obj.id]);
        return delete testObj[obj.id];
      }
    },
    'with multiple lookup objects': {
      topic: new ($G({
        lookup: testObj,
        lookupx: 1
      }, {
        lookup: testObj2
      })),
      'adds to all lookup objects': function(obj) {
        assert.equal(obj, testObj[obj.id]);
        assert.equal(obj, testObj2[obj.id]);
        delete testObj[obj.id];
        return delete testObj2[obj.id];
      }
    }
  }
})["export"](module);