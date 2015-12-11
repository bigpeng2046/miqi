angular.module('miqi.services', [])

.factory('CredentialDAO', function($cordovaSQLite) {
	return {
		add: function(credential) {
			var query = "INSERT INTO credentials (name,user_name,password) VALUES (?,?,?)";
			return $cordovaSQLite.execute(sqlDB, query, [credential.name, credential.userName, credential.password]);
		},

		remove: function(id) {
		    var query = "DELETE FROM credentials WHERE id = ?";
			$cordovaSQLite.execute(sqlDB, query, [id]);
		},

		trans: function(id) {
		    var query = "SELECT id,name,user_name,password FROM credentials WHERE id=?";
			return $cordovaSQLite.execute(sqlDB, query, [id]);
		},

		all: function() {
			var query = "SELECT id,name,user_name,password FROM credentials";
			return $cordovaSQLite.execute(sqlDB, query);
		},
		
	};
})

.factory('Transmition', function($cordovaBarcodeScanner, $websocket) {
	var parseBarcodeInfo = function(result) {
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

	var send = function(headers, userName, password) {
		var ws = $websocket("ws://" + headers["Hosts"] + ":" + headers["Port"]);

		ws.onOpen(function() {
			ws.send("SET-CREDENTIAL MIQI/1.0\r\n"
				+ "ClientId:" + headers["ClientId"] + "\r\n"
				+ "UserName:" + userName + "\r\n"
				+ "Password:" + password + "\r\n");
			ws.close();
		});
	};
	
	return {
		trans: function(userName, password) {
		  document.addEventListener("deviceready", function () {
			alert("continue?");
			
			$cordovaBarcodeScanner
			  .scan()
			  .then(function(result) {
				if (!result.cancelled) {
					send(parseBarcodeInfo(result.text), userName, password);
				}
			  }, function(error) {
				alert("error!");
			  });

		  }, false);			
		},
	};
});
