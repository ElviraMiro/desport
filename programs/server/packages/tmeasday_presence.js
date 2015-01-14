(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Presences, Presence;

(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/tmeasday:presence/lib/common.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Presences = new Meteor.Collection('presences');                      // 1
// For backwards compatibilty                                        // 2
Meteor.presences = Presences;                                        // 3
                                                                     // 4
Meteor.methods({                                                     // 5
  updatePresence: function(state) {                                  // 6
    check(state, Match.Any);                                         // 7
                                                                     // 8
    var connectionId = this.isSimulation                             // 9
      ? Meteor.connection._lastSessionId                             // 10
      : this.connection.id;                                          // 11
                                                                     // 12
    // Should never happen                                           // 13
    if (! connectionId)                                              // 14
      return;                                                        // 15
                                                                     // 16
    var update = {};                                                 // 17
    update.state = state;                                            // 18
    if (typeof Meteor.userId !== 'undefined' && Meteor.userId())     // 19
      update.userId = Meteor.userId();                               // 20
                                                                     // 21
    Presences.update(connectionId, update);                          // 22
  }                                                                  // 23
});                                                                  // 24
                                                                     // 25
///////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/tmeasday:presence/lib/server.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var connections = {};                                                // 1
                                                                     // 2
var expire = function(id) {                                          // 3
  Presences.remove(id);                                              // 4
  delete connections[id];                                            // 5
};                                                                   // 6
                                                                     // 7
var tick = function(id) {                                            // 8
  connections[id].lastSeen = Date.now();                             // 9
};                                                                   // 10
                                                                     // 11
Meteor.startup(function() {                                          // 12
  Presences.remove({});                                              // 13
});                                                                  // 14
                                                                     // 15
Meteor.onConnection(function(connection) {                           // 16
  // console.log('connectionId: ' + connection.id);                  // 17
  Presences.insert({ _id: connection.id });                          // 18
                                                                     // 19
  connections[connection.id] = {};                                   // 20
  tick(connection.id);                                               // 21
                                                                     // 22
  connection.onClose(function() {                                    // 23
    // console.log('connection closed: ' + connection.id);           // 24
    expire(connection.id);                                           // 25
  });                                                                // 26
});                                                                  // 27
                                                                     // 28
Meteor.methods({                                                     // 29
  presenceTick: function() {                                         // 30
    check(arguments, [Match.Any]);                                   // 31
    if (this.connection && connections[this.connection.id])          // 32
      tick(this.connection.id);                                      // 33
  }                                                                  // 34
});                                                                  // 35
                                                                     // 36
Meteor.setInterval(function() {                                      // 37
  _.each(connections, function(connection, id) {                     // 38
    if (connection.lastSeen < (Date.now() - 10000))                  // 39
      expire(id);                                                    // 40
  });                                                                // 41
}, 5000);                                                            // 42
                                                                     // 43
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tmeasday:presence'] = {
  Presences: Presences,
  Presence: Presence
};

})();

//# sourceMappingURL=tmeasday_presence.js.map
