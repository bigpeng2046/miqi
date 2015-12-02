angular.module('miqi.services', [])

.factory('Phrases', function() {
  // Might use a resource here that returns a JSON array

  var awesomeData = [{
    id: 0,
    name: 'palaver',
    definition: 'prolonged and idle discussion, utter waste of time'
  }, {
    id: 1,
    name: 'Gordon Bennett',
    definition: 'Woah, .. To be surprised'
  }, {
    id: 2,
    name: 'chinwag',
    definition: 'chat, gossip, catch up among a group'
  }, {
    id: 3,
    name: 'cop the needle',
    definition: 'to become annoyed or angry'
  }, {
    id: 4,
    name: 'knees up',
    definition: 'an awesome party time'
  }, {
    id: 5,
    name: 'codswallop',
    definition: 'Rubbish, nonsense'
  }];

  return {
    all: function() {
      return awesomeData;
    },
    remove: function(phrase) {
      awesomeData.splice(awesomeData.indexOf(phrase), 1);
    },
    get: function(phraseId) {
      for (var i = 0; i < awesomeData.length; i++) {
        if (awesomeData[i].id === parseInt(phraseId)) {
          return awesomeData[i];
        }
      }
      return null;
    }
  };
})

.factory('PhraseDAO', function($cordovaSQLite) {
	return {
		addPhrase: function(phrase) {
			var query = "INSERT INTO sqltable (name) VALUES (?)";
			return $cordovaSQLite.execute(sqlDB, query, [phrase]);
		},

		removePhrase: function(id) {
		    var query = "DELETE FROM sqltable WHERE id = ?";
			$cordovaSQLite.execute(sqlDB, query, [id]);
		},

		transPhrase: function(id) {
		    var query = "SELECT id, name FROM sqltable WHERE id = ?";
			$cordovaSQLite.execute(sqlDB, query, [id]);
		},

		retrievePhrases: function() {
			var query = "SELECT id, name FROM sqltable";
			return $cordovaSQLite.execute(sqlDB, query);
		},
		
	};
});
