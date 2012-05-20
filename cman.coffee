component = require('./component-core')

# CMan is a component manager, which really just provides a few helper
# functions that enable gcomponent below, which automagically makes objects made with
# it add themselves to relevant lookup structures, etc.
CMan =
  # Generates an initializer for objects which assigns itself an id and
  # registers itself to its lookup stuctures and applies the function sent in
  genInit: (func)->
    #TODO: replace with Function and unroll the if/loop? possible?
    init = (args...)->
      @id = CMan.genGUID()
      if @_lookup?
        for lookup in @_lookup
          if lookup instanceof Array
            lookup.push this
          else
            lookup[@id] = this
      if @_compInit?
        for c in @_compInit
          c.apply(this)
      func?.apply(this, args)
      return null
    init._generated = true
    return init

  #TODO finish!
  genRemove: (func)->
    remove = (args...)->
      if @_lookup?
        #TODO binary search tree or sorted array instead of plain array
        #     for faster removals - consider tradeoffs?
        for lookup, i in @_lookup
          if lookup instanceof Array
            newLookup = lookup.splice(0, lookup.length).filter (obj)=>
              obj.id != @id
            for obj in newLookup
              lookup.push(obj)
          else
            delete lookup[@id]
      func?.apply(this, args)

  #TODO: make this a real GUID function
  genGUID: ->
    Math.round(1000000*Math.random())


# Convenience function that will automatically apply the higher order
# procedures for us based on property names
gcomponent = (components...)->
  compInits = []
  lookups = []
  for c in components
    c = c.prototype ? c

    if c._lookup?
      for lookup in c._lookup
        lookups.push lookup unless lookup in lookups
    lookups.push(c.lookup) if c.lookup? && !(c.lookup in lookups)

    if c._compInit?
      for compInit in c._compInit
        compInits.push compInit unless compInit in compInits
    compInits.push(c.compInit) if c.compInit? && !(c.compInit in compInits)
   
    if c.init? && typeof c.init == 'function'
      init = if c.init._generated? then c.init else CMan.genInit(c.init)
    else if c.init?  && typeof c.init != 'function'
      throw new TypeError "'init' property should be a function, but got:\n#{c.init}"

    if c.remove? && typeof c.remove == 'function'
      remove = CMan.genRemove(c.remove) unless c.remove._generated?
    else if c.remove?  && typeof c.remove != 'function'
      throw new TypeError "'remove' property should be a function, but got:\n#{c.remove}"

  additions =
    _lookup: lookups
    _compInit: compInits
    init: init ? CMan.genInit()
    remove: remove ? CMan.genRemove()

  component(arguments.callee.baseObject, components..., additions)

gcomponent.baseObject = {}


if module?.exports?
  module.exports = gcomponent
