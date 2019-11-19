//INITIALIZE fIREBASE==========================================
var config = {
  apiKey: "AIzaSyAOEPxWMQz8d_vDWPmqIy7LLuqm1vgzBrM",
  authDomain: "kitten-insults-click-counter.firebaseapp.com",
  databaseURL: "https://kitten-insults-click-counter.firebaseio.com",
  projectId: "kitten-insults-click-counter",
  storageBucket: "kitten-insults-click-counter.appspot.com",
  messagingSenderId: "143848902569",
  appId: "1:143848902569:web:5cdde6ac648d28b0483eb8",
  measurementId: "G-EQ1PW8QTW7"
};

// Initialize Firebase
firebase.initializeApp(config);
// firebase.analytics();
var database = firebase.database();

// Begin Click counter logic ================================================
var clickCounter;
var timeDiff;
var goAheadAndAjax = true;

//access Firebase
database.ref().on(
  "value",
  function(snapshot) {
    console.log(snapshot.val());
    // Change the value of our clickCounter and timestamp to match the values in the database
    clickCounter = snapshot.val().clickcount;
    var timestamp1 = snapshot.val().timestamp;
    console.log("here is the click counter");
    console.log(clickCounter);
    console.log("here is the timestamp");
    console.log(timestamp1);
    // Find the different between the database's timestamp and the current time
    currTime = moment();
    timeDiff = Math.abs(currTime.diff(timestamp1, "minutes"));
    console.log("time Diff:");
    console.log(timeDiff);
    //if over 24 hours have passed, reset the clickcounter to 0, to be pushed into the database in the on click function
    if (timeDiff > 1440) {
      clickCounter = 0;
    }
    if (clickCounter > 300) {
      goAheadAndAjax = false;
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

// below is all of the Words API code ===================================================================================

// nounURL for generating nouns, adjURL for generating adjectives, noun for saving the noun, adj for saving the adjective
var nounURL =
  "https://wordsapiv1.p.mashape.com/words/?random=true&partOfSpeech=noun";
var adjURL =
  "https://wordsapiv1.p.mashape.com/words/?random=true&partOfSpeech=adjective";
var adj;
var noun;

function randomWords() {
  if (goAheadAndAjax) {
    // get adjective, save in adj variable
    $.ajax({
      async: true,
      crossDomain: true,
      url: adjURL,
      method: "GET",
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "39812ffa96mshad44da94a22ebb0p1f8c02jsn4c08e013d57d"
      }
    }).then(function(response) {
      console.log(response);
      adj = response.word;
      $("#adjective-2").prepend(" " + adj);

      updateDatabase();
    });

    // get noun, save in noun variable
    $.ajax({
      async: true,
      crossDomain: true,
      url: nounURL,
      method: "GET",
      headers: {
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
        "x-rapidapi-key": "39812ffa96mshad44da94a22ebb0p1f8c02jsn4c08e013d57d"
      }
    }).then(function(response) {
      console.log(response);
      noun = response.word;
      $("#noun").prepend(" " + noun);

      updateDatabase();
    });
  } else {
    $("#noun").prepend(
      "... <br><hr>Sorry! We have reached our API call limit! Come back tomorrow for more insults!"
    );
    return false;
  }
}

// On click event updates clickcounter in database, and generates random words
$("#generate").on("click", function() {
  if (!goAheadAndAjax) {
    console.log("too many click counts!!");
    return false;
  }
  if (goAheadAndAjax) {
    randomWords();
  }
});

//update the database with the number of ajax calls
function updateDatabase() {
  clickCounter++;
  console.log("click counter from browser:" + clickCounter);
  // // Save new value to Firebase
  if (timeDiff < 1440) {
    database
      .ref()
      .update({
        clickcount: clickCounter
      })
      .then(function() {
        console.log("Synchronization succeeded");
        console.log(clickCounter);
      })
      .catch(function(error) {
        console.log("Synchronization failed");
      });
  }

  if (timeDiff >= 1440) {
    database
      .ref()
      .update({
        clickcount: clickCounter,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })
      .then(function() {
        console.log("Synchronization succeeded");
        console.log(clickCounter);
      })
      .catch(function(error) {
        console.log("Synchronization failed");
      });
  }
  // Log the value of clickCounter
  console.log(clickCounter);
}
