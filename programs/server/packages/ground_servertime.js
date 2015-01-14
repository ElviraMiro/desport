(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Store = Package['ground:store'].Store;

/* Package-scope variables */
var ServerTime;

(function () {

///////////////////////////////////////////////////////////////////////////////////
//                                                                               //
// packages/ground:servertime/server.js                                          //
//                                                                               //
///////////////////////////////////////////////////////////////////////////////////
                                                                                 //
////////////////////////// GET SERVER TIME DIFFERENCE ////////////////////////// // 1
                                                                                 // 2
ServerTime = {};                                                                 // 3
                                                                                 // 4
// XXX: TODO use a http rest point instead - creates less overhead               // 5
Meteor.methods({                                                                 // 6
  'getServerTime': function() {                                                  // 7
    return Date.now();                                                           // 8
  }                                                                              // 9
});                                                                              // 10
                                                                                 // 11
// Unify client / server api                                                     // 12
ServerTime.now = function() {                                                    // 13
  return Date.now();                                                             // 14
};                                                                               // 15
///////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:servertime'] = {
  ServerTime: ServerTime
};

})();

//# sourceMappingURL=ground_servertime.js.map
