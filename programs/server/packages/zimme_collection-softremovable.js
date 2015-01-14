(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var CollectionBehaviours = Package['zimme:collection-behaviours'].CollectionBehaviours;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/zimme:collection-softremovable/softremovable.coffee.js                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var af, behaviour, c2, defaults, ss;

af = Package['aldeed:autoform'];

c2 = Package['aldeed:collection2'];

ss = Package['aldeed:simple-schema'];

defaults = {
  removed: 'removed',
  removedAt: 'removedAt',
  removedBy: 'removedBy',
  restoredAt: 'restoredAt',
  restoredBy: 'restoredBy'
};

behaviour = function(options) {
  var SimpleSchema, addAfDef, addC2Def, afDefinition, beforeFindHook, c2Definition, def, definition, isLocalCollection, removed, removedAt, removedBy, restoredAt, restoredBy, throwIfSelectorIsntId, _ref;
  if (options == null) {
    options = {};
  }
  _ref = _.defaults(options, this.options, defaults), removed = _ref.removed, removedAt = _ref.removedAt, removedBy = _ref.removedBy, restoredAt = _ref.restoredAt, restoredBy = _ref.restoredBy;
  if (ss != null) {
    SimpleSchema = ss.SimpleSchema;
    afDefinition = {
      autoform: {
        omit: true
      }
    };
    addAfDef = function(definition) {
      return _.extend(definition, afDefinition);
    };
    c2Definition = {
      denyInsert: true
    };
    addC2Def = function(definition) {
      return _.extend(definition, c2Definition);
    };
    definition = {};
    def = definition[removed] = {
      optional: true,
      type: Boolean
    };
    if (af != null) {
      addAfDef(def);
    }
    if (removedAt) {
      def = definition[removedAt] = {
        optional: true,
        type: Date
      };
      if (c2 != null) {
        addC2Def(def);
      }
      if (af != null) {
        addAfDef(def);
      }
    }
    if (removedBy) {
      def = definition[removedBy] = {
        optional: true,
        regEx: new RegExp("(" + SimpleSchema.RegEx.Id.source + ")|^0$"),
        type: String
      };
      if (c2 != null) {
        addC2Def(def);
      }
      if (af != null) {
        addAfDef(def);
      }
    }
    if (restoredAt) {
      def = definition[restoredAt] = {
        optional: true,
        type: Date
      };
      if (af != null) {
        addAfDef(def);
      }
      if (c2 != null) {
        addC2Def(def);
      }
    }
    if (restoredBy) {
      def = definition[restoredBy] = {
        optional: true,
        regEx: new RegExp("(" + SimpleSchema.RegEx.Id.source + ")|^0$"),
        type: String
      };
      if (af != null) {
        addAfDef(def);
      }
      if (c2 != null) {
        addC2Def(def);
      }
    }
    this.collection.attachSchema(new SimpleSchema(definition));
  }
  beforeFindHook = function(userId, selector, options) {
    var isSelectorId;
    if (userId == null) {
      userId = '0';
    }
    if (selector == null) {
      selector = {};
    }
    if (options == null) {
      options = {};
    }
    isSelectorId = _.isString(selector) || '_id' in selector;
    if (!(options.removed || isSelectorId || (selector[removed] != null))) {
      selector[removed] = {
        $exists: false
      };
    }
    this.args[0] = selector;
  };
  this.collection.before.find(beforeFindHook);
  this.collection.before.findOne(beforeFindHook);
  this.collection.before.update(function(userId, doc, fieldNames, modifier, options) {
    var $set, $unset;
    if (userId == null) {
      userId = '0';
    }
    $set = modifier.$set != null ? modifier.$set : modifier.$set = {};
    $unset = modifier.$unset != null ? modifier.$unset : modifier.$unset = {};
    if ($set[removed] && (doc[removed] != null)) {
      return false;
    }
    if ($unset[removed] && (doc[removed] == null)) {
      return false;
    }
    if ($set[removed] && (doc[removed] == null)) {
      $set[removed] = true;
      if (removedAt) {
        $set[removedAt] = new Date;
      }
      if (removedBy) {
        $set[removedBy] = userId;
      }
      if (restoredAt) {
        $unset[restoredAt] = true;
      }
      if (restoredBy) {
        $unset[restoredBy] = true;
      }
    }
    if ($unset[removed] && (doc[removed] != null)) {
      $unset[removed] = true;
      if (removedAt) {
        $unset[removedAt] = true;
      }
      if (removedBy) {
        $unset[removedBy] = true;
      }
      if (restoredAt) {
        $set[restoredAt] = new Date;
      }
      if (restoredBy) {
        return $set[restoredBy] = userId;
      }
    }
  });
  isLocalCollection = this.collection._connection === null;
  throwIfSelectorIsntId = function(selector, method) {
    if (!(_.isString(selector) || '_id' in selector)) {
      throw new Meteor.Error(403, 'Not permitted. Untrusted code may only ' + ("" + method + " documents by ID."));
    }
  };
  this.collection.softRemove = function(selector, callback) {
    var $set, modifier, ret;
    if (!selector) {
      return 0;
    }
    if (Meteor.isClient && !isLocalCollection) {
      throwIfSelectorIsntId(selector, 'softRemove');
    }
    modifier = {
      $set: $set = {}
    };
    $set[removed] = true;
    if (Meteor.isServer || isLocalCollection) {
      ret = this.update(selector, modifier, {
        multi: true
      }, callback);
    } else {
      ret = this.update(selector, modifier, callback);
    }
    if (ret === false) {
      return 0;
    } else {
      return ret;
    }
  };
  return this.collection.restore = function(selector, callback) {
    var $unset, modifier, ret;
    if (!selector) {
      return 0;
    }
    if (Meteor.isClient && !isLocalCollection) {
      throwIfSelectorIsntId(selector, 'restore');
    }
    modifier = {
      $unset: $unset = {}
    };
    $unset[removed] = true;
    if (Meteor.isServer || isLocalCollection) {
      selector[removed] = true;
      ret = this.update(selector, modifier, {
        multi: true
      }, callback);
    } else {
      ret = this.update(selector, modifier, callback);
    }
    if (ret === false) {
      return 0;
    } else {
      return ret;
    }
  };
};

CollectionBehaviours.define('softRemovable', behaviour);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['zimme:collection-softremovable'] = {};

})();

//# sourceMappingURL=zimme_collection-softremovable.js.map
