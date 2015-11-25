angular.module('miqi.controllers', ['ngCordova', 'ngWebSocket'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner, $websocket) {
	$scope.barcodeInfo = {};
	
	$scope.$on("$ionicView.enter", function(evt) {
	  document.addEventListener("deviceready", function () {

		$cordovaBarcodeScanner
		  .scan()
		  .then(function(result) {
			if (!result.cancelled) {
				$scope.barcodeInfo = $scope.parseBarcodeInfo(result.text);
			}
		  }, function(error) {
			alert("error!");
		  });

	  }, false);
	});
	
	$scope.doSend = function() {
		var ws = $websocket("ws://" + $scope.barcodeInfo["Hosts"] + ":" + $scope.barcodeInfo["Port"]);

		ws.onOpen(function() {
			ws.send("SET-CREDENTIAL MIQI/1.0\r\nClientId:" + $scope.barcodeInfo["ClientId"]+"\r\n");
			ws.close();
		});
	};
	
	$scope.parseBarcodeInfo = function(result) {
		var headers = {};
		var pairs = result.split("\r\n");	
		var pair;

		for (pair in pairs) {
			var temp = pairs[pair].split(":");
			if (temp)
				headers[temp[0]] = temp[1];
		}

		return headers;
	};
	
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
