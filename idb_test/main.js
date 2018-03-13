var idbApp = (function() {
  'use strict';

  //check for support
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  var dbPromise = idb.open('civicstest', 1, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
    upgradeDb.createObjectStore('questions', {keyPath: 'id'});
  }
});


  function getQuestions() {
    var s = '';
    dbPromise.then(function(db) {
      var tx = db.transaction('questions', 'readonly');
      var store = tx.objectStore('questions');
      return store.openCursor();
    }).then(function showRange(cursor) {
      if (!cursor) {return;}
      console.log('Cursored at:', cursor.value.name);

      s += '<h2>' + cursor.value.id + '</h2><p>';
      for (var field in cursor.value) {
        s += field + '=' + cursor.value[field] + '<br/>';
      }
      s += '</p>';

      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {s = '<p>No results.</p>';}
      document.getElementById('questions').innerHTML = s;
    });

  }

function addQuestions(){
dbPromise.then(function(db) {
var tx = db.transaction('questions', 'readwrite');
var store = tx.objectStore('questions');
var items = [
  {
    question: 'What is the supreme law of the land?',
    id: '1',
    answer: "The Constitution",
  },
  {
    question: 'What does the Constitution do?',
    id: '2',
    answer: "Protects basic rights of Americans",
  },
  {
    question: 'The idea of self-government is in the first three words of the Constitution. What are these words?',
    id: '3',
    answer: "We the People",
  },

];
return Promise.all(items.map(function(item) {
    console.log('Adding item: ', item);
    return store.add(item);
  })
).catch(function(e) {
  tx.abort();
  console.log(e);
}).then(function() {
  console.log('All items added successfully!');
});
})
}

return {
    dbPromise: (dbPromise),
     getQuestions: (getQuestions),
     addQuestions: (addQuestions),
}
})();
