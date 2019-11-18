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

//access Firebase
database.ref().on(
  "value",
  function(snapshot) {
    console.log(snapshot.val());
    // Change the value of our clickCounter to match the value in the database
    clickCounter = snapshot.val().clickcount;

    // Console Log the value of the clickCounter
    console.log("here is the click counter");
    console.log(clickCounter);
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

// below is all the Words API code ===========================================

// nounURL for generating nouns, adjURL for generating adjectives, noun for saving the noun, adj for saving the adjective
var nounURL =
  "https://wordsapiv1.p.mashape.com/words/?random=true&partOfSpeech=noun";
var adjURL =
  "https://wordsapiv1.p.mashape.com/words/?random=true&partOfSpeech=adjective";
var adj;
var noun;

function randomWords() {
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
}

// On click event updates clickcounter in database, and generates random words
$("#generate").on("click", function() {
  randomWords();
});

//update the database with the number of ajax calls
function updateDatabase() {
  clickCounter++;
  console.log("click counter from browser:" + clickCounter);
  // // Save new value to Firebase
  database
    .ref()
    .set({
      clickcount: clickCounter
    })
    .then(function() {
      console.log("Synchronization succeeded");
      console.log(clickCounter);
    })
    .catch(function(error) {
      console.log("Synchronization failed");
    });

  // Log the value of clickCounter
  console.log(clickCounter);
}
