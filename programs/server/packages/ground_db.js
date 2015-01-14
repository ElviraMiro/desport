(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var _groundUtil = Package['ground:util']._groundUtil;
var Ground = Package['ground:util'].Ground;
var ServerTime = Package['ground:servertime'].ServerTime;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var OneTimeout = Package['raix:onetimeout'].OneTimeout;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var Log = Package.logging.Log;
var Tracker = Package.deps.Tracker;
var Deps = Package.deps.Deps;
var DDP = Package.livedata.DDP;
var DDPServer = Package.livedata.DDPServer;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var MiniMax = Package['ground:minimax'].MiniMax;
var Store = Package['ground:store'].Store;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Ground, GroundDB, _groundDbConstructor;

(function () {

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/ground:db/groundDB.server.js                                            //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
/*                                                                                  // 1
                                                                                    // 2
                                                                                    // 3
TODO:                                                                               // 4
  `Meteor.default_server` - `Meteor.server`                                         // 5
                                                                                    // 6
*/                                                                                  // 7
///////////////////////////////// TEST SCOPE ///////////////////////////////////    // 8
                                                                                    // 9
Meteor.server = Meteor.server || Meteor.default_server;                             // 10
                                                                                    // 11
//////////////////////////////// GROUND DATABASE ///////////////////////////////    // 12
                                                                                    // 13
_groundDbConstructor = function(collection, options) {                              // 14
  var self;                                                                         // 15
  // XXX: Write the grounddb constructor                                            // 16
                                                                                    // 17
                                                                                    // 18
  // // This is the basic interface allowing users easily access for handling       // 19
  // // method calls, this.super() is the super and this.collection is self         // 20
  // // TODO: Remove this section to the README                                     // 21
  // self.conflictHandlers = (options && options.conflictHandlers)?                 // 22
  //       options.conflictHandlers: {                                              // 23
  //   'insert': function(doc) {                                                    // 24
  //     //console.log('insert');                                                   // 25
  //     //console.log(doc);                                                        // 26
  //     this.super(doc);                                                           // 27
  //   },                                                                           // 28
  //   'update': function(id, modifier) {                                           // 29
  //     //console.log('update');                                                   // 30
  //     //console.log(id);                                                         // 31
  //     //console.log(modifier);                                                   // 32
  //     this.super(id, modifier);                                                  // 33
  //   },                                                                           // 34
  //   'remove': function(id) {                                                     // 35
  //     //console.log('remove');                                                   // 36
  //     //console.log(id);                                                         // 37
  //     this.super(id);                                                            // 38
  //   }                                                                            // 39
  // };                                                                             // 40
                                                                                    // 41
  // // Create overwrite interface                                                  // 42
  // _.each(['insert', 'update', 'remove'], function(name) {                        // 43
  //   // TODO: init default conflict handlers                                      // 44
  //   //self.conflictHandlers[name] = function() {                                 // 45
  //   //  this.super.apply(this, arguments);                                       // 46
  //   //};                                                                         // 47
                                                                                    // 48
  //   // Save super                                                                // 49
  //   var _super = Meteor.default_server.method_handlers['/'+self.name+'/'+name];  // 50
  //   // Overwrite                                                                 // 51
  //   Meteor.default_server.method_handlers['/'+self.name+'/'+name] = function() { // 52
  //     var _this = this;                                                          // 53
  //     _this.collection = self;                                                   // 54
  //     _this.super = _super;                                                      // 55
  //     // Call the conflicthandlers                                               // 56
  //     self.conflictHandlers[name].apply(_this, arguments);                       // 57
  //   };                                                                           // 58
  // });                                                                            // 59
                                                                                    // 60
  return self;                                                                      // 61
};                                                                                  // 62
                                                                                    // 63
                                                                                    // 64
// Global helper for applying grounddb on a collection                              // 65
Ground.Collection = function(name, options) {                                       // 66
  var self;                                                                         // 67
  // Inheritance Meteor Collection can be set by options.collection                 // 68
  // Accepts smart collections by Arunoda Susiripala                                // 69
  // Check if user used the "new" keyword                                           // 70
                                                                                    // 71
                                                                                    // 72
  // Make sure we got some options                                                  // 73
  options = options || {};                                                          // 74
                                                                                    // 75
  // Either name is a Meteor collection or we create a new Meteor collection        // 76
  if (name instanceof _groundUtil.Collection) {                                     // 77
    self = name;                                                                    // 78
  } else {                                                                          // 79
    self = new _groundUtil.Collection(name, options);                               // 80
  }                                                                                 // 81
                                                                                    // 82
  // Throw an error if something went wrong                                         // 83
  if (!(self instanceof _groundUtil.Collection))                                    // 84
    throw new Error('Ground.Collection expected a Mongo.Collection');               // 85
                                                                                    // 86
  // Add grounddb to the collection, circular reference since self is               // 87
  // grounddb.collection                                                            // 88
  self.grounddb = new _groundDbConstructor(self, options);                          // 89
                                                                                    // 90
  // Return grounded collection - We dont return this eg if it was an instance      // 91
  // of Ground.Collection                                                           // 92
  return self;                                                                      // 93
};                                                                                  // 94
                                                                                    // 95
////////////////////////// TIMESTAMP CONFLICTHANDLER ///////////////////////////    // 96
                                                                                    // 97
// TODO:                                                                            // 98
// When clients make changes the server should track the documents from the         // 99
// clients to see if the changes are new or old changes.                            // 100
// This could be done in several ways.                                              // 101
// Either by versions or server timestamps - both could work.                       // 102
//                                                                                  // 103
// Conflicting overview:                                                            // 104
// We could cut it down to comparing two documents and keep / broadcast the         // 105
// winning document.                                                                // 106
//                                                                                  // 107
// conflictHandler = function(clientDoc, serverDoc) { return serverDoc; }           // 108
//                                                                                  // 109
//                                                                                  // 110
// There should be found a way of registrating deleted documents - eg. by having    // 111
// a flag set 'active' all nonactive documents should then be removed from          // 112
// published documents.                                                             // 113
//                                                                                  // 114
// This could be a standalone package since it would introduce conflict             // 115
// handling in generel                                                              // 116
//                                                                                  // 117
// Regz. RaiX                                                                       // 118
                                                                                    // 119
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:db'] = {
  Ground: Ground,
  GroundDB: GroundDB
};

})();

//# sourceMappingURL=ground_db.js.map
