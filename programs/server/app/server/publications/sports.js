(function(){Meteor.publish('sports', function() {
	return Sports.find();
});

Meteor.publish("sport", function(sId) {
	var sport = Sports.findOne(sId);
	return [
		Sports.find({_id: sId}),
		Meteor.users.find({_id: {$in: sport.admins}}),
		UserProfiles.find({_id: {$in: sport.admins}}),
		Avatars.find({"metadata.owner": {$in: sport.admins}})
	]
});

})();
