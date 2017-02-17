
var database = {
    _db : '',
    init : function(completed) {

        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost:27017/cambridge';

        MongoClient.connect(url, function(err, db) {

            _db = db;
            console.log("Connected correctly to server.");
            completed();
        });

        return this;
    },
    close : function() {

        _db.close();
    },

    insert:function(table, data){
        var insertDocument = function(word) {
            _db.collection(table).insertOne(word, function(err, result) {
                if(err!==null){
                    console.log(err);
                }
                else {
                    console.log('---------- inserted');
                }
            });
        };

        insertDocument(data);
        return this;
    },
    insertArray:function(table, data){
        var insertDocument = function(word) {
            _db.collection(table).insert(word, function(err, result) {
                if(err!==null){
                    console.log(err);
                }
                else {
                    console.log('---------- array inserted ');
                }
            });
        };

        insertDocument(data);
        return this;
    },
    find : function(table, whereClause, results) {
        results(_db.collection(table).find(whereClause));
    },
    
    update: function(table, where, data) {

        _db.collection(table).update(where, {$set : data}, function(err, result) {

            //console.log(where);
            if (err == null) {
                console.log("update status: OK");
            } else {
                console.log(err);
            }
        });

        return this;
    },
    findAllGroup : function(results) {
        results(_db.collection('group').find({}));
    }
};

module.exports = database;
