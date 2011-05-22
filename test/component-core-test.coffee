#TODO super tests

vows = require('vows')
assert = require('assert')
$C = require('../').$C

vows.describe('Component Core').addBatch(

  'A component object':

    topic: new($C())
    'can be extended': (obj)->
      obj.extend(omg: 'wth')
      assert.equal(obj.omg, 'wth')

    'with init':
      topic: new($C init:-> @initx = 1)
      'runs init': (obj)->
        assert.equal(obj.initx, 1)

    'with compSetup':
      topic: new($C compSetup:-> @compx = 1)
      'runs compSetup': (obj)->
        assert.equal(obj.compx, 1)

    'with multiple sub-objects':
      topic: new($C {x:2,y:2},{x:1,z:3})
      'has properties from each': (obj)->
        assert.equal(obj.y, 2)
        assert.equal(obj.z, 3)
      'overwrites properties which are repeated': (obj)->
        assert.equal(obj.x, 1)

    'built from a sub-component':
      topic: new($C $C(x:1, y:2))
      'inherits the sub-component\'s properties': (obj)->
        assert.equal(obj.x, 1)
        assert.equal(obj.y, 2)

).export(module)
