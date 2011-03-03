#TODO: tests!

Component = ->
Component::extend = (components...)->
    for c in components
      c = c.prototype if c.prototype?
      #^ makes `x=$C(a:1); y=$C(x,b:2)` work
      #^ maybe switch to `c = c.prototype if typeof c == 'function'`
      c.compSetup.apply(this) if c.compSetup?
      #^ gives components "extend-time" access, useful for accumulators
      for key, val of c
        this[key] = val unless key == 'compSetup'

$C = (components...)->
  comp = new Component
  comp.extend components...
  F = (args...)->
    @init(args...) if @init?
    return null
    #^ required because coffeescript returns whatever it can, which messes up
    #^ constructor functions
  F.prototype = comp
  F.extend = (args...)-> Component::extend.apply(F.prototype, args)
  #^ gives F the same extension interface as a `new Component`
  return F

if module?.exports?
  module.exports =
    Component: Component
    $C: $C
