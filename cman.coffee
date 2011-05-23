$C = require('./component-core')

# CMan is a component manager, which really just provides a few helper
# functions that enable $G below, which automagically makes objects made with
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
            lookup.push(this)
          else
            lookup[@id] = this
      if @_compInit?
        for c in @_compInit
          c.apply(this)
      func?.apply(this, args)
    init._generated = true
    return init

  #TODO: make this a real GUID function
  genGUID: ->
    Math.round(1000000*Math.random())

  ###
    Generates a function that will be run when a component is used to
    create other components. Now this function just adds to a list of lookup
    structures, accumulating them as multiple components call their own
    compSetup functions. This way, an object made of many components will
    have the full list of relevant lookup structures. Then genInit makes it
    automatically add itself to all relevant lookup structures.

    EDIT: it also accumulates compInit functions, which are run when an object
    which uses the corresponding components is created via the `new` keyword
  ###
  #TODO: DRY this up and don't assume lookupStructures are all arrays
  genCompSetup: (opts)->
    return ->
      if opts.lookup?
        if @_lookup?
          for l in opts.lookup
            # ignore repeated lookupStructures, in case components are repeated.
            # ie, push only if @_lookup doesn't already have it
            @_lookup.push(l) unless l in @_lookup #if @_lookup.indexOf(l) == -1
        else
          @_lookup = opts.lookup
      if opts.oldCompSetup?
        opts.oldCompSetup.apply(this)
      if opts.compInit?
        if @_compInit?
          for c in opts.compInit
            @_compInit.push(c) unless c in @_compInit #if @_compInit.indexOf(c) == -1
        else
          @_compInit = opts.compInit

# Convenience function that will automatically apply the higher order
# procedures for us based on property names
$G = (components...)->
  for c in components
    if c.lookup? || c._lookup? || c.compInit? || c._compInit?
      ###
        Normally, properties defined in multiple components are overwritten,
        with the latter components taking precendence, not accumulated.
        But we want accumulation in the case of component initialization
        when we have multiple components in one object. Hence this construct.
        If a lookup property exists, we use it to generate a compSetup
        function and delete the lookup property.

        The generated compSetup will add back the property in the context
        of the final object, but taking into account other lookups from
        other components and accumulating them in _lookup.
        The same is done for compInit, accumulated in _compInit.
        _lookup and _compinit are used in CMan.genInit
      ###
      lookup = c._lookup ? []
      lookup.push(c.lookup) if c.lookup?
      delete c.lookup
      delete c._lookup

      compInit = c._compInit ? []
      compInit.push(c.compInit) if c.compInit?
      delete c.compInit
      delete c._compInit

      oldCompSetup = c.compSetup
      delete c.compSetup

      c.compSetup = CMan.genCompSetup(
        lookup: lookup
        compInit: compInit
        oldCompSetup: oldCompSetup
      )
   
    if c.init? && typeof c.init == 'function'
      c.init = CMan.genInit(c.init) unless c.init._generated?
    else if c.init?  && typeof c.init != 'function'
      throw new TypeError "'init' property should be a function, but got:\n#{c.init}"
    else
      c.init = CMan.genInit()

  $C(arguments.callee.baseObject, components...)

$G.baseObject = {}

if module?.exports?
  module.exports = $G
