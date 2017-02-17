var request = require('/webRequest');
var Promise  =require('promise');
var async = require("async");
var database = require('./database');



var getAllGroups = function() {
  var getGroups = function(letter) {
      return new Promise(function(resolve, reject) {

          request.getJson({
                  dictCode: "english",
                  letter: letter,
                  groupId: "",
                  levels: "2"
              })
              .then(function(data) {
                  var groupsValue = [];
                  data.groups.forEach(function(value, index) {
                      database.insertGroup(value);
                      groupsValue.push({
                          url: value.url.value1,
                          letter: letter
                      });
                  });

                  resolve(groupsValue);
              });
      });
  };

return new Promise(function(resolve, reject){
  var asyncTask = [];
  var str = 'abcdefghijklmnopqrstuvwxyz';
  for (var x = 0; x < str.length; x++)//str.length
  {

      (function(letter){ asyncTask(function(callback){
        request.getJson({
                dictCode: "english",
                letter: letter,
                groupId: "",
                levels: "2"
            })
            .then(function(data) {
                var groupsValue = [];
                data.groups.forEach(function(value, index) {
                    database.insertGroup(value);
                    groupsValue.push({
                        url: value.url.value1,
                        letter: letter
                    });
                });

                resolve(groupsValue);
            });
        });
      })(str.charAt(x));
  }
});

}



var getWords = function(groups) {

    return new Promise(function(resolve, reject) {

        var words = [];

        function getWord(letter, groupId, wordCallback) {
            request.getJson({
                    dictCode: "english",
                    letter: letter,
                    groupId: groupId,
                    levels: "2"
                })
                .then(function(res) {
                  wordCallback( res.results);                    
                });
        }

        var words = [];
        var asyncTasks = [];
        groups.forEach(function(group, index) {
          asyncTasks.push(function(callback){
             console.log('do task ' + group.url);        
             getWord(group.letter, group.url, function(wordsList) {                              
              wordsList.forEach(function(value, index) {
                        words.push({
                            id: value.id,
                            textDisplay: value.textDisplay,
                            formattedDisplay: value.formattedDisplay
                        });
                    });
                callback();
             });
          });
        });

        async.parallel(asyncTasks, function(err, result){
          console.log('completed task: ' + words.length);          
          resolve(words);
        });
    });
}

database.init(function(){

var crawl = function(){

  var str = 'abcdefghijklmnopqrstuvwxyz';
  for (var x = 0; x < str.length; x++)//str.length
  {
    (function(letter){

    console.log('start ' + letter);
     getGroups(letter)
    .then(getWords)
    .then(function(wordsList){
      console.log('==========================================================' + letter);

      wordsList.forEach(function(word){
        database.insertWord(word);
      });
    });
    })(str.charAt(x));    
  }};


  database.findAllGroup(function(result){
    var items = [];
    result.each(function(err, item){
      if(item!=null){

        request.getWords(item).then(function(wordsList){
          console.log('==========================================================' + letter);

      wordsList.forEach(function(word){
        database.insertWord(word);
      });
    });;
        //items.push(item);
      }
    });

    console.log(items.length);
  });
});





// getJson({dictCode:"english",letter:"h",groupId:"hit-the-road",levels:"2"})
// .then(getWordsList)
// .then(function(res) {
// console.log(rest);  
// });
