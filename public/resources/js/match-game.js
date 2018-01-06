var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

/*
  Generates and returns an array of matching card values.
*/

MatchGame.generateCardValues = function () {
  var orderedCards = [];
  for (var i = 1; i <= 8; i++) {
    orderedCards.push(i);
    orderedCards.push(i);
  }
  var randomCards = [];
  while (orderedCards.length > 0) {
    var randomIndex = MatchGame.getRandomInt(0, orderedCards.length);
    randomCards.push(orderedCards[randomIndex]);
    orderedCards.splice(randomIndex, 1);
  }
  return randomCards;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {

};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
*/

MatchGame.flipCard = function($card, $game) {

};

MatchGame.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
