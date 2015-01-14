(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Dictionary = Package['ground:dictionary'].Dictionary;

/* Package-scope variables */
var MiniMax;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/ground:minimax/ejson.minimax.js                                                               //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
/*                                                                                                        // 1
                                                                                                          // 2
                                                                                                          // 3
                    __  ____       _ __  ___                                                              // 4
                   /  |/  (_)___  (_)  |/  /___ __  __                                                    // 5
                  / /|_/ / / __ \/ / /|_/ / __ `/ |/_/                                                    // 6
                 / /  / / / / / / / /  / / /_/ />  <                                                      // 7
                /_/  /_/_/_/ /_/_/_/  /_/\__,_/_/|_|                                                      // 8
                                                                                                          // 9
  Minify and Maxify by RaiX aka Morten N.O. Nørgaard Henriksen (mh@gi-software.com)                       // 10
                                                                                                          // 11
  MiniMax.minify( Object )                                                                                // 12
                                                                                                          // 13
  MiniMax.maxify( array )                                                                                 // 14
                                                                                                          // 15
  MiniMax.stringify( object )                                                                             // 16
                                                                                                          // 17
  MiniMax.parse( string )                                                                                 // 18
                                                                                                          // 19
  // For faster lookup                                                                                    // 20
  var keywords = {                                                                                        // 21
    '_id': 0,                                                                                             // 22
    'test': 1,                                                                                            // 23
    'comment': 2,                                                                                         // 24
    'list': 3,                                                                                            // 25
    'note': 4                                                                                             // 26
  };                                                                                                      // 27
                                                                                                          // 28
  var keywordsList = [ '_id', 'test', 'comment', 'list', 'note' ];                                        // 29
                                                                                                          // 30
  var headers = [0, [0, 1, 2], [0, 3, -5] ];                                                              // 31
                                                                                                          // 32
  var data = []; */                                                                                       // 33
                                                                                                          // 34
  // if(!Array.isArray) {                                                                                 // 35
  //   Array.isArray = function (vArg) {                                                                  // 36
  //     return Object.prototype.toString.call(vArg) === '[object Array]';                                // 37
  //   };                                                                                                 // 38
  // }                                                                                                    // 39
                                                                                                          // 40
  // Create the export scope                                                                              // 41
  MiniMax = function(options) {                                                                           // 42
    var self = this;                                                                                      // 43
                                                                                                          // 44
    // Make sure we are on an instance                                                                    // 45
    if (!(self instanceof MiniMax))                                                                       // 46
      return new MiniMax(options);                                                                        // 47
                                                                                                          // 48
    // Make sure options is set                                                                           // 49
    options = options || {};                                                                              // 50
                                                                                                          // 51
    // Setting this true will add all values and dates to the dictionary                                  // 52
    // This can in some cases save                                                                        // 53
    self.progressive = (options.progressive === false)? false : true;                                     // 54
                                                                                                          // 55
    // Set the default Dictionary                                                                         // 56
    // If the user added initial dictionary then add those                                                // 57
    self.dictionary = new Dictionary(_.union([false, true, null, undefined], options.dictionary || [] )); // 58
  };                                                                                                      // 59
                                                                                                          // 60
  MiniMax.prototype.minify = function(maxObj) {                                                           // 61
    var self = this;                                                                                      // 62
    var headers = [0];                                                                                    // 63
                                                                                                          // 64
    // Start dictionary                                                                                   // 65
    var dict = new Dictionary(self.dictionary);                                                           // 66
                                                                                                          // 67
    var getHeader = function(newHeader) {                                                                 // 68
      var headerId = null;                                                                                // 69
      for (var i = 1; i < headers.length; i++) {                                                          // 70
        var orgHeader = headers[i];                                                                       // 71
        // We only need to iterate over the intersection to get a match                                   // 72
        var minLength = Math.min(orgHeader.length, newHeader.length);                                     // 73
        var isMatch = true;                                                                               // 74
        for (var a = 0; a < minLength; a++) {                                                             // 75
          // We break if not a match                                                                      // 76
          if (orgHeader[a] !== newHeader[a]) {                                                            // 77
            isMatch = false;                                                                              // 78
            break;                                                                                        // 79
          }                                                                                               // 80
        }                                                                                                 // 81
        if (isMatch) {                                                                                    // 82
          // We check to see if                                                                           // 83
          // We are equal or in another header                                                            // 84
          // eg. headers = [1, 2, 3] newHeader=[1, 2, 3] return id                                        // 85
          // eg. headers = [1, 2, 3, 4] newHeader=[1, 2, 3] return id                                     // 86
          headerId = i;                                                                                   // 87
          // We could maybe contain another header - so we extend the org. and use                        // 88
          // that eg. headers = [1, 2, 3] newHeader=[1, 2, 3, 4] then                                     // 89
          // set headers=newHeader and return id                                                          // 90
          if (newHeader.length > minLength) {                                                             // 91
            headers[i] = newHeader;                                                                       // 92
          }                                                                                               // 93
        }                                                                                                 // 94
        // Stop when we found a match                                                                     // 95
        if (headerId !== null) {                                                                          // 96
          break;                                                                                          // 97
        }                                                                                                 // 98
      }                                                                                                   // 99
      // Or none of the above we add a new header                                                         // 100
      if (headerId === null) {                                                                            // 101
        headerId = headers.push(newHeader) - 1;                                                           // 102
      }                                                                                                   // 103
      return headerId;                                                                                    // 104
    };                                                                                                    // 105
                                                                                                          // 106
    var minifyHelper = function(maxObj) {                                                                 // 107
      var inArray = !_.isArray(maxObj);                                                                   // 108
      var target = [];                                                                                    // 109
      var header = [];                                                                                    // 110
                                                                                                          // 111
      _.each(maxObj, function(value, key) {                                                               // 112
                                                                                                          // 113
        var minKey = (inArray) ? dict.add(key) : 0;                                                       // 114
                                                                                                          // 115
        if (value !== null && typeof value === 'object' && !(value instanceof Date)) {                    // 116
          // Array or Object                                                                              // 117
          if (inArray) {                                                                                  // 118
            header.push(minKey);                                                                          // 119
          }                                                                                               // 120
                                                                                                          // 121
          // Handle the object                                                                            // 122
          target.push(minifyHelper(value));                                                               // 123
                                                                                                          // 124
        } else {                                                                                          // 125
          // Depending on the progressive settings this will                                              // 126
          // Check if value is found in keywords                                                          // 127
          // Always set the value in keywords dictionary                                                  // 128
          var valueId = (self.progressive) ? dict.add(value) : dict.index(value);                         // 129
                                                                                                          // 130
          if (typeof valueId == 'undefined') {                                                            // 131
            // Not found, we add normal values                                                            // 132
            header.push(minKey);                                                                          // 133
            target.push(value);                                                                           // 134
          } else {                                                                                        // 135
                                                                                                          // 136
            header.push(-minKey);                                                                         // 137
            if (!inArray) {                                                                               // 138
              target.push(value);                                                                         // 139
            } else {                                                                                      // 140
              // Found, make minKey negative and set value to valueId                                     // 141
              target.push(valueId);                                                                       // 142
            }                                                                                             // 143
          }                                                                                               // 144
        }                                                                                                 // 145
      });                                                                                                 // 146
                                                                                                          // 147
      if (inArray) {                                                                                      // 148
        var headerId = getHeader(header);                                                                 // 149
        target.unshift(headerId);                                                                         // 150
      } else {                                                                                            // 151
        target.unshift(0); // 0 marks an array with no headers                                            // 152
      }                                                                                                   // 153
                                                                                                          // 154
                                                                                                          // 155
      return target;                                                                                      // 156
    };                                                                                                    // 157
                                                                                                          // 158
    // If not an object then not much to work on                                                          // 159
    if (typeof maxObj !== 'object') {                                                                     // 160
      return maxObj;                                                                                      // 161
    }                                                                                                     // 162
                                                                                                          // 163
    var data = minifyHelper(maxObj);                                                                      // 164
                                                                                                          // 165
    return [ dict.withoutInitial(), headers, data ];                                                      // 166
  };                                                                                                      // 167
                                                                                                          // 168
                                                                                                          // 169
  // Takes an minify object and maxify to object                                                          // 170
  MiniMax.prototype.maxify = function(minObj) {                                                           // 171
    var self = this;                                                                                      // 172
                                                                                                          // 173
    // We expect an array of 3                                                                            // 174
    if (minObj === null || minObj.length !== 3) {                                                         // 175
      // Return object                                                                                    // 176
      return minObj;                                                                                      // 177
    }                                                                                                     // 178
                                                                                                          // 179
    // Init globals                                                                                       // 180
    var dict = new Dictionary(self.dictionary);                                                           // 181
    dict.addList(minObj[0]);                                                                              // 182
                                                                                                          // 183
    var headers = minObj[1];                                                                              // 184
    var data = minObj[2];                                                                                 // 185
                                                                                                          // 186
    var maxifyHelper = function(minObj) {                                                                 // 187
      // read header reference and fetch the header                                                       // 188
      var headerId = minObj.shift();                                                                      // 189
      var header = (headerId) ? headers[headerId] : null;                                                 // 190
                                                                                                          // 191
      // If header === 0 then we are creating an array otherwise an object                                // 192
      var result = (header === null) ? [] : {};                                                           // 193
      // We launch interation over the minObj                                                             // 194
      if (header === null) {                                                                              // 195
        // Create an array                                                                                // 196
        for (var i = 0; i < minObj.length; i++) {                                                         // 197
          if (_.isArray(minObj[i])) {                                                                     // 198
            result.push(maxifyHelper(minObj[i]));                                                         // 199
          } else {                                                                                        // 200
            result.push(minObj[i]);                                                                       // 201
          }                                                                                               // 202
        }                                                                                                 // 203
      } else {                                                                                            // 204
        // Create object                                                                                  // 205
        for (var i = 0; i < minObj.length; i++) {                                                         // 206
          // Lookup keyword id can be negative for value lookup                                           // 207
          var keyId = header[i];                                                                          // 208
          // Lookup keyword                                                                               // 209
          var key = dict.value(Math.abs(keyId));                                                          // 210
          // Is value an array then dig deeper                                                            // 211
          if (_.isArray(minObj[i])) {                                                                     // 212
            result[key] = maxifyHelper(minObj[i]);                                                        // 213
          } else {                                                                                        // 214
            var value = minObj[i]; // Value or valueId                                                    // 215
            // if keyId is negative then lookup the value in keywords                                     // 216
            if (keyId < 0) {                                                                              // 217
              value = dict.value(value);                                                                  // 218
            }                                                                                             // 219
            result[key] = value;                                                                          // 220
          }                                                                                               // 221
        }                                                                                                 // 222
      }                                                                                                   // 223
      return result;                                                                                      // 224
    };                                                                                                    // 225
                                                                                                          // 226
    return maxifyHelper(data);                                                                            // 227
  };                                                                                                      // 228
                                                                                                          // 229
  MiniMax.prototype.stringify = function(plainObject) {                                                   // 230
    // Compress the object                                                                                // 231
    var minifiedObject = this.minify(plainObject);                                                        // 232
    // Convert it into string                                                                             // 233
    return EJSON.stringify(minifiedObject);                                                               // 234
  };                                                                                                      // 235
                                                                                                          // 236
  MiniMax.prototype.parse = function(ejsonString) {                                                       // 237
    // Convert the string into minified object                                                            // 238
    var minifiedObject = EJSON.parse(ejsonString);                                                        // 239
    // Maxify the object                                                                                  // 240
    return this.maxify(minifiedObject);                                                                   // 241
  };                                                                                                      // 242
                                                                                                          // 243
////////////////////////////////////////////////////////////////////////////////                          // 244
//  DEFAULT BEHAVIOUR                                                                                     // 245
////////////////////////////////////////////////////////////////////////////////                          // 246
                                                                                                          // 247
var defaultMiniMax = new MiniMax();                                                                       // 248
                                                                                                          // 249
MiniMax.minify = function(maxObj) {                                                                       // 250
  return defaultMiniMax.minify(maxObj);                                                                   // 251
};                                                                                                        // 252
                                                                                                          // 253
MiniMax.maxify = function(minObj) {                                                                       // 254
  return defaultMiniMax.maxify(minObj);                                                                   // 255
};                                                                                                        // 256
                                                                                                          // 257
MiniMax.stringify = function(obj) {                                                                       // 258
  return defaultMiniMax.stringify(obj);                                                                   // 259
};                                                                                                        // 260
                                                                                                          // 261
MiniMax.parse = function(str) {                                                                           // 262
  return defaultMiniMax.parse(str);                                                                       // 263
};                                                                                                        // 264
                                                                                                          // 265
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ground:minimax'] = {
  MiniMax: MiniMax
};

})();

//# sourceMappingURL=ground_minimax.js.map
