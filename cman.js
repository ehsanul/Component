var $C, $G, CMan;
var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
$C = require('./component-core');
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
      return func != null ? func.apply(this, args) : void 0;
    };
    init._generated = true;
    return init;
  },
  genRemove: function(func) {
    var remove;
    return remove = function() {
      var args, i, lookup, obj, _i, _len, _len2, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this._lookup != null) {
        _ref = this._lookup;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          lookup = _ref[_i];
          if (lookup instanceof Array) {
            console.log('');
            for (i = 0, _len2 = lookup.length; i < _len2; i++) {
              obj = lookup[i];
              if (obj.id === this.id) {
                lookup[i] = null;
              }
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
  },
  /*
      Generates a function that will be run when a component is used to
      create other components. Now this function just adds to a list of lookup
      structures, accumulating them as multiple components call their own
      compSetup functions. This way, an object made of many components will
      have the full list of relevant lookup structures. Then genInit makes it
      automatically add itself to all relevant lookup structures.
  
      EDIT: it also accumulates compInit functions, which are run when an object
      which uses the corresponding components is created via the `new` keyword
    */
  genCompSetup: function(opts) {
    return function() {
      var c, l, _i, _j, _len, _len2, _ref, _ref2, _results;
      if (opts.lookup != null) {
        if (this._lookup != null) {
          _ref = opts.lookup;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
            if (__indexOf.call(this._lookup, l) < 0) {
              this._lookup.push(l);
            }
          }
        } else {
          this._lookup = opts.lookup;
        }
      }
      if (opts.oldCompSetup != null) {
        opts.oldCompSetup.apply(this);
      }
      if (opts.compInit != null) {
        if (this._compInit != null) {
          _ref2 = opts.compInit;
          _results = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            c = _ref2[_j];
            _results.push(__indexOf.call(this._compInit, c) < 0 ? this._compInit.push(c) : void 0);
          }
          return _results;
        } else {
          return this._compInit = opts.compInit;
        }
      }
    };
  }
};
$G = function() {
  var c, compInit, components, lookup, oldCompSetup, _i, _len, _ref, _ref2;
  components = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  for (_i = 0, _len = components.length; _i < _len; _i++) {
    c = components[_i];
    if ((c.lookup != null) || (c._lookup != null) || (c.compInit != null) || (c._compInit != null)) {
      /*
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
            */
      lookup = (_ref = c._lookup) != null ? _ref : [];
      if (c.lookup != null) {
        lookup.push(c.lookup);
      }
      delete c.lookup;
      delete c._lookup;
      compInit = (_ref2 = c._compInit) != null ? _ref2 : [];
      if (c.compInit != null) {
        compInit.push(c.compInit);
      }
      delete c.compInit;
      delete c._compInit;
      oldCompSetup = c.compSetup;
      delete c.compSetup;
      c.compSetup = CMan.genCompSetup({
        lookup: lookup,
        compInit: compInit,
        oldCompSetup: oldCompSetup
      });
    }
    if ((c.init != null) && typeof c.init === 'function') {
      if (c.init._generated == null) {
        c.init = CMan.genInit(c.init);
      }
    } else if ((c.init != null) && typeof c.init !== 'function') {
      throw new TypeError("'init' property should be a function, but got:\n" + c.init);
    } else {
      c.init = CMan.genInit();
    }
    if ((c.remove != null) && typeof c.remove === 'function') {
      if (c.remove._generated == null) {
        c.remove = CMan.genRemove(c.remove);
      }
    } else if ((c.remove != null) && typeof c.remove !== 'function') {
      throw new TypeError("'remove' property should be a function, but got:\n" + c.remove);
    } else {
      c.remove = CMan.genRemove();
    }
  }
  return $C.apply(null, [arguments.callee.baseObject].concat(__slice.call(components)));
};
$G.baseObject = {};
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
  module.exports = $G;
}