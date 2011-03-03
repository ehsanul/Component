var $C, Component;
var __slice = Array.prototype.slice;
Component = function() {};
Component.prototype.extend = function() {
  var c, components, key, val, _i, _len, _results;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _results = [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    if (c.prototype != null) {
      c = c.prototype;
    }
    if (c.compSetup != null) {
      c.compSetup.apply(this);
    }
    _results.push((function() {
      var _results;
      _results = [];
      for (key in c) {
        val = c[key];
        _results.push(key !== 'compSetup' ? this[key] = val : void 0);
      }
      return _results;
    }).call(this));
  }
  return _results;
};
$C = function() {
  var F, comp, components;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  comp = new Component;
  comp.extend.apply(comp, components);
  F = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this.init != null) {
      this.init.apply(this, args);
    }
    return null;
  };
  F.prototype = comp;
  F.extend = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return Component.prototype.extend.apply(F.prototype, args);
  };
  return F;
};
if ((typeof module != "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = {
    Component: Component,
    $C: $C
  };
}