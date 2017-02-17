var request = require('./webRequest');
var database = require('./database');
var async = require('async');
var crawlContent = require('./crawlContent');

var errHandler = function(err){
    console.log('============================');
    console.log(err.err);
    console.log('============================');
    console.log(err.data);
    //database.insert('wordError5', err);    
};
var groupTable  ='group_12';
var getGroupRemaining = function(){
    database.find(groupTable, {words: { $exists : false}}, function(results) {

        var tasks = [];
        
        let wordCount=0;
        results.each(function(err,doc){
            if(err===null && doc!==null) {
                console.log('>>' +  ++wordCount + "--->" + JSON.stringify(doc));
                tasks.push(function(callback){
                    console.log('>>' +  ++wordCount + "--->" + JSON.stringify(doc));
                    request.getJson(doc.letter, doc.groupId).then(function(data) {
                        try{
                            let words = [];
                            for(let i = 0;i < data.results.length;i++){
                                let word = data.results[i];
                                let newWord = {id: word.id, formattedDisplay : word.formattedDisplay, textDisplay: word.textDisplay };
                                words.push(newWord);                                
                            }

                            database.update(groupTable, {groupId : doc.groupId}, { words: words});                
                            callback();
                        }
                        catch(err){
                            callback();
                        }
                    }).catch(function(err){
                        callback();
                    });
                });                                
            }
        });

        var updateParallel = function() {
            wordCount=0;
            var syncTask  =[];
            while(tasks.length){
                syncTask.push(tasks.splice(0,5));    
            }
            
            console.log(syncTask[0].length);

            var waterfallTask = [];
            for(var i=0;i<syncTask.length;i++){
                waterfallTask.push(function(callback){
                    async.parallel(syncTask[i], function(){
                        console.log('parallel done');
                       // callback();
                    });
                });
            }

            async.waterfall(waterfallTask, function(err,result){
                console.log('waterfall Task complete');
            });

        };



        setTimeout(function(){
            var updateParallel = function() {
            wordCount=0;
            var syncTask  =[];
            while(tasks.length){
                syncTask.push(tasks.splice(0,5));    
            }
            
            console.log(syncTask[0].length);

            var waterfallTask = [];
            for(var i=0;i<syncTask.length;i++){
                waterfallTask.push(function(callback){
                    async.parallel(syncTask[i], function(){
                        console.log('parallel done');
                       // callback();
                    });
                });
            }

            async.waterfall(waterfallTask, function(err,result){
                    console.log('waterfall Task complete');
                });        
        };

        var updateAsync = function() {   
            wordCount=0;

            async.waterfall(tasks, function(err,result){
                    console.log('waterfall Task complete');
            });        
        };

        updateAsync();
        }, 2000);
        
    });
}

var downloadHandler = function(){    
    var wordCount = 0;
    var str = 'abcdefghijklmnopqrstuvwxyz';
    var letters = ['0-9'];
    for (var x = 0; x < 26; x++){
        letters.push(str.charAt(x));
    }

    for (var x = 0; x < letters.length; x++){
        (function(letter){
            console.log(letter);
            request.getJson(letter,'')
            .then(function(result){
                for(let groupIndex = 0; groupIndex<result.groups.length; groupIndex++){
                    let groupId = result.groups[groupIndex].url.value1;
                    console.log(">>" + ++wordCount + groupId + "::" + letter);
                    database.insert(groupTable, {letter:letter, groupId:groupId}); 
                }
            })
            .catch(errHandler);
        })(letters[x]);
    }
}

var getAllWords  =function(){
    var words = [];
    database.find(groupTable, {}, function(results){        
        var wordCount=0;
        results.each(function(err,doc) {
            if(err===null && doc!==null){
                console.log('>>' + ++wordCount);
                console.log(doc.words.length)
                words.concat(doc.words);
                database.insertArray('all_words', doc.words);
            }
        });
    });

    setTimeout(function() {
        console.log(words.length);
    }, 3000);
}

var crawlContentHandler = function() {
    database.find('all_words_1', {meaning: { $exists: false }}, function(results){ 
        console.log('=================='+results.length);  
        let count = 0;     
        results.each(function(err,doc){
            if(err===null && doc!==null){
                    crawlContent.parse(doc.id, function(data){
                   console.log('>>done crawler ' + ++count);
                    database.update('all_words_1', {id:doc.id}, {meaning:data})
                });
            }
        });        
    });
}

//database.init(downloadHandler);
//database.init(getGroupRemaining);
//database.init(getAllWords);
database.init(crawlContentHandler);
