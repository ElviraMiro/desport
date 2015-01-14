(function(){Meteor.publish('myAccount', function() {
	return [UserProfiles.find(this.userId),
		Avatars.find({"metadata.owner": this.userId}),
		UserRoles.find(this.userId)];
});

Meteor.publish("userProfile", function(uId) {
	return [
		UserProfiles.find(uId),
		Avatars.find({"metadata.owner": uId}),
		Meteor.users.find(uId)
	];});


Meteor.reactivePublish("usersForSearch", function() {
	if (this.userId) {
		var userData = UserData.findOne({_id: this.userId}, {reactive: true});
		if (userData) {
			if (userData.search) {
				var filter = userData.search
					find = userData.find;
				if (!find) {
					find = [];
				}
				var users = UserProfiles.find({$or: [
					{
						firstName: {$regex: filter.name2, $options: 'i'},
						secondName: {$regex: filter.name3, $options: 'i'},
						surname: {$regex: filter.name1, $options: 'i'},
						_id: {$ne: this.userId}
					},
					{
						_id: {$in: find}
					}
				]});
				var avatars = Avatars.find({'metadata.owner': {$in: _.pluck(users.fetch(), "_id")}});
				return [users, avatars];
			}
		}
	}
});

})();
