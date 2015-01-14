(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;

/* Package-scope variables */
var _DDP;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/raix:stubfence/util.js                                               //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
_DDP = Package['ddp'].LivedataTest;                                              // 1
                                                                                 // 2
if (!_DDP)                                                                       // 3
  throw new Error('Arg! Meteor just broke raix:stubfence! Please report to @raix at github, and he will work his butt off trying to fix this');
///////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/raix:stubfence/nostub.js                                             //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
var inFence = 0;                                                                 // 1
                                                                                 // 2
_DDP.Connection.prototype.stubFence = function(names, f) {                       // 3
  var self = this;                                                               // 4
                                                                                 // 5
  if (++inFence !== 1) {                                                         // 6
    inFence--;                                                                   // 7
    throw new Error('stubFence cannot lock since another stubFence is running'); // 8
  }                                                                              // 9
                                                                                 // 10
  // Take string or array of string                                              // 11
  if (names === ''+names) names = [names];                                       // 12
                                                                                 // 13
  // Carrier for super of methods                                                // 14
  var supers = {};                                                               // 15
                                                                                 // 16
  // Store supers                                                                // 17
  _.each(names, function(name) {                                                 // 18
                                                                                 // 19
    // Check that the method exists                                              // 20
    if (self._methodHandlers[name]) {                                            // 21
      supers[name] = self._methodHandlers[name];                                 // 22
    } else {                                                                     // 23
      throw new Error('stubFence could not find method "' + name + '"');         // 24
    }                                                                            // 25
                                                                                 // 26
  });                                                                            // 27
                                                                                 // 28
  // Check that we got any supers to stubFence                                   // 29
  if (names.length) {                                                            // 30
                                                                                 // 31
    // Remove the stub                                                           // 32
    _.each(supers, function(f, name) {                                           // 33
      self._methodHandlers[name] = null;                                         // 34
    });                                                                          // 35
                                                                                 // 36
    // Run the code                                                              // 37
    f();                                                                         // 38
                                                                                 // 39
    // Insert the stub again                                                     // 40
    _.each(supers, function(f, name) {                                           // 41
      self._methodHandlers[name] = f;                                            // 42
    });                                                                          // 43
  } else {                                                                       // 44
    throw new Error('stubFence, no methods found');                              // 45
  }                                                                              // 46
                                                                                 // 47
  inFence--;                                                                     // 48
};                                                                               // 49
                                                                                 // 50
Mongo.Collection.prototype.stubFence = function(f) {                             // 51
  var self = this;                                                               // 52
                                                                                 // 53
  // Make sure we got a collection name                                          // 54
  if (!self._name)                                                               // 55
    throw new Error('Dont run stubFence on an annonymous collection');           // 56
                                                                                 // 57
  // Make sure we got a connection                                               // 58
  if (self._connection) {                                                        // 59
    // The main collection methods                                               // 60
    var collectionMethods = [                                                    // 61
      '/' + self._name + '/insert',                                              // 62
      '/' + self._name + '/remove',                                              // 63
      '/' + self._name + '/update'                                               // 64
    ];                                                                           // 65
                                                                                 // 66
    // Run the connection stubFence                                              // 67
    self._connection.stubFence(collectionMethods, f);                            // 68
                                                                                 // 69
  } else {                                                                       // 70
    throw new Error('Dont run stubFence on a collection with no connection');    // 71
  }                                                                              // 72
};                                                                               // 73
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:stubfence'] = {};

})();

//# sourceMappingURL=raix_stubfence.js.map
