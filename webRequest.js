var request = require('request');
var webRequest = {
    getJson: function(letter, groupId) {

        return new Promise(function(resolve, reject) {
            var options = {
                url: 'http://dictionary.cambridge.org/browse/brws',
                method: 'POST',
                headers: {
                    'User-Agent': 'request',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Origin': 'http://dictionary.cambridge.org',
                    'X-DevTools-Emulate-Network-Conditions-Client-Id': '0ad10cb0-63a8-44bc-a4e1-f21f28f57a81',
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Referer': 'http://dictionary.cambridge.org/dictionary/english/',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
                    'Cookie': 'localisation=VN; __gads=ID=f8c0059d0bedcb1f:T=1457486230:S=ALNI_MZu6_I2Ro2hvezPND-tG8XaCPEwKg; uniqueKey=FF8094863900C8469054B25EDFDBC4017DDB5535; notifications=cookiewarning; preferedListDictCode=english%3Bbritish-grammar%3Benglish-french%3Bfrench-english; _gat=1; _ga=GA1.3.1963817676.1457486230; beta-redesign=active; LoginPopup=3; pl_did=8662b4dd-dfd5-4f95-bb2e-f47b2659994b; pl_p=cdo-p13|cdo-p1|cdo-p15|cdo-ff; localisation=VN; __gads=ID=f8c0059d0bedcb1f:T=1457486230:S=ALNI_MZu6_I2Ro2hvezPND-tG8XaCPEwKg; uniqueKey=FF8094863900C8469054B25EDFDBC4017DDB5535; notifications=cookiewarning; preferedListDictCode=english%3Bbritish-grammar%3Benglish-french%3Bfrench-english; _ga=GA1.3.1963817676.1457486230; beta-redesign=active; LoginPopup=19; pl_did=8662b4dd-dfd5-4f95-bb2e-f47b2659994b; pl_p=cdo-p15|cdo-p13|cdo-p1|cdo-ff'
                },
                body: JSON.stringify({
                    dictCode: "english",
                    letter: letter,
                    groupId: groupId,
                    levels: "2"
                }),
            };

            function callback(error, response, body) {

                if (!error && response.statusCode == 200) {
                    try {
                        var info = JSON.parse(body);
                        resolve(info);
                    } catch (err) {
                        reject({err: err, data: {letter: letter, groupId: groupId }});
                    }
                } else {
                    reject({err: error, data: {letter: letter, groupId: groupId }});
                }
            }

            request.post(options, callback);
        });
    }
};

module.exports = webRequest;