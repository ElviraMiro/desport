(function(){Regions = new Meteor.Collection("regions");

var RegionSchema = new SimpleSchema({
	title: {
		type: String,
		label: 'Назва регіону/населеного пункту',
		max: 200
	},
	parentId: {
		type: String,
		max: 50,
		optional: true
	},
	regions: {
		type: [String],
		optional: true
	}
});

Regions.attachSchema(RegionSchema);

Regions.before.insert(function(userId, doc) {
	var parentId = doc.parentId;
	if (parentId) {
		var parent = Regions.findOne(parentId),
			parents = [parent._id];
		while (parent && parent.parentId) {
			parent = Regions.findOne(parent.parentId);
			parents.push(parent._id);
		}
	}
	doc.regions = parents;
});

Locations = new Meteor.Collection("locations");

var LocationSchema = new SimpleSchema({
	title: {
		type: String,
		label: 'Назва місця',
		max: 200
	},
	ownerId: {
		type: String,
		max: 50
	}
});

Locations.attachSchema(LocationSchema);


})();
