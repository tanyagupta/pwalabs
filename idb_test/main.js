(function() {
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
})();
