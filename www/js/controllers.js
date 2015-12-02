angular.module('miqi.controllers', [])

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

.controller('CredentialsCtrl', function($scope, CredentialDAO, Transmition) {

	//Checking for webView for SQLite compataility, only available on native
	$scope.webView = ionic.Platform.isWebView();
	$scope.shouldShowDelete = false;

    //Remove data from SQLite 
    $scope.removeData = function(index, exampleId){
    	$scope.storedData.splice(index, 1);
		CredentialDAO.remove(exampleId);
    };

    $scope.transData = function(index, exampleId){
	    CredentialDAO.trans(exampleId).then(function(res) {
			var row = res.rows.item(0);
			// alert(row["name"] + " " + row["id"]);
			Transmition.trans(row['user_name'], row['password']);
	    }, function (err) {
			console.error(err);
	    });
    };
	
    $scope.showDelete = function() {
    	$scope.shouldShowDelete = !$scope.shouldShowDelete;
    };

	$scope.$on('$ionicView.beforeEnter', function() {
		// wait for sqlDB ready
		setTimeout(function() {
			$scope.storedData = [];
			if ($scope.webView){
				CredentialDAO.all().then(function(res) {
					for (var i = 0; i < res.rows.length; i++) {
					  var row = res.rows.item(i);
					  $scope.storedData.push(row);
					  if (i == res.rows.length - 1){
						console.log("WebSQL Data: " + JSON.stringify($scope.storedData));
					  }
					}
				}, function (err) {
					console.error(err);
				});
			} else {
				$scope.storedData = [];
			}
		}, 500);
	}); 

})

.controller('NewCtrl', function($scope, $state, CredentialDAO) {
	$scope.credential = { name: 'Sina', userName: 'kelvin', password: '12345678' };
	
	$scope.doSave = function() {
		CredentialDAO.add($scope.credential).then(function(res) {
			$state.go('tab.credentials');
		}, function (err) {
			console.error(err);
		});
	};
	
});
