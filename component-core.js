var ComponentBase, component;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
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
ComponentBase = function() {};
ComponentBase.prototype.extend = function() {
  var c, components, key, old, v, val, _i, _j, _len, _len2, _ref, _ref2;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    c = (_ref = c.prototype) != null ? _ref : c;
    if ((_ref2 = c.compSetup) != null) {
      _ref2.apply(this);
    }
    delete c.compSetup;
    for (key in c) {
      val = c[key];
      if (!c.hasOwnProperty(key)) {
        continue;
      }
      if (this[key] && typeof val === 'function' && !/extend|super/.test(key)) {
        old = this[key];
        this[key] = val;
        this[key]["super"] = old;
      } else if (val instanceof Array) {
        if (this[key] != null) {
          for (_j = 0, _len2 = val.length; _j < _len2; _j++) {
            v = val[_j];
            if (__indexOf.call(this[key], v) < 0) {
              this[key].push(v);
            }
          }
        } else {
          this[key] = val.slice(0);
        }
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