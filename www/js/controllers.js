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

.controller('CredentialsCtrl', function($scope, Phrases, PhraseDAO) {

	//Checking for webView for SQLite compataility, only available on native
	$scope.webView = ionic.Platform.isWebView();

	$scope.shouldShowDelete = false;
	// Get phrases from services.js Phrases Factory
	$scope.phrases = Phrases.all();

	$scope.ctrlData = {
      selectedPhrase : {"name" : "palaver"}, // <-- this is the default item
      newPhrase : {"name" : ""}
    };

    //Add data to SQLite 
    $scope.addData = function(){
    	var phraseToAdd = '';
    	if ($scope.ctrlData.newPhrase.name !== ""){
			phraseToAdd = $scope.ctrlData.newPhrase.name;
    	} else {
    		phraseToAdd = $scope.ctrlData.selectedPhrase.name;
    	}
		
		PhraseDAO.addPhrase(phraseToAdd).then(function(res) {
			$scope.storedData.push({"id": res.insertId, "name": phraseToAdd});
		}, function (err) {
			console.error(err);
		});
		
    	$scope.ctrlData.newPhrase.name = '';
    };

    //Remove data from SQLite 
    $scope.removeData = function(index, exampleId){
    	$scope.storedData.splice(index, 1);
		PhraseDAO.removePhrase(exampleId);
    };

    $scope.transData = function(index, exampleId){
	    PhraseDAO.transPhrase(exampleId).then(function(res) {
			var row = res.rows.item(0);
			alert(row["name"] + " " + row["id"]);
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
				PhraseDAO.retrievePhrases().then(function(res) {
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

.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner, $websocket) {
	$scope.barcodeInfo = {};
	
	$scope.$on("$ionicView.beforeEnter", function(evt) {
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
