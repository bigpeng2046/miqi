// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var sqlDB = null;

angular.module('miqi', ['ionic', 'miqi.controllers', 'miqi.services', 'ngCordova', 'ngWebSocket'])

.run(function($ionicPlatform, $ionicPopup, $ionicHistory, $cordovaSQLite, $cordovaToast) {
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
    if (ionic.Platform.isWebView()) {
		sqlDB = $cordovaSQLite.openDB("liteDB.db");
		$cordovaSQLite.execute(sqlDB, "CREATE TABLE IF NOT EXISTS credentials (id INTEGER NOT NULL PRIMARY KEY, name text, user_name text, password text)");
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

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  
  .state('tab.new', {
    url: '/new',
    views: {
      'tab-new': {
        templateUrl: 'templates/new.html',
		controller: 'NewCtrl'
      }
    }
  })
  
	.state('tab.credentials', {
	  url: '/credentials',
	  views: {
		'tab-credentials': {
		  templateUrl: 'templates/credentials.html',
		  controller: 'CredentialsCtrl'
		}
	  }
	})
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/credentials');
});
