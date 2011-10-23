var $C, ComponentBase;
var __slice = Array.prototype.slice;
ComponentBase = function() {};
ComponentBase.prototype.extend = function() {
  var c, components, key, old, val, _i, _len, _ref, _ref2, _results;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  _results = [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    c = (_ref = c.prototype) != null ? _ref : c;
    if ((_ref2 = c.compSetup) != null) {
      _ref2.apply(this);
    }
    delete c.compSetup;
    _results.push((function() {
      var _results2;
      _results2 = [];
      for (key in c) {
        val = c[key];
        if (!c.hasOwnProperty(key)) {
          continue;
        }
        _results2.push(typeof val === 'function' && !/extend|super/.test(key) ? (old = this[key], this[key] = val, this[key]["super"] = old) : this[key] = val);
      }
      return _results2;
    }).call(this));
  }
  return _results;
};
ComponentBase.prototype["super"] = function() {
  return this["super"].caller["super"].apply(this, arguments);
};
component = function() {
  var F, comp, components, _ref;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  comp = new ComponentBase;
  comp.extend.apply(comp, components);
  F = (_ref = comp.init) != null ? _ref : function() {};
  F.prototype = comp;
  F.extend = function() {
    return ComponentBase.prototype.extend.apply(F, arguments);
  };
  return F;
};
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = component;
}