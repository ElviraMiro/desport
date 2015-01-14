(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var CollectionBehaviours = Package['zimme:collection-behaviours'].CollectionBehaviours;

/* Package-scope variables */
var __coffeescriptShare;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                              //
// packages/zimme:collection-timestampable/timestampable.coffee.js                              //
//                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var af, behaviour, c2, defaults, ss;

af = Package['aldeed:autoform'];

c2 = Package['aldeed:collection2'];

ss = Package['aldeed:simple-schema'];

defaults = {
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  updatedAt: 'updatedAt',
  updatedBy: 'updatedBy'
};

behaviour = function(options) {
  var SimpleSchema, addAfDefs, addC2Defs, afDefinition, c2Definition, createdAt, createdBy, def, definition, isLocalCollection, updatedAt, updatedBy, _ref;
  if (options == null) {
    options = {};
  }
  _ref = _.defaults(options, this.options, defaults), createdAt = _ref.createdAt, createdBy = _ref.createdBy, updatedAt = _ref.updatedAt, updatedBy = _ref.updatedBy;
  if (ss != null) {
    SimpleSchema = ss.SimpleSchema;
    afDefinition = {
      autoform: {
        omit: true
      }
    };
    addAfDefs = function(definition) {
      return _.extend(definition, afDefinition);
    };
    c2Definition = {
      denyInsert: true
    };
    addC2Defs = function(definition) {
      return _.extend(definition, c2Definition);
    };
    definition = {};
    if (createdAt) {
      def = definition[createdAt] = {
        optional: true,
        type: Date
      };
      if (af != null) {
        addAfDefs(def);
      }
    }
    if (createdBy) {
      def = definition[createdBy] = {
        optional: true,
        regEx: new RegExp("(" + SimpleSchema.RegEx.Id.source + ")|^0$"),
        type: String
      };
      if (af != null) {
        addAfDefs(def);
      }
    }
    if (updatedAt) {
      def = definition[updatedAt] = {
        optional: true,
        type: Date
      };
      if (af != null) {
        addAfDefs(def);
      }
      if (c2 != null) {
        addC2Defs(def);
      }
    }
    if (updatedBy) {
      def = definition[updatedBy] = {
        optional: true,
        regEx: new RegExp("(" + SimpleSchema.RegEx.Id.source + ")|^0$"),
        type: String
      };
      if (af != null) {
        addAfDefs(def);
      }
      if (c2 != null) {
        addC2Defs(def);
      }
    }
    this.collection.attachSchema(new SimpleSchema(definition));
  }
  isLocalCollection = this.collection._connection === null;
  if (Meteor.isServer || isLocalCollection) {
    this.collection.before.insert(function(userId, doc) {
      if (userId == null) {
        userId = '0';
      }
      if (createdAt) {
        doc[createdAt] = new Date;
      }
      if (createdBy && (doc[createdBy] == null)) {
        return doc[createdBy] = userId;
      }
    });
    return this.collection.before.update(function(userId, doc, fieldNames, modifier, options) {
      var $set;
      if (userId == null) {
        userId = '0';
      }
      $set = modifier.$set != null ? modifier.$set : modifier.$set = {};
      if (updatedAt) {
        $set[updatedAt] = new Date;
      }
      if (updatedBy && (doc[updatedBy] == null)) {
        return $set[updatedBy] = userId;
      }
    });
  }
};

CollectionBehaviours.define('timestampable', behaviour);
//////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['zimme:collection-timestampable'] = {};

})();

//# sourceMappingURL=zimme_collection-timestampable.js.map
