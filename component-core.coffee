ComponentBase = ->

ComponentBase::extend = (components...)->
  for c in components
    c = c.prototype if c.prototype?
    #^ makes `x=$C(a:1); y=$C(x,b:2)` work
    #^ maybe switch to `c = c.prototype if typeof c == 'function'`

    c.compSetup?.apply(this)
    delete c.compSetup
    #^ gives components "extend-time" access, useful for accumulators

    for key, val of c
      if  this[key]? &&
          typeof val == 'function' &&
          !(/extend|super|init/).test key
        old = this[key]
        this[key] = val
        this[key].super = old
      else
        this[key] = val

# use this by calling `@super()` in a component's function.
# the corresponding function that it overrode earlier will be called.
# note: you can't call @super() in an init function; see ComponentBase::extend
ComponentBase::super = ->
  @super.caller.super.apply(this, arguments)

$C = (components...)->
  comp = new ComponentBase
  comp.extend components...
  F = ->
    @init? arguments...
    return null
    #^ required because coffeescript returns whatever it can, which messes up
    #^ constructor functions
  F.prototype = comp
  F.extend = -> ComponentBase::extend.apply(F.prototype, arguments)
  #^ gives F the same extension interface as a `new Component()`
  return F

if module?.exports?
  module.exports = $C
