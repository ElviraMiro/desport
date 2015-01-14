(function(){Meteor.publish("federationsInSport", function(sId) {
	var federations = Federations.find({sportId: sId}).fetch(),
		admins = [],
		contacts = [];
	for (var i=0; i<federations.length; i++) {
		if (federations.admins) {
			admins = admins.concat(federations[i].admins);
		}
		if (federations.contacts) {
			contacts = contacts.concat(federations[i].contacts);
		}
	}
	return [
		Sports.find({_id: sId}),
		Federations.find({sportId: sId}),
		Regions.find()
	]
});

Meteor.publish("federation", function(fId) {
	var federation = Federations.findOne(fId),
		admins = [],
		contacts = [];
	if (federation.admins) {
		admins = federation.admins;
	}
	if (federation.contacts) {
		contacts = federation.contacts;
	}
	return [
		Sports.find({_id: federation.sportId}),
		Federations.find({$or: [{_id: fId}, {_id: federation.parentId}]}),
		Meteor.users.find({$or: [{_id: {$in: admins}}, {_id: {$in: _.pluck(contacts, "profileId")}}]}),
		UserProfiles.find({$or: [{_id: {$in: admins}}, {_id: {$in: _.pluck(contacts, "profileId")}}]}),
		Avatars.find({$or: [{"metadata.owner": {$in: admins}}, {'metadata.owner': {$in: _.pluck(contacts, "profileId")}}, {'metadata.owner': fId}]}),
		Regions.find({_id: federation.locationId})
	]
});

Meteor.publish("sportFederations", function(sId) {
	return Federations.find();
});

})();
