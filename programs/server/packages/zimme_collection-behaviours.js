(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;

/* Package-scope variables */
var CollectionBehaviours, __coffeescriptShare;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/zimme:collection-behaviours/collection-behaviour.coffee.js                         //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var attach, behaviourOptions, behaviours,                      
  __slice = [].slice;

behaviours = {};

behaviourOptions = {};

share.attach = attach = function() {
  var args, behaviour, context, options;
  behaviour = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (_.isString(behaviour)) {
    options = behaviourOptions[behaviour];
    behaviour = behaviours[behaviour];
  }
  if (_.isFunction(behaviour)) {
    context = {
      collection: this,
      options: options
    };
    behaviour.apply(context, args);
  } else {
    console.warn('Behaviour not found');
  }
};

CollectionBehaviours = (function() {
  function CollectionBehaviours() {}

  CollectionBehaviours.attach = function() {
    var args, collection;
    collection = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return attach.apply(collection, args);
  };

  CollectionBehaviours.configure = function(name, options) {
    if (name in behaviours) {
      return behaviourOptions[name] = options;
    } else {
      return console.warn('Configure failed, behaviour not found');
    }
  };

  CollectionBehaviours.define = function(name, behaviour, options) {
    if (name in behaviours && !(options != null ? options.replace : void 0)) {
      return console.warn('Behaviour already defined, use replace option to override');
    } else {
      return behaviours[name] = behaviour;
    }
  };

  return CollectionBehaviours;

})();
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                             //
// packages/zimme:collection-behaviours/mongo.coffee.js                                        //
//                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                               //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var attach;

attach = share.attach;

Mongo.Collection.prototype.attachBehaviour = function() {
  return attach.apply(this, arguments);
};
/////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['zimme:collection-behaviours'] = {
  CollectionBehaviours: CollectionBehaviours
};

})();

//# sourceMappingURL=zimme_collection-behaviours.js.map
