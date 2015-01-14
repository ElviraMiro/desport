(function(){EventTypes = new Meteor.Collection("eventtypes");

var EventTypeSchema = new SimpleSchema({
	title: {
		type: String,
		label: 'Вид події',
		max: 200
	},
	ownerId: {
		type: String,
		max: 50,
		optional: true
	}
});

EventTypes.attachSchema(EventTypeSchema);

EventTypes.allow({
	insert: function(userId, doc) {
		if (userId == doc.authorId) {
			return true;
		} else {
			return false;
		}
	}
})

Events = new Meteor.Collection("events");

var EventSchema = new SimpleSchema({
	eventTypeId: {
		type: String,
		label: 'Вид події',
		max: 50
	},
	locationId: {
		type: String,
		label: 'Місце проведення',
		max: 50,
		optional: true
	},
	startedAt: {
		type: Date,
		label: 'Дата та час початку'
	},
	finishedAt: {
		type: Date,
		label: 'Дата та час закінчення'
	},
	description: {
		type: String,
		label: 'Опис події',
		max: 200,
		optional: true
	},
	groupIds: {
		type: [String],
		optional: true
	},
	adminIds: {
		type: [String],
		label: 'Адміністратори',
		optional: true
	},
	userIds: {
		type: [String],
		label: 'Учасники',
		optional: true
	},
	authorId: {
		type: String,
		max: 50,
		autoValue: function() {
			if (this.isInsert) {
				return this.userId;
			}
		}
	}
});

Events.attachSchema(EventSchema);

Events.allow({
	insert: function(userId, doc) {
		if (userId == doc.authorId) {
			return true;
		} else {
			return false;
		}
	}
});

EventGroups = new Meteor.Collection("eventgroups");

var EventGroupSchema = new SimpleSchema({
	title: {
		type: String,
		max: 200,
		label: "Опис"
	},
	eventTypeId: {
		type: String,
		label: 'Вид події',
		max: 50
	},
	eventIds: {
		type: [String],
		optional: true
	},
	startedAt: {
		type: Date,
		label: 'Дата та час початку',
		optional: true
	},
	finishedAt: {
		type: Date,
		label: 'Дата та час закінчення',
		optional: true
	},
	locationId: {
		type: String,
		label: 'Місце проведення',
		max: 50
	},
	federationId: {
		type: String,
		max: 50
	}
});

EventGroups.attachSchema(EventGroupSchema);

Calendar = new Meteor.Collection("calendar");

})();
