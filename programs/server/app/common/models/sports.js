(function(){Sports = new Meteor.Collection("sports");

var SportSchema = new SimpleSchema({
	title: {
		type: String,
		label: 'Вид спорту',
		max: 200
	}
});

Sports.attachSchema(SportSchema);

Qualifications = new Meteor.Collection("qualifications");

var QualificationSchema = new SimpleSchema({
	title: {
		type: String,
		label: 'Назва оцінки',
		max: 200
	},
	federationId: {
		type: String,
		label: "Назва спортивного об'єднання",
		max: 50
	},
	sportId: {
		type: String,
		max: 50,
		optional: true
	},
	min: {
		type: Number,
		label: 'Мінімальна оцінка'
	},
	max: {
		type: Number,
		label: 'Максимальна оцінка'
	},
	description: {
		type: String,
		label: 'Опис оцінки',
		optional: true
	}
});

Qualifications.attachSchema(QualificationSchema);

Qualifications.before.insert(function(userId, doc) {
	var federation = Federations.findOne(doc.federationId);
	if (federation) {
		var sport = Sports.findOne(federation.sportId);
		if (sport) {
			doc.sportId = sport._id;
		}
	}
});


Values = new Meteor.Collection("values");

var ValueSchema = new SimpleSchema({
	qualificationId: {
		type: String,
		max: 50
	},
	qualification: {
		type: String,
		max: 200,
		optional: true
	},
	eventId: {
		type: String,
		max: 50,
		optional: true
	},
	authorId: {
		type: String,
		max: 50
	},
	destionationId: {
		type: String,
		max: 50
	}
});

Values.attachSchema(ValueSchema);

Values.before.insert(function(userId, doc) {
	var qualificationId = doc.qualificationId;
	if (qualificationId) {
		var qualification = Qualifications.findOne(qualificationId);
		if (qualification) {
			doc.qualification = qualification.title;
		}
	}
});

})();
