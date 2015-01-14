(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var OneTimeout;

(function () {

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/raix:onetimeout/onetimeout.js                             //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
OneTimeout = function(delay) {                                        // 1
  if (typeof delay == 'undefined')                                    // 2
    throw new Error('New api');                                       // 3
  // Pointer to Meteor.setTimeout                                     // 4
  var id = null;                                                      // 5
  // Save the methods into the localstorage                           // 6
  return function oneTimeout(f) {                                     // 7
    // If a timeout is in progress                                    // 8
    if (id !== null) {                                                // 9
      // then stop the current timeout - we have updates              // 10
      Meteor.clearTimeout(id);                                        // 11
    }                                                                 // 12
    // Spawn new timeout                                              // 13
    id = Meteor.setTimeout(function runOneTimeout() {                 // 14
      // Ok, we reset reference so we dont get cleared and go to work // 15
      id = null;                                                      // 16
      // Run function                                                 // 17
      f();                                                            // 18
      // Delay execution a bit                                        // 19
    }, delay);                                                        // 20
  };                                                                  // 21
};                                                                    // 22
////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['raix:onetimeout'] = {
  OneTimeout: OneTimeout
};

})();

//# sourceMappingURL=raix_onetimeout.js.map
