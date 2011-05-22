var $G, assert, vows;
vows = require('vows');
assert = require('assert');
$G = require('../').$G;
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
    }
  }
})["export"](module);