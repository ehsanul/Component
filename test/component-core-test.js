var $C, assert, vows;
vows = require('vows');
assert = require('assert');
$C = require('../component-core');
vows.describe('Component Core').addBatch({
  'A component object': {
    topic: new ($C()),
    'can be extended': function(obj) {
      obj.extend({
        x: 0
      });
      return assert.equal(obj.x, 0);
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
    'with multiple sub-objects': {
      topic: new ($C({
        a: function() {
          return 9;
        },
        x: 2,
        y: 2
      }, {
        a: function() {
          return 1 + this["super"]();
        },
        x: 1,
        z: 3
      })),
      'has properties from each': function(obj) {
        assert.equal(obj.y, 2);
        return assert.equal(obj.z, 3);
      },
      'overwrites repeated properties': function(obj) {
        return assert.equal(obj.x, 1);
      },
      'has a working @super': function(obj) {
        return assert.equal(obj.a(), 10);
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