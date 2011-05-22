var $C, ComponentBase;
var __slice = Array.prototype.slice;
ComponentBase = function() {};
ComponentBase.prototype.extend = function() {
  var c, components, key, old, val, _i, _len, _results;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _results = [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    if (c.prototype != null) {
      c = c.prototype;
    }
    if (c.compSetup != null) {
      c.compSetup();
    }
    _results.push((function() {
      var _results2;
      _results2 = [];
      for (key in c) {
        val = c[key];
        _results2.push(this[key] ? (old = this[key], this[key] = val, this[key]["super"] = old) : key !== 'compSetup' ? this[key] = val : void 0);
      }
      return _results2;
    }).call(this));
  }
  return _results;
};
ComponentBase.prototype["super"] = function() {
  return this["super"].caller["super"].apply(this, arguments);
};
$C = function() {
  var F, comp, components;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  comp = new ComponentBase;
  comp.extend.apply(comp, components);
  F = function() {
    if (this.init != null) {
      this.init.apply(this, arguments);
    }
    return null;
  };
  F.prototype = comp;
  F.extend = function() {
    return ComponentBase.prototype.extend.apply(F.prototype, arguments);
  };
  return F;
};
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = $C;
}