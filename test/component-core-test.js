var $C, assert, vows;
vows = require('vows');
assert = require('assert');
$C = require('../').$C;
vows.describe('Component Core').addBatch({
  'A component object': {
    topic: new ($C()),
    'can be extended': function(obj) {
      obj.extend({
        omg: 'wth'
      });
      return assert.equal(obj.omg, 'wth');
    },
    'with init': {
      topic: new ($C({
        init: function() {
          return this.initx = 1;
        }
      })),
      'runs init': function(obj) {
        return assert.equal(obj.initx, 1);
      }
    },
    'with compSetup': {
      topic: new ($C({
        compSetup: function() {
          return this.compx = 1;
        }
      })),
      'runs compSetup': function(obj) {
        return assert.equal(obj.compx, 1);
      }
    },
    'with multiple sub-objects': {
      topic: new ($C({
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
      topic: new ($C($C({
        x: 1,
        y: 2
      }))),
      'inherits the sub-component\'s properties': function(obj) {
        assert.equal(obj.x, 1);
        return assert.equal(obj.y, 2);
      }
    }
  }
})["export"](module);