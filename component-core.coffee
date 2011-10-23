ComponentBase = ->

ComponentBase::extend = (components...)->
  for c in components
    # Allows extension  using both object literals and other components.
    # Like this: `x = component(a:1); y = component(x, b:2)`
    c = c.prototype ? c

    # Give components "extend-time" access, useful for accumulators etc.
    # However, it's much simpler to just make a wrapper around `component`
    c.compSetup?.apply(this)
    delete c.compSetup

    for key, val of c
      continue unless c.hasOwnProperty key
      if typeof val is 'function' and not /extend|super/.test key
        old = this[key]
        this[key] = val
        this[key].super = old
      else
        this[key] = val


# Use this by calling `@super(arg1,arg2)` in a component's function.
# The corresponding function that it overrode earlier will be called.
ComponentBase::super = ->
  @super.caller.super.apply(this, arguments)

$C = (components...)->
  comp = new ComponentBase
  comp.extend components...

  # This constructor function is returned as the component, ensuring that
  # object instantiation from the component is fast via `new`.
  F = comp.init ? ->
  F.prototype = comp

  # give F the same extension interface as a `new MyComponent()`
  F.extend = -> ComponentBase::extend.apply(F, arguments)
  return F

if module?.exports?
  module.exports = $C
