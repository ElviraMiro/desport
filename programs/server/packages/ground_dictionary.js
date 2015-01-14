(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var Dictionary;

(function () {

/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
// packages/ground:dictionary/dictionary.js                                    //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
                                                                               //
var _splice = function(array, begin) {                                         // 1
  var result = [];                                                             // 2
                                                                               // 3
  begin = begin || 0;                                                          // 4
                                                                               // 5
  // Add the ones we need                                                      // 6
  for (var i = begin; i < array.length; i++)                                   // 7
    result.push(array[i]);                                                     // 8
                                                                               // 9
  return result;                                                               // 10
};                                                                             // 11
                                                                               // 12
Dictionary = function(list) {                                                  // 13
  var self = this;                                                             // 14
  // Dictionary                                                                // 15
  self.lookup = {};                                                            // 16
  self.lookupDate = {}; // Special lookup making sure date lookups are acurate // 17
                                                                               // 18
  self.list = [];                                                              // 19
                                                                               // 20
  self.initial = [];                                                           // 21
                                                                               // 22
  // If user sets a list                                                       // 23
  if (list instanceof Dictionary) {                                            // 24
    // Clone the initial list                                                  // 25
    self.initial = list.clone();                                               // 26
    // We set the clone                                                        // 27
    self.set(list.clone());                                                    // 28
  } else if (list) {                                                           // 29
    // Clone the array                                                         // 30
    self.initial = _splice(list);                                              // 31
    // Just set the list                                                       // 32
    self.set(list);                                                            // 33
  }                                                                            // 34
                                                                               // 35
};                                                                             // 36
                                                                               // 37
Dictionary.prototype.add = function(value) {                                   // 38
  var self = this;                                                             // 39
  // Make sure not to add existing values / words                              // 40
  if (!self.exists(value)) {                                                   // 41
    // Add value to keyword list                                               // 42
    // We return the index - note this can be 0 :)                             // 43
    if (value instanceof Date) {                                               // 44
      var index = this.list.push(value) - 1;                                   // 45
      // Set the normal lookup                                                 // 46
      this.lookup[value] = index;                                              // 47
      // Set the value in the date lookup in order not to conflict with number // 48
      // lookups                                                               // 49
      this.lookupDate[+value] = index;                                         // 50
    } else {                                                                   // 51
      this.lookup[value] = this.list.push(value) -1;                           // 52
    }                                                                          // 53
  }                                                                            // 54
                                                                               // 55
  return this.index(value);                                                    // 56
};                                                                             // 57
                                                                               // 58
Dictionary.prototype.addList = function(list) {                                // 59
  // Iterate over the list of values                                           // 60
  if (list)                                                                    // 61
    for (var i = 0; i < list.length; i++)                                      // 62
      this.add(list[i]);                                                       // 63
};                                                                             // 64
                                                                               // 65
Dictionary.prototype.set = function(list) {                                    // 66
  // Reset the this.lookup                                                     // 67
  this.lookup = {};                                                            // 68
  this.lookupDate = {};                                                        // 69
  this.list = [];                                                              // 70
  // Add the list                                                              // 71
  this.addList(list);                                                          // 72
};                                                                             // 73
                                                                               // 74
Dictionary.prototype.remove = function(value) {                                // 75
  var self = this;                                                             // 76
  // Make sure theres something to remove                                      // 77
  if (self.exists(value)) {                                                    // 78
    var result = [];                                                           // 79
    // copy the this.lookup                                                    // 80
    for (var i = 0; i < this.list.length; i++)                                 // 81
      if (i !== self.index(value)) result.push(this.list[i]);                  // 82
    // Set the new list of this.lookup                                         // 83
    this.set(result);                                                          // 84
  }                                                                            // 85
};                                                                             // 86
                                                                               // 87
Dictionary.prototype.withoutInitial = function() {                             // 88
  return _splice(this.list, this.initial.length);                              // 89
};                                                                             // 90
                                                                               // 91
Dictionary.prototype.value = function(index) {                                 // 92
  return this.list[index];                                                     // 93
};                                                                             // 94
                                                                               // 95
Dictionary.prototype.index = function(value) {                                 // 96
  // We have to use the Date lookup in order to get the correct lookup value   // 97
  // otherwise there are some slight diviation in the result - We want this    // 98
  // 100% accurate                                                             // 99
  if (value instanceof Date) {                                                 // 100
    return this.lookupDate[+value];                                            // 101
  } else {                                                                     // 102
    return this.lookup[value];                                                 // 103
  }                                                                            // 104
};                                                                             // 105
                                                                               // 106
Dictionary.prototype.exists = function(value) {                                // 107
  return (typeof this.index(value) !== 'undefined');                           // 108
};                                                                             // 109
                                                                               // 110
Dictionary.prototype.clone = function() {                                      // 111
  return _splice(this.list);                                                   // 112
};                                                                             // 113
                                                                               // 114
Dictionary.prototype.toArray = function() {                                    // 115
  return this.list;                                                            // 116
};                                                                             // 117
                                                                               // 118
Dictionary.prototype.toObject = function() {                                   // 119
  return this.lookup;                                                          // 120
};                                                                             // 121
                                                                               // 122
/////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:dictionary'] = {
  Dictionary: Dictionary
};

})();

//# sourceMappingURL=ground_dictionary.js.map
