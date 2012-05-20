var CMan, component, gcomponent;
var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
component = require('./component-core');
CMan = {
  genInit: function(func) {
    var init;
    init = function() {
      var args, c, lookup, _i, _j, _len, _len2, _ref, _ref2;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.id = CMan.genGUID();
      if (this._lookup != null) {
        _ref = this._lookup;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          lookup = _ref[_i];
          if (lookup instanceof Array) {
            lookup.push(this);
          } else {
            lookup[this.id] = this;
          }
        }
      }
      if (this._compInit != null) {
        _ref2 = this._compInit;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          c = _ref2[_j];
          c.apply(this);
        }
      }
      if (func != null) {
        func.apply(this, args);
      }
      return null;
    };
    init._generated = true;
    return init;
  },
  genRemove: function(func) {
    var remove;
    return remove = function() {
      var args, i, lookup, newLookup, obj, _i, _len, _len2, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this._lookup != null) {
        _ref = this._lookup;
        for (i = 0, _len = _ref.length; i < _len; i++) {
          lookup = _ref[i];
          if (lookup instanceof Array) {
            newLookup = lookup.splice(0, lookup.length).filter(__bind(function(obj) {
              return obj.id !== this.id;
            }, this));
            for (_i = 0, _len2 = newLookup.length; _i < _len2; _i++) {
              obj = newLookup[_i];
              lookup.push(obj);
            }
          } else {
            delete lookup[this.id];
          }
        }
      }
      return func != null ? func.apply(this, args) : void 0;
    };
  },
  genGUID: function() {
    return Math.round(1000000 * Math.random());
  }
};
gcomponent = function() {
  var additions, c, compInit, compInits, components, init, lookup, lookups, remove, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4, _ref5;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  compInits = [];
  lookups = [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    c = (_ref = c.prototype) != null ? _ref : c;
    if (c._lookup != null) {
      _ref2 = c._lookup;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        lookup = _ref2[_j];
        if (__indexOf.call(lookups, lookup) < 0) {
          lookups.push(lookup);
        }
      }
    }
    if ((c.lookup != null) && !(_ref3 = c.lookup, __indexOf.call(lookups, _ref3) >= 0)) {
      lookups.push(c.lookup);
    }
    if (c._compInit != null) {
      _ref4 = c._compInit;
      for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
        compInit = _ref4[_k];
        if (__indexOf.call(compInits, compInit) < 0) {
          compInits.push(compInit);
        }
      }
    }
    if ((c.compInit != null) && !(_ref5 = c.compInit, __indexOf.call(compInits, _ref5) >= 0)) {
      compInits.push(c.compInit);
    }
    if ((c.init != null) && typeof c.init === 'function') {
      init = c.init._generated != null ? c.init : CMan.genInit(c.init);
    } else if ((c.init != null) && typeof c.init !== 'function') {
      throw new TypeError("'init' property should be a function, but got:\n" + c.init);
    }
    if ((c.remove != null) && typeof c.remove === 'function') {
      if (c.remove._generated == null) {
        remove = CMan.genRemove(c.remove);
      }
    } else if ((c.remove != null) && typeof c.remove !== 'function') {
      throw new TypeError("'remove' property should be a function, but got:\n" + c.remove);
    }
  }
  additions = {
    _lookup: lookups,
    _compInit: compInits,
    init: init != null ? init : CMan.genInit(),
    remove: remove != null ? remove : CMan.genRemove()
  };
  return component.apply(null, [arguments.callee.baseObject].concat(__slice.call(components), [additions]));
};
gcomponent.baseObject = {};
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = gcomponent;
}