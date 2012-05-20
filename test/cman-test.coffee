#TODO:
# - baseObject test
# - multiple compInit test
# - inherited compInit test
# - multiple/inherited compInit/lookup test

vows = require('vows')
assert = require('assert')
$G = require('../').$G

testArray0 = [0]
testArray = [1]
testArray2 = [2]
testArray3 = [3]
testArray4 = [4]
testArray5 = [5]
testObj = {'one': true}
testObj2 = {'two': true}

vows.describe('Component Extra').addBatch(
  'with base object made with $G':
    'doesn\'t reference baseobject _lookup': ->
      $G.baseObject = $G(lookup: testObj)
      comp = $G(lookup: testArray)
      assert.notEqual($G.baseObject.prototype._lookup, comp.prototype._lookup)
      assert.equal(1, $G.baseObject.prototype._lookup.length)
      $G.baseObject = {} # cleanup

  'A pimped-out component object':
    'acts like a normal one, so':
      topic: new($G())
      'can be extended with a property': (obj)->
        obj.extend(omg: 'wth')
        assert.equal(obj.omg, 'wth')

      'can be extended with a function': (obj)->
        obj.extend(sup: -> return 1 + 8)
        assert.equal(obj.sup(), 9)

      'with init':
        topic: new($G init:-> @initx = 1)
        'runs init': (obj)->
          assert.equal(obj.initx, 1)

      'with multiple sub-objects':
        topic: new($G {x:2,y:2},{x:1,z:3})
        'has properties from each': (obj)->
          assert.equal(obj.y, 2)
          assert.equal(obj.z, 3)
        'overwrites properties which are repeated': (obj)->
          assert.equal(obj.x, 1)

      'built from a sub-component':
        topic: new($G $G(x:1, y: -> @x + 8))
        'inherits the sub-component\'s properties': (obj)->
          assert.equal(obj.x, 1)
          assert.equal(obj.y(), 9)

    'without init':
      topic: {f:$G(init:->)}
      'gets a generated init': (obj)->
        assert.isTrue(obj.f::init._generated)

    'with init':
      topic: {f:$G(init: -> @x = 1)}
      'gets a generated init': (obj)->
        assert.isTrue(obj.f::init._generated)

     'with compInit':
       topic: new($G compInit:-> @compInitx = 99)
       'runs compInit': (obj)->
         assert.equal(obj.compInitx, 99)
     'with multiple compInit':
       topic: new($G {compInit:-> @compInity = 88}, {compInit:-> @compInitz = 11})
       'runs all compInits': (obj)->
         assert.equal(obj.compInity, 88)
         assert.equal(obj.compInitz, 11)
     'with nested compInit':
       topic: new($G $G(compInit:-> @compInitx = 99))
       'runs compInit': (obj)->
         assert.equal(obj.compInitx, 99)
     'with multiple nested compInit':
       topic: new($G {compInit:-> @compInity = 88}, $G(compInit:-> @compInitz = 11))
       'runs all compInits': (obj)->
         assert.equal(obj.compInity, 88)
         assert.equal(obj.compInitz, 11)

     'with lookup array':
       topic: new($G lookup: testArray0, lookupx: 1)
       'adds to lookup array': (obj)->
         assert.equal(obj, testArray0[testArray0.length-1])
       "can remove itself from the lookup array": (obj)->
         obj.remove()
         assert.notEqual(obj, testArray0[testArray0.length-1])

     'with nested lookup array':
       topic: new($G $G(lookup: testArray))
       'adds to lookup array': (obj)->
         assert.equal(obj, testArray[testArray.length-1])
       "can remove itself from the lookup array": (obj)->
         obj.remove()
         assert.notEqual(obj, testArray[testArray.length-1])

     'with multiple lookup arrays':
       topic: new($G {lookup: testArray2, lookupx:1}, {lookup: testArray3})
       'adds to all lookup arrays': (obj)->
         assert.equal(obj, testArray2[testArray2.length-1])
         assert.equal(obj, testArray3[testArray3.length-1])
       "can remove itself from all lookup arrays": (obj)->
         obj.remove()
         assert.notEqual(obj, testArray2[testArray2.length-1])
         assert.notEqual(obj, testArray3[testArray3.length-1])

     'with multiple nested lookup arrays':
       topic: new($G {lookup: testArray4, lookupx:1}, $G(lookup: testArray5))
       'adds to all lookup arrays': (obj)->
         assert.equal(obj, testArray4[testArray4.length-1])
         assert.equal(obj, testArray5[testArray5.length-1])
       "can remove itself from all lookup arrays": (obj)->
         obj.remove()
         assert.notEqual(obj, testArray4[testArray4.length-1])
         assert.notEqual(obj, testArray5[testArray5.length-1])

     'with lookup object':
       topic: new($G lookup: testObj, lookupx: 1)
       'adds to lookup array': (obj)->
         assert.equal(obj, testObj[obj.id])
       'can remove itself from the lookup object': (obj)->
         assert.isNotNull(testObj[obj.id])
         obj.remove()
         assert.isUndefined(testObj[obj.id])

     'with multiple lookup objects':
       topic: new($G {lookup: testObj, lookupx: 1},{lookup: testObj2})
       'adds to all lookup objects': (obj)->
         assert.equal(obj, testObj[obj.id])
         assert.equal(obj, testObj2[obj.id])
       'can remove itself from all lookup objects': (obj)->
         assert.isNotNull(testObj[obj.id])
         assert.isNotNull(testObj2[obj.id])
         obj.remove()
         assert.isUndefined(testObj[obj.id])
         assert.isUndefined(testObj2[obj.id])

).export(module)


