var ComponentBase, component;
var __slice = Array.prototype.slice;
component = function() {
  var F, comp, components, _ref;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  comp = new ComponentBase;
  comp.extend.apply(comp, components);
  F = (_ref = comp.init) != null ? _ref : function() {};
  F.prototype = comp;
  F.extend = function() {
    return ComponentBase.prototype.extend.apply(F.prototype, arguments);
  };
  return F;
};
ComponentBase = function() {};
ComponentBase.prototype.extend = function() {
  var c, components, key, old, val, _i, _len, _ref;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    c = (_ref = c.prototype) != null ? _ref : c;
    for (key in c) {
      val = c[key];
      if (!c.hasOwnProperty(key)) {
        continue;
      }
      if (this[key] && typeof val === 'function' && !/extend|super/.test(key)) {
        old = this[key];
        this[key] = val;
        this[key]["super"] = old;
      } else {
        this[key] = val;
      }
    }
  }
  return null;
};
ComponentBase.prototype["super"] = function() {
  return this["super"].caller["super"].apply(this, arguments);
};
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = component;
}