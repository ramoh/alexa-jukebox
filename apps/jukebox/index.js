var alexa = require("alexa-app");
var request = require("request");

var map = new Map();

map.set("1", "173.255.138.90:8137/listen.pls?sid=1");
map.set("2", "50.7.70.66:8485/listen.pls");
map.set("3", "50.7.77.115:8174/listen.pls");
map.set("4", "173.255.138.90:8137/listen.pls?sid=1");
var channels = {
  "cat": "173.255.138.90:8137/listen.pls?sid=1",
  "dog": "50.7.70.66:8485/listen.pls",
  "duck": "50.7.77.115:8174/listen.pls",
  "hen": "173.255.138.90:8137/listen.pls?sid=1"
};


function getChannel(title) {
  var channel = {};
  console.log(typeof title);
  console.log("++++++title-xxx +++++" + title);

  var url = map.get(title);
  console.log("+++++url++++" + url);
  if (url) {
    channel.link = url;
  } else {
    channel.err = true;
  }
  return channel;
}

console.log("+++++getting name ");
var url = getChannel("3");
console.log(url);

var hardCodedStream = {
  url: "https://amazingworkproxy.herokuapp.com/?fpath=173.255.138.90:8137/listen.pls?sid=1",
  token: "903243243b3423432423",
  offsetInMilliseconds: 0
};

//var app = chatskills.app("jukebox");
var app = new alexa.app("jukebox");


app.launch(function(req, res) {
  res.say(
    "Welcome to jukebox. What would you like to listen ? Please say find ,followed by the radio channel name"
  );
  res.reprompt("Please say find ,followed by the radio channel name");
  res.shouldEndSession(false);

});

app.intent("findChannel", {
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
  console.log("++++++++++++++++++Find channel invoked ++++++++++");
  var title = req.slot("TitleOne");
  var message = "";
  console.log("++++ radio channel first token :" + title);

  if (title) {
    //capture additional words
    var TitleTwo = req.slot('TitleTwo') || ' ';
    var TitleThree = req.slot('TitleThree') || ' ';
    var TitleFour = req.slot('TitleFour') || ' ';
    // Concatenate all words in the title provided.
    title += ' ' + TitleTwo + ' ' + TitleThree + ' ' + TitleFour + ' ';
    //harcoded for now
    //  title = "DC MIX";
    console.log("+++++ final title :" + title);
    // Trim trailing comma and whitespace.
    title = title.replace(/,\s*$/, '');

    var channel = getChannel(title);

    if (!channel.err && channel.link) {
      message = "Ok. I found your channel " + title +
        " .Please say play to play the channel";
      var streamUrl = "https://amazingworkproxy.herokuapp.com/?fpath=" +
        channel.link;
      var stream = {
        url: streamUrl,
        token: "SOME_RANDOM_STRING",
        offsetInMilliseconds: 0
      };
      //  res.audioPlayerPlayStream("REPLACE_ALL", stream);
      res.session("searchedChannel", stream);

    } else {
      message = "Sorry ,I am not able to find your channel";
    }
  } else {
    message =
      "What would you like to listen ? Please say find ,followed by the radio channel name";
  }

  res.say(message).shouldEndSession(false);
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

app.intent("AMAZON.PauseIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Pause invoked");
    res.say('Puase from jukebox!').shouldEndSession(true);
  });

app.intent("AMAZON.ResumeIntent", {
    "slots": {},
    "utterances": []
  },
  function(req, res) {
    console.log("++++Resume invoked");
    var stream = req.session("searchedChannel");
    if (!stream) {
      //setting hardCodedStream
      stream = hardCodedStream;
    }
    console.log("++++straming to play++++");
    console.log(stream);


    res.audioPlayerPlayStream("REPLACE_ALL", stream);
    res.say('Playing your channel !').shouldEndSession(true);
  });

app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": ['{quit|exit|thanks|bye|enough}']
  },
  function(req, res) {
    console.log("++++cancel invoked");
    res.audioPlayerStop();
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
    "I can play a channel for you .Please say find  ,followed by channel name";

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
