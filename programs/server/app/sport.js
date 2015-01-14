(function(){if (Meteor.isClient) {
	Meteor.subscribe('userPresence');
	Meteor.subscribe('myAccount');
	toastr.options = {
		"closeButton": true,
		"debug": false,
		"progressBar": true,
		"positionClass": "toast-top-right",
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
	T9n.setLanguage('uk');
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		process.env.MAIL_URL = "smtp://robot@educom.io:6d82ef183c48e95bace@smtp.yandex.ru:465/";
		var user = Meteor.users.findOne({"emails.address": "karashistka@yandex.ru"});
		if (user) {
			//Roles.addUsersToRoles(user, "admin", Roles.GLOBAL_GROUP);
		}
	});
}

})();
