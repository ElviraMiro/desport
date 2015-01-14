(function(){Federations = new Meteor.Collection("federations");

var FederationSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Назва спортивного об'єднання",
    max: 200
  },
  parentId: {
    type: String,
    label: "Головна структура",
    max: 50,
    optional: true
  },
  address: {
    type: String,
    label: "Адреса",
    max: 200,
    optional: true
  },
  phones: {
    type: String,
    label: "Телефони",
    max: 200,
    optional: true
  },
  userIds: {
    type: [String],
    label: "Перелік користувачів",
    optional: true
  },
  contacts: {
    type: [Object],
    label: "Перелік користувачів",
    optional: true
  },
  'contacts.$.profileId': {
    type: String,
    max: 50
  },
  'contacts.$.position': {
    type: String,
    label: 'Должность',
    max: 100
  },
  locationId: {
    type: String,
    max: 50
  },
  sportId: {
    type: String,
    label: "Вид спорту",
    max: 50
  },
  adminIds: {
    type: [String],
    label: 'Адміністратори',
    optional: true
  },
  federations: {
    type: [String],
    optional: true
  }
});

Federations.attachSchema(FederationSchema);

Federations.before.insert(function(userId, doc) {
  var parentId = doc.parentId;
  if (parentId) {
    var parent = Federations.findOne(parentId),
      parents = [parent._id];
    while (parent && parent.parentId) {
      parent = Federations.findOne(parent.parentId);
      parents.push(parent._id);
    }
  }
  doc.federations = parents;
});

})();
