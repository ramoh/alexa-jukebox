var alexa = require("alexa-app");
//var chatskills = require("chatskills");
//var readLineSync = require("readline-sync");
var request = require("request");
var deasync = require("deasync");
var cheerio = require("cheerio");
var GoogleSearch = require('google-search');
var googleSearch = new GoogleSearch({
  key: 'AIzaSyDOAFXf7qmkOGS4DnWEJifUkFVFB22xspk',
  cx: '008044490165455818569:moplxs3eswg'
});

// search mp3forfun for the song and return the result
function getStreamFromMp3Fun(songName) {
  var song = null;
  var searchSite = "http://www.fullmp3fun.com/";

  googleSearch.build({
    q: songName,
    num: 10, // Number of search results to return between 1 and 10, inclusive
    siteSearch: searchSite // Restricts results to URLs from a specified site
  }, function(error, response) {

    if (!error) {
      //console.log(response);
      //console.log(response.searchInformation.totalResults != '0');
      if (response.searchInformation.totalResults != '0') {
        console.log("+++++++i found your song!!!!+++++");
        var url = response.items[0].link;
        console.log("++++++Here is the URL : " + response.items[0].link);
        request(url, function(error, response, body) {
          if (error) {
            song = {
              err: error
            };
          } else {
            var $ = cheerio.load(body);
            var downloadLink = searchSite + $(".dwnLink")[0].attribs.href;
            //console.log(body);
            console.log("Your download link is :" + downloadLink);
            song = {
              link: downloadLink
            };
          }
        });
      }
    } else {
      song = {
        err: error
      };
    }
  });


  //wait until we have result from aysnc chall
  deasync.loopWhile(function() {
    return !song;
  });
  return song;
}

//var app = chatskills.app("jukebox");
var app = new alexa.app("jukebox");

app.launch(function(req, res) {
  res.say(
    "Welcome to jukebox. What would you like to listen ? Please say play ,followed by the song name"
  );
  res.reprompt("Please say play ,followed by the song name");
  res.shouldEndSession(false);
});



app.intent("playSong", {
  'slots': {
    'TitleOne': 'TITLE',
    'TitleTwo': 'TITLE',
    'TitleThree': 'TITLE',
    'TitleFour': 'TITLE'
  },
  'utterances': ['play  {-|TitleOne}',
    'play {-|TitleOne} {-|TitleTwo}',
    'play {-|TitleOne} {-|TitleTwo} {-|TitleThree}',
    'play {-|TitleOne} {-|TitleTwo} {-|TitleThree} {-|TitleFour}'
  ]
}, function(req, res) {
  console.log("++++++++++++++++++Play song invoked ++++++++++");
  var title = req.slot("TitleOne");
  var message = "";
  console.log("++++ song first token :" + title);

  if (title) {
    //capture additional words
    var TitleTwo = req.slot('TitleTwo') || '';
    var TitleThree = req.slot('TitleThree') || '';
    var TitleFour = req.slot('TitleFour') || '';

    // Concatenate all words in the title provided.
    title += ' ' + TitleTwo + ' ' + TitleThree + ' ' + TitleFour + ' ';
    console.log("+++++ final title :" + title);
    // Trim trailing comma and whitespace.
    title = title.replace(/,\s*$/, '');
    var song = getStreamFromMp3Fun(title);
    if (!song.err && song.link) {
      message = "Ok. I found your song " + title;
      var streamUrl = "https://amazingworkproxy.herokuapp.com/?fpath=" +
        song.link;
      var stream = {
        url: streamUrl,
        token: "SOME_RANDOM_STRING",
        expectedPreviousToken: "PREVIOUS_TOKEN",
        offsetInMilliseconds: 0
      };
      res.audioPlayerPlayStream("REPLACE_ALL", stream);
      res.shouldEndSession(false);
      console.log("response returned");
      return;
    } else {
      message = "Sorry ,I am not able to find your song";
    }
  } else {
    message =
      "What would you like to listen ? Please say play, followed by the song name ";
  }

  res.say(message).shouldEndSession(false);
});

app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": ['{quit|exit|thanks|bye|enough}']
  },
  function(req, res) {
    console.log("++++cancel invoked");
    res.say('Goodbye from jukebox!').shouldEndSession(true);
  });

app.intent("AMAZON.HelpIntent", {
  "slots": {},
  "utterances": []
}, function(req, res) {
  console.log("++++help invoked");
  message =
    "I can play a song for you .Please say play ,followed by song name";

  res.say(message).shouldEndSession(false);
});

app.intent('AMAZON.StopIntent', {
  'slots': {},
  'utterances': ['{quit|exit|thanks|bye|thank you}']
}, function(req, res) {
  console.log("++++stop invoked");
  res.say('Goodbye from jukebox!').shouldEndSession(true);
});


module.exports = app;
/*
chatskills.launch(app);

console.log(app.utterances());
// Console client.

var text = ' ';
while (text.length > 0 && text != 'quit') {
  text = readLineSync.question('> ');

  // Respond to input.
  chatskills.respond(text, function(response) {
    console.log(response);
  });
}
*/
