(function(){getProfileName = function(uId) {
	var userProfile = UserProfiles.findOne(uId),
		user = Meteor.users.findOne(uId);
	if (userProfile && userProfile.surname) {
		var name1 = userProfile.surname,
			name2 = userProfile.firstName,
			name3 = userProfile.secondName;
		if (!name1) name1 = "";
		if (!name2) name2 = "";
		if (!name3) name3 = "";
		return name1.concat(" ", name2, " ", name3);
	} else {
		return user.emails[0].address;
	}
};

getUserName = function(uId) {
	var userProfile = UserProfiles.findOne(uId);
	if (userProfile && userProfile.surname) {
		var name1 = userProfile.surname,
			name2 = userProfile.firstName,
			name3 = userProfile.secondName;
		if (!name1) name1 = "";
		if (!name2) name2 = "";
		if (!name3) name3 = "";
		return name1.concat(" ", name2, " ", name3);
	} else {
		return "Не заповнено користувачем";
	}
};

getUserEmail = function(uId) {
	var userProfile = UserProfiles.findOne(uId),
		user = Meteor.users.findOne(uId);
	if (userProfile.email) {
		return userProfile.email;
	} else {
		if (user.emails) {
			return user.emails[0].address;
		} else {
			return "Анонім"
		}
	}
};

getUserPhone = function(uId) {
	var userProfile = UserProfiles.findOne(uId);
	if (userProfile && userProfile.phones) {
		return userProfile.phones;
	} else {
		return "Не заповнено користувачем";
	}
};

getAvatarURL = function(uId) {
	var avatar = Avatars.findOne({"metadata.owner": uId});
	if (avatar) {
		return avatar.url();
	} else {
		return "/images/anonim.png";
	}
};

removeFromArray = function(array, value) {
	var idx = array.indexOf(value);
	if (idx != -1) {
		return array.splice(idx, 1);
	}
	return array;
};

userIsInUsersInFederations = function(uId) {
	var federations = Federations.find({userIds: uId}).fetch(),
		result = [];
	for (var i=0; i<federations.length; i++) {
		result.push(federations[i]._id);
	}
	return result;
};

userIsAdminInFederations = function(uId) {
	var federations = Federations.find({adminIds: uId}).fetch(),
		result = [];
	for (var i=0; i<federations.length; i++) {
		result.push(federations[i]._id);
	}
	return result;
};

userIsMemberInFederations = function(uId) {
	var groups = Groups.find({userIds: uId}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		if (result.indexOf(groups[0].federationId) != -1) {
			result.push(groups[i].federationId);
		}
	}
	return result;
};

userIsTrainerInFederations = function(uId) {
	var groups = Groups.find({adminIds: uId}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		if (result.indexOf(groups[0].federationId) != -1) {
			result.push(groups[i].federationId);
		}
	}
	return result;
};

userIsUserInGroups = function(uId) {
	var groups = Groups.find({userIds: uId}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		result.push(groups[i]._id);
	}
	return result;
};

userIsAdminInGroups = function(uId) {
	var groups = Groups.find({adminIds: uId}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		result.push(groups[i]._id);
	}
	return result;
};

sportsForUser = function(uId) {
	var groups = Groups.find({$or: [{_id: {$in: userIsAdminInGroups(uId)}}, {_id: {$in: userIsUserInGroups(uId)}}]}).fetch(),
		federation = Federations.find({_id: {$in: userIsAdminInFederations(uId)}}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		if (result.indexOf(groups[i].sportId) == -1) {
			result.push(groups[i].sportId);
		}
	}
	for (var i=0; i<federations.length; i++) {
		if (result.indexOf(federations[i].sportId) == -1) {
			result.push(federations[i].sportId);
		}
	}
	return result;
};

membersInFederation = function(fId) {
	var groups = Groups.find({federationId: fId}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		for (var j=0; j<groups[i].userIds.length; j++) {
			if (result.indexOf(groups[i].userIds[j]) != -1) {
				result.push(groups[i].userIds[j]);
			}
		}
	}
	return result;
};

trainersInFederation = function(fId) {
	var groups = Groups.find({federationId: fId}).fetch(),
		result = [];
	for (var i=0; i<groups.length; i++) {
		for (var j=0; j<groups[i].adminIds.length; j++) {
			if (result.indexOf(groups[i].adminIds[j]) != -1) {
				result.push(groups[i].adminIds[j]);
			}
		}
	}
	return result;
};

addDownRegionsInHierarchy = function(region, padding, result) {
	var regions = Regions.find({parentId: region._id}).fetch();
	for (var i=0; i<regions.length; i++) {
		result.push({region: regions[i], padding: padding});
		if (regions[i].parentId) {
			addDownRegionsInHierarchy(regions[i], padding+1, result);
		}
	}
};

getRegionsHierarchy = function() {
	var regions = Regions.find({parentId: null}).fetch(),
		padding = 0,
		result = [];
	for (var i=0; i<regions.length; i++) {
		result.push({region: regions[i], padding: padding});
		addDownRegionsInHierarchy(regions[i], padding+1, result);
	}
	return result;
};

addDownFederationsInHierarchy = function(federation, padding, result) {
	var federations = Federations.find({parentId: federation._id}).fetch();
	for (var i=0; i<federations.length; i++) {
		result.push({federation: federations[i], padding: padding});
		if (federations[i].parentId) {
			addDownFederationsInHierarchy(federations[i], padding+1, result);
		}
	}
};

getFederationsHierarchy = function(sportId) {
	var federations = Federations.find({parentId: null, sportId: sportId}).fetch(),
		padding = 0,
		result = [];
	for (var i=0; i<federations.length; i++) {
		result.push({federation: federations[i], padding: padding});
		addDownFederationsInHierarchy(federations[i], padding+1, result);
	}
	return result;
};

filteredUserQuery = function(filter, arrayNo) {
	var queryLimit = 25,
		users = [];
	if(!!filter) {
		users = UserProfiles.find({
			firstName: {$regex: filter.name2, $options: 'i'},
			secondName: {$regex: filter.name3, $options: 'i'},
			surname: {$regex: filter.name1, $options: 'i'},
			_id: {$nin: arrayNo}
		}, {limit: queryLimit});
	}
	return users;
};


})();
