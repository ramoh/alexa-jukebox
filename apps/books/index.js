var alexa = require("alexa-app");
//var chatskills = require("chatskills");
//var readLineSync = require("readline-sync");
var xml2js = require("xml2js").parseString;
var request = require("request");
var deasync = require("deasync");


//define a alexa app
var app = new alexa.app("books");
//var app = chatskills.app("book");

//goodread api keys
var key = "b6Bc5VnBdjH1Mv2bZfUAIw";

function getBook(title) {
  var book = null;
  var url = "https://www.goodreads.com/book/title.xml?key=" + key + "&title=" +
    title;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      //convert the xml into json
      xml2js(body, function(error, result) {
        if (!error) {
          //extarct the fields we require
          var b = result.GoodreadsResponse.book[0];
          book = {
            id: b.id,
            title: b.title,
            ratings_count: b.ratings_count,
            average_rating: b.average_rating,
            authors: b.authors
          };
        }
      });
    } else {
      book = {
        err: error
      };
    }
  });
  //wait until we have result from aysnc chall
  deasync.loopWhile(function() {
    return !book;
  });
  return book;
}



app.launch(function(req, res) {
  res.say(
    "Welcome to books app. What book would you like to know about ? Please say get book ,followed by the title."
  );
  res.reprompt("Please say get book,followed by the title");
  res.shouldEndSession(false);
});


app.intent("getBook", {
  'slots': {
    'TitleOne': 'TITLE',
    'TitleTwo': 'TITLE',
    'TitleThree': 'TITLE',
    'TitleFour': 'TITLE',
    'TitleFive': 'TITLE'
  },
  'utterances': ['get {a|the|that|} book',
    'get {a|the|that|} book {-|TitleOne}',
    'get {a|the|that|} book {-|TitleOne} {-|TitleTwo}',
    'get {a|the|that|} book {-|TitleOne} {-|TitleTwo} {-|TitleThree}',
    'get {a|the|that|} book {-|TitleOne} {-|TitleTwo} {-|TitleThree} {-|TitleFour}',
    'get {a|the|that|} book {-|TitleOne} {-|TitleTwo} {-|TitleThree} {-|TitleFour} {-|TitleFive}'
  ]
}, function(req, res) {
  console.log("++++++++++++++Get book invoked ++++++++");
  var title = req.slot("TitleOne");
  var message = "";
  console.log("+++ title: " + title);
  if (title) {

    //capture additional words
    var TitleTwo = req.slot('TitleTwo') || '';
    var TitleThree = req.slot('TitleThree') || '';
    var TitleFour = req.slot('TitleFour') || '';
    var TitleFive = req.slot('TitleFive') || '';
    // Concatenate all words in the title provided.
    title += ' ' + TitleTwo + ' ' + TitleThree + ' ' + TitleFour + ' ';
    title += TitleFive;
    console.log("+++++ final title :" + title);
    // Trim trailing comma and whitespace.
    title = title.replace(/,\s*$/, '');
    var book = getBook(title);
    if (!book.err && book.title) {
      //store the book in session
      res.session("book", book);
      //respond to user
      message = "Ok. I found the book " + book.title;
    } else {
      message = "Sorry ,I cannt seem to find that book";
    }

  } else {
    message =
      'What book would you like to get? Please say get book, followed by the title.';
  }
  //we have a book in session so keep the session alive
  res.say(message).shouldEndSession(false);

});

app.intent("getRating", {
  "slots": {},
  'utterances': ['what is the {average|} rating',
    "{what's|whats} the {average|} rating",
    'rating',
    'average rating'
  ]
}, function(req, res) {

  console.log("+++++ get rating invoked");
  var message = "";

  var book = req.session("book");
  if (book) {
    message = "There are " + book.ratings_count +
      "  user rating.The average rating is " + book.average_rating;
  } else {
    message = "Please say get book, followed by title";
  }

  res.say(message).shouldEndSession(false);

});

app.intent("getAuthor", {
  'slots': {},
  'utterances': ['who is the author',
    'who are the authors',
    "{whos|who's} the author",
    "{whats|what's} the author",
    "{author|authors}",
    'who was {it|the book} {written|authored} by',
    'who wrote {it|the book}'
  ]
}, function(req, res) {
  console.log("+++++ get author invoked");
  var message = "";
  var book = req.session("book");

  if (book) {

    book.authors.forEach(function(element) {
      var author = element.author[0];
      message += author.name + " ,";
    });

    // Trim trailing comma and whitespace.
    message = message.replace(/,\s*$/, '');

  } else {
    message = 'Please say get book, followed by the title.';
  }
  res.say(message).shouldEndSession(false);
});


app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": ['{quit|exit|thanks|bye|enough}']
  },
  function(req, res) {
    console.log("++++cancel invoked");
    res.say('Goodbye from books app!').shouldEndSession(true);
  });

app.intent("AMAZON.HelpIntent", {
  "slots": {},
  "utterances": []
}, function(req, res) {
  console.log("++++help invoked");
  message =
    "'I can tell you details about books from GoodReads. To find a book, just say get book, followed by the title. You can also ask who is the author or what is the rating.";

  res.say(message).shouldEndSession(false);
});

app.intent('AMAZON.StopIntent', {
  'slots': {},
  'utterances': ['{quit|exit|thanks|bye|thank you}']
}, function(req, res) {
  console.log("++++stop invoked");
  res.say('Goodbye from books app!').shouldEndSession(true);
});

module.exports = app;
/*
console.log(app.utterances());
chatskills.launch(app);
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
