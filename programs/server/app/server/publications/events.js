(function(){Meteor.publish('eventsForUser', function() {
	var userGroups = userIsUserInGroups(this.userId),
		events = Events.find({$or: [{userIds: this.userId}, {adminIds: this.userId}, {groupIds: {$in: userGroups}}]}, {fields: {eventTypeId: 1, locationId: 1}}).fetch(),
		types = [],
		locations = [];
	if (events.length > 0) {
		types = _.pluck(events, 'eventTypeId');
		locations = _.pluck(events, 'locationId');
	}
	return [
		EventTypes.find({$or: [{ownerId: this.userId}, {ownerId: null}, {_id: {$in: types}}]}),
		Locations.find({$or: [{ownerId: this.userId}, {ownerId: null}, {_id: {$in: locations}}]})
	]
});

Meteor.reactivePublish("events", function() {
	if (this.userId) {
		var calendar = Calendar.findOne({_id: this.userId}, {reactive: true});
		if (calendar) {
			if (calendar.startWeek) {
				var userGroups = userIsUserInGroups(this.userId),
					events = Events.find({$and: [{startedAt: {$gte: calendar.startWeek}}, {startedAt: {$lte: calendar.endWeek}}, {finishedAt: {$gte: calendar.startWeek}}, {finishedAt: {$lte: calendar.endWeek}}], $or: [{userIds: this.userId}, {adminIds: this.userId}, {groupIds: {$in: userGroups}}]});
				return events;
			}
		}
	}
});

})();
