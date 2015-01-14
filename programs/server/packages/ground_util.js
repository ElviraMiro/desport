(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Random = Package.random.Random;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var MiniMax = Package['ground:minimax'].MiniMax;
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
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var _groundUtil, Ground;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/ground:util/util.common.js                                                        //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
// Define the utillity scope                                                                  // 1
_groundUtil = {};                                                                             // 2
                                                                                              // 3
// New ground scope                                                                           // 4
Ground = {};                                                                                  // 5
                                                                                              // 6
// Meteor.Collection or Mongo.Collection                                                      // 7
_groundUtil.Collection = (typeof Mongo !== 'undefined')? Mongo.Collection: Meteor.Collection; // 8
                                                                                              // 9
                                                                                              // 10
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                            //
// packages/ground:util/util.server.js                                                        //
//                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                              //
// Define server specifics                                                                    // 1
                                                                                              // 2
////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:util'] = {
  _groundUtil: _groundUtil,
  Ground: Ground
};

})();

//# sourceMappingURL=ground_util.js.map
