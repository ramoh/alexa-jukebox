var alexa = require("alexa-app");
var request = require("request");
var DoublyLinkedList = require("./ds").DoublyLinkedList;

//add all radio channels
var dll = new DoublyLinkedList();
dll.add({
  url: "173.255.138.90:8137/listen.pls?sid=1",
  name: "Channel 1"
});
dll.add({
  url: "50.7.70.66:8485/listen.pls",
  name: "Channel 2"
});
dll.add({
  url: "50.7.77.115:8174/listen.pls",
  name: "Channel 3"
});

var currentChannel;

var stream = {
  url: "",
  token: "SOME_RANDOM_STRING",
  offsetInMilliseconds: 0
};

//var app = chatskills.app("jukebox");
var app = new alexa.app("jukebox");

app.launch(function(req, res) {
  res.say(
    "Welcome to jukebox. Say next to move to next Channel .Say previous to move to previous channel"
  );
  currentChannel = dll.head;
  res.say("Playing channel " + currentChannel.data.name);
  res.audioPlayerPlayStream("REPLACE_ALL", stream);
  res.shouldEndSession(false);
});


app.intent("AMAZON.PauseIntent", {
    'slots': {},
    'utterances': []
  },
  function(req, res) {
    console.log("++++Pause invoked");
    res.say('Pause from jukebox!').shouldEndSession(true);
  });

app.intent("AMAZON.ResumeIntent", {
    'slots': {},
    'utterances': []
  },
  function(req, res) {
    console.log("++++Resume invoked");
    res.audioPlayerPlayStream("REPLACE_ALL", stream);
    res.say('Playing your channel !').shouldEndSession(true);
  });

app.intent("AMAZON.CancelIntent", {
    'slots': {},
    'utterances': ['{quit|exit|thanks|bye|enough|stop}']
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
    'slots': {},
    'utterances': []
  },
  function(req, res) {
    console.log("++++ next invoked");
    if (currentChannel.next) {
      currentChannel = currentChannel.next;
      stream.url = currentChannel.data.url;
      res.audioPlayerPlayStream("REPLACE_ALL", stream);
      res.say("playing next channel " + currentChannel.data.name).shouldEndSession(false);
    } else {
      res.say('There is no next channel').shouldEndSession(false);
    }
  });

app.intent("AMAZON.PreviousIntent", {
    'slots': {},
    'utterances': []
  },
  function(req, res) {
    console.log("++++ previous invoked");
    if (currentChannel.previous) {
      currentChannel = currentChannel.previous;
      stream.url = currentChannel.data.url;
      res.audioPlayerPlayStream("REPLACE_ALL", stream);
      res.say("playing next channel " + currentChannel.data.name).shouldEndSession(false);
    } else {
      res.say('There is no next channel').shouldEndSession(false);
    }
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
  'slots': {},
  'utterances': []
}, function(req, res) {
  console.log("++++help invoked");
  message =
    "I can play a channel for you .";
  res.say(message).shouldEndSession(false);
});

app.intent('AMAZON.StopIntent', {
  'slots': {},
  'utterances': ['{quit|exit|thanks|bye|thank you}']
}, function(req, res) {
  console.log("++++stop invoked");
  res.say('Goodbye from jukebox!').shouldEndSession(true);
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

module.exports = app;
