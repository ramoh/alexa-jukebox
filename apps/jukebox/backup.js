var alexa = require("alexa-app");
var chatskills = require("chatskills");
var readLineSync = require("readline-sync");
var xml2js = require("xml2js").parseString;
var request = require("request");
var deasync = require("deasync");
var cheerio = require("cheerio");

var GoogleSearch = require('google-search');
var googleSearch = new GoogleSearch({
  key: 'AIzaSyDOAFXf7qmkOGS4DnWEJifUkFVFB22xspk',
  cx: '008044490165455818569:moplxs3eswg'
});

const searchSite = "http://www.fullmp3fun.com/";
googleSearch.build({
  q: "Bettels",
  num: 10, // Number of search results to return between 1 and 10, inclusive
  siteSearch: searchSite // Restricts results to URLs from a specified site
}, function(error, response) {
  if (error)
    console.log(error);


  console.log(response);
  console.log(response.searchInformation.totalResults != '0');
  if (response.searchInformation.totalResults != '0') {
    console.log("+++++++i found your song!!!!+++++");
    var url = response.items[0].link;
    console.log("++++++Here is the URL : " + response.items[0].link);

    request(url, function(error, response, body) {
      if (error)
        console.log(error)
      else {
        var $ = cheerio.load(body);
        var downloadLink = $(".dwnLink")[0].attribs.href;
        //console.log(body);
        console.log("Your download link is :" + searchSite +
          downloadLink);


      }

    });

  }
});

/*
var LastfmAPI = require("lastfmapi");

var lfm = new LastfmAPI({
  'api_key': 'ea601113c535c387813a827657830ae6',
  'secret': '7d024fba1df35e4329a8a18173c52d7b'
});

lfm.

lfm.track.search({

  'track': 'piya re'
}, function(err, track) {
  if (err) {
    throw err;
  }
  console.log(track.trackmatches);
});
*/
//define a alexa app
//var app = new alexa.app("jukebox");
var app = chatskills.app("jukebox");
module.exports = app;
chatskills.launch(app);


console.log("juke box loaded");
// Console client.
/*
var text = ' ';
while (text.length > 0 && text != 'quit') {
  text = readLineSync.question('> ');

  // Respond to input.
  chatskills.respond(text, function(response) {
    console.log(response);
  });
}
*/
