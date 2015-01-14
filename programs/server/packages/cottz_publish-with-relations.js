(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Publish, HandlerController, publish, RelationsMethods;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cottz:publish-with-relations/handler_controller.js                                                      //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
HandlerController = function (_id) {                                                                                // 1
	this._id = _id;                                                                                                    // 2
	this.handlers = [];                                                                                                // 3
};                                                                                                                  // 4
                                                                                                                    // 5
HandlerController.prototype.add = function (observe, cursorName) {                                                  // 6
	if(typeof cursorName != 'string') {                                                                                // 7
		// in this case the cursor was sent instead of the cursor name                                                    // 8
		cursorName = cursorName._cursorDescription.collectionName;                                                        // 9
	}                                                                                                                  // 10
                                                                                                                    // 11
	var oldHandler = this.handlers[cursorName];                                                                        // 12
	if(oldHandler)                                                                                                     // 13
		oldHandler.stop();                                                                                                // 14
                                                                                                                    // 15
	this.handlers[cursorName] = observe;                                                                               // 16
                                                                                                                    // 17
	return observe;                                                                                                    // 18
};                                                                                                                  // 19
                                                                                                                    // 20
HandlerController.prototype.stop = function () {                                                                    // 21
	var handlers = this.handlers;                                                                                      // 22
	for (var key in handlers) {                                                                                        // 23
		handlers[key].stop();                                                                                             // 24
	};                                                                                                                 // 25
	//_.forIn(handlers, function (handler) {                                                                           // 26
	//	handler.stop();                                                                                                 // 27
	//});                                                                                                              // 28
};                                                                                                                  // 29
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cottz:publish-with-relations/publish.js                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
publish = function () {};                                                                                           // 1
                                                                                                                    // 2
publish.prototype.cursor = function (cursor, sub, collectionName) {                                                 // 3
	if(!collectionName)                                                                                                // 4
		collectionName = cursor._cursorDescription.collectionName;                                                        // 5
	Meteor.Collection._publishCursor(cursor, sub, collectionName);                                                     // 6
};                                                                                                                  // 7
                                                                                                                    // 8
publish.prototype.observe = function (cursor, callbacks, sub) {                                                     // 9
	var observeHandle = cursor.observe(callbacks);                                                                     // 10
                                                                                                                    // 11
	sub && sub.onStop(function () {                                                                                    // 12
		observeHandle.stop();                                                                                             // 13
	});                                                                                                                // 14
                                                                                                                    // 15
	return observeHandle;                                                                                              // 16
};                                                                                                                  // 17
                                                                                                                    // 18
publish.prototype.observeChanges = function (cursor, callbacks, sub) {                                              // 19
	var observeHandle = cursor.observeChanges(callbacks);                                                              // 20
                                                                                                                    // 21
	sub && sub.onStop(function () {                                                                                    // 22
		observeHandle.stop();                                                                                             // 23
	});                                                                                                                // 24
                                                                                                                    // 25
	return observeHandle;                                                                                              // 26
};                                                                                                                  // 27
                                                                                                                    // 28
Publish = new publish();                                                                                            // 29
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cottz:publish-with-relations/publish_relations.js                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
publish.prototype.relations = function (sub, options, callback) {                                                   // 1
	var observes = [],                                                                                                 // 2
		cursor = options.cursor || options,                                                                               // 3
		name = options.name || cursor._cursorDescription.collectionName;                                                  // 4
                                                                                                                    // 5
	if(!cursor)                                                                                                        // 6
		throw new Error("you're not sending the cursor");                                                                 // 7
                                                                                                                    // 8
	function _sendData (_id, parentDoc, addStarted) {                                                                  // 9
		if(callback) {                                                                                                    // 10
			var methods = new RelationsMethods(_id, {                                                                        // 11
				sub: sub,                                                                                                       // 12
				started: addStarted,                                                                                            // 13
				cursorName: name,                                                                                               // 14
				handlers: observes                                                                                              // 15
			});                                                                                                              // 16
                                                                                                                    // 17
			parentDoc = callback.call(methods, _id, parentDoc, addStarted) || parentDoc;                                     // 18
		}                                                                                                                 // 19
                                                                                                                    // 20
		if(addStarted)                                                                                                    // 21
			sub.changed(name, _id, parentDoc);                                                                               // 22
		else                                                                                                              // 23
			sub.added(name, _id, parentDoc);                                                                                 // 24
	};                                                                                                                 // 25
                                                                                                                    // 26
	var cursorObserveChanges = cursor.observeChanges({                                                                 // 27
		added: function (id, doc) {                                                                                       // 28
			_sendData(id, doc, false);                                                                                       // 29
		},                                                                                                                // 30
		changed: function (id, doc) {                                                                                     // 31
			// the true is indicate to the callback that the doc has changed                                                 // 32
			_sendData(id, doc, true);                                                                                        // 33
		},                                                                                                                // 34
		removed: function (id) {                                                                                          // 35
			sub.removed(name, id);                                                                                           // 36
			if(observes[id]) {                                                                                               // 37
				observes[id].stop();                                                                                            // 38
				delete observes[id];                                                                                            // 39
			}                                                                                                                // 40
		}                                                                                                                 // 41
	});                                                                                                                // 42
                                                                                                                    // 43
	function stopCursor () {                                                                                           // 44
		cursorObserveChanges.stop();                                                                                      // 45
                                                                                                                    // 46
		for (var key in observes) {                                                                                       // 47
			observes[key].stop();                                                                                            // 48
		};                                                                                                                // 49
                                                                                                                    // 50
		observes = [];                                                                                                    // 51
	};                                                                                                                 // 52
                                                                                                                    // 53
	sub.onStop(stopCursor);                                                                                            // 54
	// I do not think it necessary to send the Ready from here                                                         // 55
	// return sub.ready();                                                                                             // 56
	return {                                                                                                           // 57
		stop: stopCursor                                                                                                  // 58
	};                                                                                                                 // 59
};                                                                                                                  // 60
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cottz:publish-with-relations/relations_methods.js                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
RelationsMethods = function (_id, options) {                                                                        // 1
	var handlers = options.handlers;                                                                                   // 2
                                                                                                                    // 3
	if(!options.started) {                                                                                             // 4
		if(handlers[_id]) {                                                                                               // 5
			console.log('there is already an observer with the id: ' + _id + ' in the cursorName: ' + cursorName);           // 6
		}                                                                                                                 // 7
                                                                                                                    // 8
		handlers[_id] = new HandlerController(_id);                                                                       // 9
	}                                                                                                                  // 10
                                                                                                                    // 11
	this._id = _id;                                                                                                    // 12
	this.handlers = handlers[_id];                                                                                     // 13
                                                                                                                    // 14
	this.sub = options.sub;                                                                                            // 15
	this.name = options.cursorName;                                                                                    // 16
};                                                                                                                  // 17
                                                                                                                    // 18
_.extend(RelationsMethods.prototype, {                                                                              // 19
	observe: function (cursor, callbacks) {                                                                            // 20
		this.handlers.add(cursor.observe(callbacks), cursor);                                                             // 21
	},                                                                                                                 // 22
	observeChanges: function (cursor, callbacks) {                                                                     // 23
		this.handlers.add(cursor.observeChanges(callbacks), cursor);                                                      // 24
	},                                                                                                                 // 25
	// make parameter is a callback                                                                                    // 26
	// adds a new cursor in a different collection to the main                                                         // 27
	cursor: function (cursor, cursorName, make) {                                                                      // 28
		var handlers = this.handlers,                                                                                     // 29
			withoutMake = typeof cursorName == 'function';                                                                   // 30
                                                                                                                    // 31
		if(!cursorName || withoutMake) {                                                                                  // 32
			if(withoutMake)                                                                                                  // 33
				make = cursorName;                                                                                              // 34
                                                                                                                    // 35
			cursorName = cursor._cursorDescription.collectionName;                                                           // 36
		}                                                                                                                 // 37
                                                                                                                    // 38
		return handlers.add(publish.prototype.relations(this.sub, {cursor: cursor, name: cursorName}, make), cursorName); // 39
	},                                                                                                                 // 40
	// designed to change something in the master document while the callbacks are executed                            // 41
	// changes to the document are sent to the main document with the return of the callbacks                          // 42
	changeParentDoc: function (cursor, callbacks, onRemoved) {                                                         // 43
		var sub = this.sub,                                                                                               // 44
			_id = this._id,                                                                                                  // 45
			name = this.name,                                                                                                // 46
			result = {};                                                                                                     // 47
		                                                                                                                  // 48
		if(typeof callbacks == 'function') {                                                                              // 49
			callbacks = {                                                                                                    // 50
				added: callbacks,                                                                                               // 51
				changed: callbacks,                                                                                             // 52
				removed: onRemoved                                                                                              // 53
			}                                                                                                                // 54
		}                                                                                                                 // 55
                                                                                                                    // 56
		var observe = cursor.observeChanges({                                                                             // 57
			added: function (id, doc) {                                                                                      // 58
				result = callbacks.added(id, doc);                                                                              // 59
			},                                                                                                               // 60
			changed: function (id, doc) {                                                                                    // 61
				var changes = callbacks.changed(id, doc);                                                                       // 62
				if(changes)                                                                                                     // 63
					sub.changed(name, _id, changes);                                                                               // 64
			},                                                                                                               // 65
			removed: function (id) {                                                                                         // 66
				var changes = callbacks.removed(id);                                                                            // 67
				if(changes)                                                                                                     // 68
					sub.changed(name, _id, changes);                                                                               // 69
			}                                                                                                                // 70
		});                                                                                                               // 71
                                                                                                                    // 72
		this.handlers.add(observe, cursor);                                                                               // 73
		return result;                                                                                                    // 74
	},                                                                                                                 // 75
	// returns an array of elements with all documents in the cursor                                                   // 76
	// when there is a change it will update the element change in the resulting array                                 // 77
	// and send it back to the collection                                                                              // 78
	group: function (cursor, make, field, options) {                                                                   // 79
		var sub = this.sub,                                                                                               // 80
			_id = this._id,                                                                                                  // 81
			name = this.name,                                                                                                // 82
			result = [];                                                                                                     // 83
                                                                                                                    // 84
		if(options) {                                                                                                     // 85
			var sort = options.sort,                                                                                         // 86
				sortField = options.sortField;                                                                                  // 87
		}                                                                                                                 // 88
		                                                                                                                  // 89
		var observe = cursor.observe({                                                                                    // 90
			addedAt: function (doc, atIndex) {                                                                               // 91
				if(sort) {                                                                                                      // 92
					atIndex = sort.indexOf(doc[sortField || '_id']);                                                               // 93
					result[atIndex] = make(doc, atIndex);                                                                          // 94
				} else                                                                                                          // 95
					result.push(make(doc, atIndex));                                                                               // 96
			},                                                                                                               // 97
			changedAt: function (doc, oldDoc, atIndex) {                                                                     // 98
				if(sort)                                                                                                        // 99
					atIndex = sort.indexOf(doc[sortField || '_id']);                                                               // 100
                                                                                                                    // 101
				var changes = make(doc, atIndex, oldDoc),                                                                       // 102
					changesObj = {};                                                                                               // 103
                                                                                                                    // 104
				result[atIndex] = changes;                                                                                      // 105
				changesObj[field] = result;                                                                                     // 106
                                                                                                                    // 107
				sub.changed(name, _id, changesObj);                                                                             // 108
			},                                                                                                               // 109
			removedAt: function (oldDoc, atIndex) {                                                                          // 110
				var cb = options.onRemoved;                                                                                     // 111
				if(cb)                                                                                                          // 112
					sub.changed(name, _id, cb(oldDoc, atIndex));                                                                   // 113
			}                                                                                                                // 114
		});                                                                                                               // 115
                                                                                                                    // 116
		this.handlers.add(observe, cursor);                                                                               // 117
		return result;                                                                                                    // 118
	},                                                                                                                 // 119
	// designed to paginate a list, works in conjunction with the methods                                              // 120
	// do not call back to the main callback, only the array is changed in the collection                              // 121
	paginate: function (fieldData, limit, infinite) {                                                                  // 122
		var sub = this.sub,                                                                                               // 123
			_id = this._id,                                                                                                  // 124
			name = this.name;                                                                                                // 125
			                                                                                                                 // 126
		var crossbar = DDPServer._InvalidationCrossbar,                                                                   // 127
			field = Object.keys(fieldData)[0],                                                                               // 128
			copy = _.clone(fieldData)[field],                                                                                // 129
			max = copy.length,                                                                                               // 130
			connectionId = sub.connection.id;                                                                                // 131
                                                                                                                    // 132
		fieldData[field] = copy.slice(0, limit);                                                                          // 133
                                                                                                                    // 134
		var listener = crossbar.listen({connection: connectionId, _id: _id, field: field}, function (data) {              // 135
			if(connectionId == data.connection) {                                                                            // 136
				var skip = data.skip;                                                                                           // 137
                                                                                                                    // 138
				if(skip >= max && !infinite)                                                                                    // 139
					return;                                                                                                        // 140
                                                                                                                    // 141
				fieldData[field] = infinite ? copy.slice(0, skip): copy.slice(skip, skip + limit);                              // 142
				sub.changed(name, data._id, fieldData);                                                                         // 143
			}                                                                                                                // 144
		});                                                                                                               // 145
                                                                                                                    // 146
		this.handlers.add(listener, field);                                                                               // 147
		return fieldData[field];                                                                                          // 148
	}                                                                                                                  // 149
});                                                                                                                 // 150
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cottz:publish-with-relations/methods.js                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Meteor.methods({                                                                                                    // 1
	changePagination: function (field, _id, skip) {                                                                    // 2
		// I want to know if this is reliable                                                                             // 3
		var crossbar = DDPServer._InvalidationCrossbar;                                                                   // 4
		crossbar.fire({connection: this.connection.id, field: field, _id: _id, skip: skip});                              // 5
	}                                                                                                                  // 6
});                                                                                                                 // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cottz:publish-with-relations'] = {
  Publish: Publish
};

})();

//# sourceMappingURL=cottz_publish-with-relations.js.map
