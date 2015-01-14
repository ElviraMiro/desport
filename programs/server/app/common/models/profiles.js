(function(){UserData = new Meteor.Collection("userdata");

UserRoles = new Meteor.Collection("userroles");

UserProfiles = new Meteor.Collection("userprofiles");

var UserProfileSchema = new SimpleSchema({
	firstName: {
		type: String,
		label: "Ім'я",
		max: 100,
		optional: true
	},
	secondName: {
		type: String,
		label: "По-батькові",
		max: 100,
		optional: true
	},
	surname: {
		type: String,
		label: "Фамілія",
		max: 100,
		optional: true
	},
	phones: {
		type: String,
		label: "Телефони",
		max: 250,
		optional: true
	},
	address: {
		type: String,
		label: "Адреса",
		max: 250,
		optional: true
	},
	userId: {
		type: String,
		max: 50,
		optional: true
	},
	email: {
		type: String,
		optional: true
	}
});

UserProfiles.attachSchema(UserProfileSchema);

UserProfiles.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	}
});

UserProfiles.before.insert(function(userId, doc) {
	doc._id = doc.userId;
});

var avatarStore = new FS.Store.GridFS("avatars", {
	transformWrite:  function(fileObj, readStream, writeStream) {
		gm(readStream, fileObj.name).resize('256^', '256^').gravity('Center').crop('256','256').stream().pipe(writeStream);
	},
	maxTries: 1,
	filter: {
		allow: {
			contentTypes: ['image/*']
		}
	}
});

Avatars = new FS.Collection("avatars", {
	stores: [avatarStore]
});

Avatars.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		return true;
	},
	remove: function(userId, doc) {
		return true;
	},
	download:function(){
		return true;
	}
});

Meteor.users.after.insert(function(userId, doc) {
	var uId = doc._id;
	UserProfiles.insert({_id: uId, email: doc.emails[0].address});
});

})();
