(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;

/* Package-scope variables */
var Deps, __coffeescriptShare;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/edgee:meteor-server-deps/lib/server-deps.coffee.js                                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var afterFlushCallbacks, nextId, privateObj, queue,      
  __slice = [].slice;

privateObj = {};

nextId = 1;

afterFlushCallbacks = [];

queue = new Meteor._SynchronousQueue();

Deps = _.extend(Tracker, {
  currentComputationVar: new Meteor.EnvironmentVariable(),
  flush: function() {
    if (!queue.safeToRunTask()) {
      throw new Error("Can't call Deps.flush while flushing, or inside Deps.autorun");
    }
    return queue.drain();
  },
  _postRun: function() {
    var e, f, _results;
    _results = [];
    while ((queue._taskHandles.length === 0) && (afterFlushCallbacks.length > 0)) {
      f = afterFlushCallbacks.shift();
      try {
        _results.push(f());
      } catch (_error) {
        e = _error;
        _results.push(console.log("Exception from Deps afterFlush function:", e.stack || e.message));
      }
    }
    return _results;
  },
  autorun: function(f) {
    var c;
    c = new Deps.Computation(f, Deps.currentComputation, privateObj);
    if (Deps.active) {
      Deps.onInvalidate(function() {
        return c.stop();
      });
    }
    return c;
  },
  nonreactive: function(f) {
    return Deps.currentComputationVar.withValue(null, f);
  },
  _makeNonreactive: function(f) {
    var result;
    if (f.$isNonreactive) {
      return f;
    }
    result = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Deps.nonreactive((function(_this) {
        return function() {
          return f.apply(_this, args);
        };
      })(this));
    };
    result.$isNonreactive = true;
    return result;
  },
  onInvalidate: function(f) {
    if (!Deps.active) {
      throw new Error("Deps.onInvalidate requires a currentComputation");
    }
    return Deps.currentComputation.onInvalidate(f);
  },
  afterFlush: function(f) {
    return afterFlushCallbacks.push(f);
  }
});

Object.defineProperties(Deps, {
  currentComputation: {
    get: function() {
      return Deps.currentComputationVar.get();
    }
  },
  active: {
    get: function() {
      return !!Deps.currentComputationVar.get();
    }
  }
});

Deps.Computation = (function() {
  function Computation(f, _parent, p) {
    var errored;
    this._parent = _parent;
    if (p !== privateObj) {
      throw new Error("Deps.Computation constructor is private; use Deps.autorun");
    }
    this.stopped = false;
    this.invalidated = false;
    this.firstRun = true;
    this._id = nextId++;
    this._onInvalidateCallbacks = [];
    this._recomputing = false;
    Deps.currentComputationVar.withValue(this, (function(_this) {
      return function() {
        return _this._func = Meteor.bindEnvironment(f, null, _this);
      };
    })(this));
    errored = true;
    try {
      this._compute();
      errored = false;
    } finally {
      this.firstRun = false;
      if (errored) {
        this.stop();
      }
    }
  }

  Computation.prototype.onInvalidate = function(f) {
    if (typeof f !== "function") {
      throw new Error("onInvalidate requires a function");
    }
    f = Deps._makeNonreactive(Meteor.bindEnvironment(f, null, this));
    if (this.invalidated) {
      return f();
    } else {
      return this._onInvalidateCallbacks.push(f);
    }
  };

  Computation.prototype.invalidate = function() {
    var callback, _i, _len, _ref;
    if (!this.invalidated) {
      if (!this._recomputing && !this.stopped) {
        queue.queueTask((function(_this) {
          return function() {
            _this._recompute();
            return Deps._postRun();
          };
        })(this));
      }
      this.invalidated = true;
      _ref = this._onInvalidateCallbacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback();
      }
      return this._onInvalidateCallbacks = [];
    }
  };

  Computation.prototype.stop = function() {
    if (!this.stopped) {
      this.stopped = true;
      return this.invalidate();
    }
  };

  Computation.prototype._compute = function() {
    this.invalidated = false;
    return this._func(this);
  };

  Computation.prototype._recompute = function() {
    var e;
    this._recomputing = true;
    while (this.invalidated && !this.stopped) {
      try {
        this._compute();
      } catch (_error) {
        e = _error;
        console.log(e);
      }
    }
    return this._recomputing = false;
  };

  return Computation;

})();

Deps.Dependency = (function() {
  function Dependency() {
    this._dependentsById = {};
  }

  Dependency.prototype.depend = function(computation) {
    var id;
    if (computation == null) {
      computation = Deps.currentComputation;
    }
    if (!computation) {
      return false;
    }
    id = computation._id;
    if (!(id in this._dependentsById)) {
      this._dependentsById[id] = computation;
      computation.onInvalidate((function(_this) {
        return function() {
          return delete _this._dependentsById[id];
        };
      })(this));
      return true;
    }
    return false;
  };

  Dependency.prototype.changed = function() {
    var computation, id, _ref, _results;
    _ref = this._dependentsById;
    _results = [];
    for (id in _ref) {
      computation = _ref[id];
      _results.push(computation.invalidate());
    }
    return _results;
  };

  Dependency.prototype.hasDependents = function() {
    var computation, id, _ref;
    _ref = this._dependentsById;
    for (id in _ref) {
      computation = _ref[id];
      return true;
    }
    return false;
  };

  return Dependency;

})();
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['edgee:meteor-server-deps'] = {
  Deps: Deps
};

})();

//# sourceMappingURL=edgee_meteor-server-deps.js.map
