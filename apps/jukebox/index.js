var alexa = require("alexa-app");
var request = require("request");
var deasync = require("deasync");
var cheerio = require("cheerio");
var GoogleSearch = require('google-search');
var googleSearch = new GoogleSearch({
  key: 'AIzaSyDOAFXf7qmkOGS4DnWEJifUkFVFB22xspk',
  cx: '008044490165455818569:moplxs3eswg'
});

//http://173.255.138.90:8137/listen.pls?sid=1


var hardCodedStream = {
  url: "https://amazingworkproxy.herokuapp.com/?fpath=173.255.138.90:8137/listen.pls?sid=1",
  token: "903243243b3423432423",
  offsetInMilliseconds: 0
};

var cachedSongs = {};

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
    "Welcome to jukebox. What would you like to listen ? Please say find ,followed by the song name"
  );
  res.reprompt("Please say jukebox find ,followed by the song name");

  res.shouldEndSession(false);

});

app.intent("playSong", {
    'slots': {},
    'utterances': ['jump']
  },
  function(req, res) {
    console.log("++++play song called called");
    var stream = req.session("searchedSong");
    if (!stream) {
      //setting hardCodedStream
      stream = hardCodedStream;
    }
    console.log("++++straming to play++++");
    console.log(stream);
    res.say("Playing humma humma song");

    res.audioPlayerPlayStream("REPLACE_ALL", stream);
    res.shouldEndSession(true);
  });

app.audioPlayer("PlaybackStarted", function(req, res) {
  console.log("+++++play back started called ");

});
app.audioPlayer("PlaybackFinished", function(req, res) {
  console.log("+++++play back finsihed called ");

});
app.audioPlayer("PlaybackStopped", function(req, res) {
  console.log("+++++play back stopped called ");

});
app.audioPlayer("PlaybackNearlyFinished", function(req, res) {
  console.log("+++++play back nearly finised called ");

});
app.audioPlayer("PlaybackFailed", function(req, res) {
  console.log("+++++play back failed called ");

});



app.intent("findSong", {
  'slots': {
    'TitleOne': 'TITLE',
    'TitleTwo': 'TITLE',
    'TitleThree': 'TITLE',
    'TitleFour': 'TITLE'
  },
  'utterances': ['find {-|TitleOne}',
    'find  {-|TitleOne} {-|TitleTwo}',
    'find {-|TitleOne} {-|TitleTwo} {-|TitleThree}',
    'find {-|TitleOne} {-|TitleTwo} {-|TitleThree} {-|TitleFour}'
  ]
}, function(req, res) {
  console.log("++++++++++++++++++Play song invoked ++++++++++");
  var title = req.slot("TitleOne");
  var message = "";
  console.log("++++ song first token :" + title);

  if (title) {
    //capture additional words
    var TitleTwo = req.slot('TitleTwo') || ' ';
    var TitleThree = req.slot('TitleThree') || ' ';
    var TitleFour = req.slot('TitleFour') || ' ';

    // Concatenate all words in the title provided.
    title += ' ' + TitleTwo + ' ' + TitleThree + ' ' + TitleFour + ' ';
    //harcoded for now
    title = "humma humma ok jannu";
    console.log("+++++ final title :" + title);
    // Trim trailing comma and whitespace.
    title = title.replace(/,\s*$/, '');

    console.log("++++++cached object return" + cachedSongs);
    var song = cachedSongs[title];
    console.log("+++ song is :" + song);

    if (song === undefined) {
      console.log("++++++Fetching the song from backend");
      song = getStreamFromMp3Fun(title);
      cachedSongs[title] = song;

    }
    if (!song.err && song.link) {
      message = "Ok. I found your song " + title +
        " .Please say play to play the song";
      var streamUrl = "https://amazingworkproxy.herokuapp.com/?fpath=" +
        song.link;
      var stream = {
        url: streamUrl.replace("http://", ""),
        token: "SOME_RANDOM_STRING",
        expectedPreviousToken: "PREVIOUS_TOKEN",
        offsetInMilliseconds: 0
      };
      //  res.audioPlayerPlayStream("REPLACE_ALL", stream);
      res.session("searchedSong", stream);

    } else {
      message = "Sorry ,I am not able to find your song";
    }
  } else {
    message =
      "What would you like to listen ? Please say jukebox find , followed by the song name ";
  }

  res.say(message).shouldEndSession(false);
});



app.intent("AMAZON.PauseIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Pause invoked");
    res.say('Puase from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.ResumeIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Resume invoked");
    var stream = req.session("searchedSong");
    if (!stream) {
      //setting hardCodedStream
      stream = hardCodedStream;
    }
    console.log("++++straming to play++++");
    console.log(stream);


    res.audioPlayerPlayStream("REPLACE_ALL", stream);
    res.say('Resume from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": ['{quit|exit|thanks|bye|enough}']
  },
  function(req, res) {
    console.log("++++cancel invoked");
    response.audioPlayerStop();
    res.say('Goodbye from jukebox!').shouldEndSession(true);
  });

app.intent("AMAZON.LoopOffIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Loop of invoked");
    res.say('Loop of from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.LoopOnIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Loop on invoked");
    res.say('Loop on from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.NextIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Loop next invoked");
    res.say(' next from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.PreviousIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Loop previous invoked");
    res.say(' previous from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.RepeatIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++RepeatIntent invoked");
    res.say(' RepeatIntent from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.ShuffleOffIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++ShuffleOffIntent invoked");
    res.say(' ShuffleOffIntent from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.ShuffleOnIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++ShuffleOnIntent invoked");
    res.say(' ShuffleOnIntent from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.StartOverIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++StartOverIntent invoked");
    res.say(' StartOverIntent from jukebox!').shouldEndSession(false);
  });

app.intent("AMAZON.HelpIntent", {
  "slots": {},
  "utterances": []
}, function(req, res) {
  console.log("++++help invoked");
  message =
    "I can play a song for you .Please say jukebox find  ,followed by song name";

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
