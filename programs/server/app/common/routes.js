(function(){Router.configure({
  notFoundTemplate: 'notFound',
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function () {

  this.route('calendar', {
    path: '/', 
    template: 'start',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      /*var startWeek = moment(new Date);
      startWeek = startWeek.startOf("week").add(1, "days");
      startWeek = startWeek.toDate();
      Session.set("startWeek", startWeek);*/
      return [
        Meteor.subscribe("eventsForUser"),
        Meteor.subscribe("events"),
        Meteor.subscribe("usersForSearch")
      ];
    }
  });

  this.route('profile', {
    path: '/profile/:id', 
    template: 'profile',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      Session.set("selectedUserId", this.params.id);
      return [
        Meteor.subscribe("userProfile", Session.get("selectedUserId"))
      ];
    }
  });

  this.route('info', {
    path: '/info', 
    template: 'info',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [
        Meteor.subscribe("sports"),
        Meteor.subscribe("sportFederations"),
        Meteor.subscribe("regions")
      ];
    }
  });

  this.route('regions', {
    path: '/regions', 
    template: 'regions',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [Meteor.subscribe("regions")];
    }
  });

  this.route('sports', {
    path: '/sports', 
    template: 'sports',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      return [Meteor.subscribe("sports")];
    }
  });

  this.route('sportfederations', {
    path: '/sport/:id/federations', 
    template: 'sportfederations',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      Session.set("selectedSportId", this.params.id);
      return [Meteor.subscribe("federationsInSport", Session.get("selectedSportId"))];
    }
  });

  this.route('federation', {
    path: '/sport/:sportId/federation/:federationId', 
    template: 'federation',
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
      Session.set("selectedSportId", this.params.sportId);
      Session.set("selectedFederationId", this.params.federationId);
      return [
        Meteor.subscribe("federation", Session.get("selectedFederationId")),
        Meteor.subscribe("usersForSearch")
      ];
    }
  });

});

if (Meteor.isClient) {
  Router.onBeforeAction(function() {
    if (! Meteor.userId()) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        this.render('notSign');
      }
    } else {
      this.next();
    }
  });
}

})();
