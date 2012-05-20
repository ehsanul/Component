var $G, assert, testArray, testArray0, testArray2, testArray3, testArray4, testArray5, testObj, testObj2, vows;
vows = require('vows');
assert = require('assert');
$G = require('../').$G;
testArray0 = [0];
testArray = [1];
testArray2 = [2];
testArray3 = [3];
testArray4 = [4];
testArray5 = [5];
testObj = {
  'one': true
};
testObj2 = {
  'two': true
};
vows.describe('Component Extra').addBatch({
  'with base object made with $G': {
    'doesn\'t reference baseobject _lookup': function() {
      var comp;
      $G.baseObject = $G({
        lookup: testObj
      });
      comp = $G({
        lookup: testArray
      });
      assert.notEqual($G.baseObject.prototype._lookup, comp.prototype._lookup);
      assert.equal(1, $G.baseObject.prototype._lookup.length);
      return $G.baseObject = {};
    }
  },
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
    'with multiple compInit': {
      topic: new ($G({
        compInit: function() {
          return this.compInity = 88;
        }
      }, {
        compInit: function() {
          return this.compInitz = 11;
        }
      })),
      'runs all compInits': function(obj) {
        assert.equal(obj.compInity, 88);
        return assert.equal(obj.compInitz, 11);
      }
    },
    'with nested compInit': {
      topic: new ($G($G({
        compInit: function() {
          return this.compInitx = 99;
        }
      }))),
      'runs compInit': function(obj) {
        return assert.equal(obj.compInitx, 99);
      }
    },
    'with multiple nested compInit': {
      topic: new ($G({
        compInit: function() {
          return this.compInity = 88;
        }
      }, $G({
        compInit: function() {
          return this.compInitz = 11;
        }
      }))),
      'runs all compInits': function(obj) {
        assert.equal(obj.compInity, 88);
        return assert.equal(obj.compInitz, 11);
      }
    },
    'with lookup array': {
      topic: new ($G({
        lookup: testArray0,
        lookupx: 1
      })),
      'adds to lookup array': function(obj) {
        return assert.equal(obj, testArray0[testArray0.length - 1]);
      },
      "can remove itself from the lookup array": function(obj) {
        obj.remove();
        return assert.notEqual(obj, testArray0[testArray0.length - 1]);
      }
    },
    'with nested lookup array': {
      topic: new ($G($G({
        lookup: testArray
      }))),
      'adds to lookup array': function(obj) {
        return assert.equal(obj, testArray[testArray.length - 1]);
      },
      "can remove itself from the lookup array": function(obj) {
        obj.remove();
        return assert.notEqual(obj, testArray[testArray.length - 1]);
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
        assert.equal(obj, testArray2[testArray2.length - 1]);
        return assert.equal(obj, testArray3[testArray3.length - 1]);
      },
      "can remove itself from all lookup arrays": function(obj) {
        obj.remove();
        assert.notEqual(obj, testArray2[testArray2.length - 1]);
        return assert.notEqual(obj, testArray3[testArray3.length - 1]);
      }
    },
    'with multiple nested lookup arrays': {
      topic: new ($G({
        lookup: testArray4,
        lookupx: 1
      }, $G({
        lookup: testArray5
      }))),
      'adds to all lookup arrays': function(obj) {
        assert.equal(obj, testArray4[testArray4.length - 1]);
        return assert.equal(obj, testArray5[testArray5.length - 1]);
      },
      "can remove itself from all lookup arrays": function(obj) {
        obj.remove();
        assert.notEqual(obj, testArray4[testArray4.length - 1]);
        return assert.notEqual(obj, testArray5[testArray5.length - 1]);
      }
    },
    'with lookup object': {
      topic: new ($G({
        lookup: testObj,
        lookupx: 1
      })),
      'adds to lookup array': function(obj) {
        return assert.equal(obj, testObj[obj.id]);
      },
      'can remove itself from the lookup object': function(obj) {
        assert.isNotNull(testObj[obj.id]);
        obj.remove();
        return assert.isUndefined(testObj[obj.id]);
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
        return assert.equal(obj, testObj2[obj.id]);
      },
      'can remove itself from all lookup objects': function(obj) {
        assert.isNotNull(testObj[obj.id]);
        assert.isNotNull(testObj2[obj.id]);
        obj.remove();
        assert.isUndefined(testObj[obj.id]);
        return assert.isUndefined(testObj2[obj.id]);
      }
    }
  }
})["export"](module);