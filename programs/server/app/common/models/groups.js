(function(){Groups = new Meteor.Collection("groups");

var GroupSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Назва",
    max: 200
  },
  regionId: {
    type: String,
    label: "Регіон/населений пункт",
    max: 50
  },
  federationId: {
    type: String,
    label: "Спортивне об'єднання",
    max: 50
  },
  sportId: {
    type: String,
    label: "Вид спорту",
    max: 50,
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
  }
});

Groups.attachSchema(GroupSchema);

Groups.before.insert(function(userId, doc) {
  var federation = Federations.findOne(doc.federationId);
  if (federation) {
    doc.sportId = federation.sportId;
  }
});

})();
