_http = require('http');
var jsdom = require('jsdom');
var fs = require("fs");
var jquery = fs.readFileSync("./jquery.js", "utf-8");
var tidy = require('htmltidy').tidy;
var fs = require('fs');
var cheerio  =require('cheerio');

_http.globalAgent.maxSockets = 2;

module.exports = {
    getWordContent: function(wordId, bodyCallback){
        _http.get('http://dictionary.cambridge.org/dictionary/english/' + wordId, function(res) {

            var body = '';
            res.on('data', function(data) {

                body += data;
            });

            res.on('end', function() {
                bodyCallback(body);
            });
        });
    },
     parse : function(wordId, callback) {
         this.getWordContent(wordId, function(htmlBody){

            jsdom.env({
                html: htmlBody,
                src: [jquery],
                done: function(err, window) {

                    var $ = window.$;

                    $('.see-all-translations').remove();
                    $('.js-share').remove();
                    $('.definition-src').remove();
                    $('.di-head').remove();
                    var voices = [];

                    var britishEnglish = $(".tabs__content[data-tab='ds-british'] .entry-body")[0];
                    if(britishEnglish!==undefined){
                        britishEnglish = britishEnglish.innerHTML;
                        voices.push({british: britishEnglish});
                        //var Q = cheerio.load(britishEnglish);
                        //Q('.entry-body__el').each(function(i,value){
                         //    var k = $(this).children('[pron-region="UK"] .uk .pron .ipa').text();
                        //     console.log(k);
                        //});

                        // for(var i=0;i<t.length;t++){
                        //     var category = t[i];
                        //     var proEngilish1 = category.children('[pron-region="UK"] .uk .pron .ipa').html();
                        // }
                        var c=0;
                    }

                    var americanEnglish = $(".tabs__content[data-tab='ds-american-english'] .entry-body")[0];
                    if(americanEnglish!==undefined){
                        americanEnglish = americanEnglish.innerHTML;
                        voices.push({american: americanEnglish});
                    };

                     var bussinessEnglish = $(".tabs__content[data-tab='ds-business-english'] .entry-body")[0];
                    if(bussinessEnglish!==undefined){
                        bussinessEnglish = bussinessEnglish.innerHTML;
                        voices.push({bussiness: bussinessEnglish});
                    };
                    callback(voices);                   
                }
            });
        });            
    }
}