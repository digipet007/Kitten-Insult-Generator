randomList = [
  "clumsy",
  "feeble",
  "slimy",
  "weird",
  "stinky",
  "ugly",
  "uncouth",
  "saucy",
  "slanderous",
  "loathsome",
  "dim",
  "unoriginal",
  "lowly",
  "banal",
  "rotten"
];

randomIntro = ["I've never seen such ", "What ", "You are ", "You... "];

var rand;
var intro;

function randomQuery() {
  return randomList[Math.floor(Math.random() * randomList.length)];
}

function randomIntroduction() {
  return randomIntro[Math.floor(Math.random() * randomIntro.length)];
}

function similarWord() {
  // API Search request:
  var query = randomQuery();
  var queryURL =
    "https://dictionaryapi.com/api/v3/references/ithesaurus/json/" +
    query +
    "?key=bbb6c475-fd1e-43df-a360-8c5dafa0fb48";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    //create a randomized insult introduction and append it to the html page
    intro = randomIntroduction();
    console.log(intro);
    var random = Math.floor(Math.random() * response[0].meta.syns[0].length);
    rand = response[0].meta.syns[0][random];
    if (
      intro === "I've never seen such " ||
      intro === "What " ||
      intro === "You are "
    ) {
      if (
        rand[0] === "a" ||
        rand[0] === "i" ||
        rand[0] === "e" ||
        rand[0] === "o" ||
        rand[0] === "u"
      ) {
        intro += "an";
      } else {
        intro += "a";
      }
    }
    $("#youAreA").text(intro);
    $("#adjective-1").prepend(" " + rand);
  });
}

$("#generate").on("click", function() {
  similarWord();
});
