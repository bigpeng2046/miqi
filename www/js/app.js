// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var sqlDB = null;
angular.module('miqi', ['ionic', 'miqi.controllers', 'miqi.services', 'ngCordova', 'ngWebSocket'])

.run(function($ionicPlatform, $cordovaSQLite, $ionicPopup, $ionicHistory, $cordovaToast) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	
    // Open the SQLite DB, but only possible on device
    if (ionic.Platform.isWebView()){
      sqlDB = $cordovaSQLite.openDB("liteDB.db");
    }

	$ionicPlatform.registerBackButtonAction(function (e) {
		function showConfirm() {
			var confirmPopup = $ionicPopup.confirm({
				title: '<strong>Exit</strong>',
				template: 'Are you sure to exit the application?',
				okText: 'Exit',
				cancelText: 'Cancel'
			});

			confirmPopup.then(function (res) {
				if (res) {
					ionic.Platform.exitApp();
				} else {
					// Don't close
				}
			});
		}

		if ($ionicHistory.backView() ) {
			$ionicHistory.goBack();
		} else {
			showConfirm();
		}
		
		e.preventDefault();
		return false;
	}, 101);
	
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.scan', {
    url: '/scan',
    views: {
      'menuContent': {
        templateUrl: 'templates/scan.html',
		controller: 'ScanCtrl'
      }
    }
  })
	
	.state('app.credentials', {
	  url: '/credentials',
	  views: {
		'menuContent': {
		  templateUrl: 'templates/credentials.html',
		  controller: 'CredentialsCtrl'
		}
	  }
	})

  .state('app.single', {
    url: '/credentials/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/scan');
});
