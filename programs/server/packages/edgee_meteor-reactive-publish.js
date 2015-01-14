(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Deps = Package['edgee:meteor-server-deps'].Deps;
var Accounts = Package['accounts-base'].Accounts;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/edgee:meteor-reactive-publish/lib/reactive-publish.coffee.js                       //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cursor, override, parent,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

override = function(obj, dict) {
  var key, result, _fn;
  result = {};
  _fn = function(key) {
    var impl, oldImpl;
    impl = dict[key];
    oldImpl = obj[key];
    obj[key] = impl;
    return result[key] = function() {
      var args2;
      args2 = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return oldImpl.call.apply(oldImpl, args2);
    };
  };
  for (key in dict) {
    _fn(key);
  }
  return result;
};

Cursor = Object.getPrototypeOf(Meteor.users.find({
  _id: null
})).constructor;

parent = override(Cursor.prototype, {
  observeChanges: function(callbacks) {
    var handle;
    handle = Deps.nonreactive((function(_this) {
      return function() {
        return parent.observeChanges(_this, callbacks);
      };
    })(this));
    if (Deps.active && this._cursorDescription.options.reactive) {
      Deps.onInvalidate(function() {
        return handle.stop();
      });
    }
    return handle;
  },
  _depend: function(changers) {
    var notifyChange, options, ready, v;
    if (Deps.active) {
      v = new Deps.Dependency;
      v.depend();
      ready = false;
      notifyChange = Meteor.bindEnvironment(function() {
        if (ready) {
          return v.changed();
        }
      });
      options = {};
      _.each(['added', 'changed', 'removed', 'addedBefore', 'movedBefore'], (function(_this) {
        return function(fnName) {
          if (changers[fnName]) {
            return options[fnName] = notifyChange;
          }
        };
      })(this));
      this.observeChanges(options);
      return ready = true;
    }
  },
  forEach: function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this._cursorDescription.options.reactive) {
      this._depend({
        added: true,
        changed: true,
        removed: true
      });
    }
    return parent.forEach.apply(parent, [this].concat(__slice.call(args)));
  },
  map: function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this._cursorDescription.options.reactive) {
      this._depend({
        added: true,
        changed: true,
        removed: true
      });
    }
    return parent.map.apply(parent, [this].concat(__slice.call(args)));
  },
  fetch: function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this._cursorDescription.options.reactive) {
      this._depend({
        added: true,
        changed: true,
        removed: true
      });
    }
    return parent.fetch.apply(parent, [this].concat(__slice.call(args)));
  },
  count: function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this._cursorDescription.options.reactive) {
      this._depend({
        added: true,
        removed: true
      });
    }
    return parent.count.apply(parent, [this].concat(__slice.call(args)));
  }
});

Meteor.reactivePublish = function(name, f) {
  return Meteor.publish(name, function() {
    var args, depends, handle, isPublishing, oldRecords;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    oldRecords = {};
    depends = [];
    isPublishing = false;
    handle = Deps.autorun((function(_this) {
      return function() {
        var addCursor, collectionName, cursor, id, newRecords, record, result, _i, _len;
        newRecords = {};
        addCursor = function(cursor) {
          var collectionName, oldRecord, record, _ref;
          if (cursor) {
            collectionName = cursor._cursorDescription.collectionName;
            record = {
              cursor: cursor,
              ids: {}
            };
            newRecords[collectionName] = record;
            oldRecord = (_ref = oldRecords[collectionName]) != null ? _ref : {
              ids: {}
            };
            return cursor.observeChanges({
              added: function(id, fields) {
                record.ids[id] = true;
                if (id in oldRecord.ids) {
                  return delete oldRecord.ids[id];
                } else {
                  return _this.added(collectionName, id, fields);
                }
              },
              removed: function(id) {
                if (__indexOf.call(_.keys(record.ids), id) >= 0) {
                  delete record.ids[id];
                  return _this.removed(collectionName, id);
                }
              },
              changed: function(id, fields) {
                return _this.changed(collectionName, id, fields);
              }
            });
          }
        };
        result = f.call.apply(f, [_this].concat(__slice.call(args)));
        if (_.isArray(result)) {
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            cursor = result[_i];
            addCursor(cursor);
          }
        } else {
          addCursor(result);
        }
        for (collectionName in oldRecords) {
          record = oldRecords[collectionName];
          for (id in record.ids) {
            _this.removed(collectionName, id);
          }
          record.ids = {};
        }
        return oldRecords = newRecords;
      };
    })(this));
    this.onStop((function(_this) {
      return function() {
        return handle.stop();
      };
    })(this));
    this.ready();
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['edgee:meteor-reactive-publish'] = {};

})();

//# sourceMappingURL=edgee_meteor-reactive-publish.js.map
