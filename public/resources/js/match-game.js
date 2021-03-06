var MatchGame = {};

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function() {
  MatchGame.newGame();
  $('#restart-game').click(function() {
    MatchGame.restartGame();
  });
  $('#new-game').click(function() {
    MatchGame.newGame();
  });
});

/*
  Generates a new game
*/

MatchGame.newGame = function() {
  // Remember card values in case they want to restart game
  MatchGame.cardValues = MatchGame.generateCardValues();
  var $game = $('#game');
  MatchGame.renderCards(MatchGame.cardValues, $game);
}

/*
  Restarts the current game
*/

MatchGame.restartGame = function() {
  var $game = $('#game');
  MatchGame.renderCards(MatchGame.cardValues, $game);
}

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
  var colors = [
    'hsl(25, 85%, 65%)',
    'hsl(55, 85%, 65%)',
    'hsl(90, 85%, 65%)',
    'hsl(160, 85%, 65%)',
    'hsl(220, 85%, 65%)',
    'hsl(265, 85%, 65%)',
    'hsl(310, 85%, 65%)',
    'hsl(360, 85%, 65%)',
  ];
  var $row = $('<div class="row">');
  for (var i = 0; i < cardValues.length; i++) {
    var cardValue = cardValues[i];
    var $card = $('<div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 card">');
    $card.data('value', cardValue);
    $card.data('color', colors[cardValue - 1]);
    $card.data('flipped', false);
    $card.append($('<span></span>'));
    MatchGame.displayHidden($card);
    $row.append($card);
  }
  $game.empty();
  $game.append($row);
  $game.data('flipped', []);
  $game.data('total-flipped', 0);
  $game.find('.card').click(function() {
    MatchGame.flipCard($(this), $game);
  });
};

/*
  Set CSS properties of given card for each of three states:
  hidden, selected, and flipped.
*/

MatchGame.displayHidden = function($card) {
  $card.find('span').text('');
  $card.css('background-color', 'rgb(32, 64, 86)');
}

MatchGame.displaySelected = function($card) {
  $card.find('span').text($card.data('value'));
  $card.css('color', 'rgb(255, 255, 255)');
  $card.css('background-color', $card.data('color'));
}

MatchGame.displayFlipped = function($card) {
  // We don't need to set text because the 'selected' state always precedes this
  $card.css('color', 'rgb(204, 204, 204)');
  $card.css('background-color', 'rgb(153, 153, 153)');
}

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
*/

MatchGame.flipCard = function($card, $game) {
  // Test if this card is already flipped
  if ($card.data('flipped')) {
    // Yes, so then return
    return;
  }

  // Prevent more than 2 flipped cards
  var cardsFlipped = $game.data('flipped');
  if (cardsFlipped.length >= 2) {
    return;
  }

  // Show that this card is now selected
  MatchGame.displaySelected($card);
  $card.data('flipped', true);

  // Push this card's value onto the game's list of selected cards
  cardsFlipped.push($card.data('value'));

  // Test if we have two selected cards
  if (cardsFlipped.length < 2) {
    // No, so then return
    return;
  }

  // Test if both selected cards have the same value
  if (cardsFlipped[0] === cardsFlipped[1]) {
    // Yes they do, change colors to reflect this
    $game.find('.card').each(function() {
      var $thisCard = $(this);
      if ($thisCard.data('value') === cardsFlipped[0]) {
        MatchGame.displayFlipped($thisCard);
      }
    });
    cardsFlipped.pop();
    cardsFlipped.pop();

    // Bump the total number of cards flipped
    var totalFlipped = $game.data('total-flipped');
    totalFlipped += 2;
    $game.data('total-flipped', totalFlipped);

    // Test if all cards flipped
    if (totalFlipped === 16) {
      // You are a winner!
      $('.you-won span').text('You\'re a Winner!');
      $('.container').css('opacity', '0.1');
      window.setTimeout(function() {
        $('.container').css('opacity', '1');
        $('.you-won span').text('');
      }, 2000);
    }
    return;
  }

  // The cards have different values
  window.setTimeout(function() {
    // Hide the cards after a half second delay
    MatchGame.displayHidden($card);
    $card.data('flipped', false);
    // Loop through cards to find the first selected card and then hide it
    $game.find('.card').each(function() {
      var $thisCard = $(this);
      if ($thisCard.data('value') === cardsFlipped[0] && $thisCard.data('flipped')) {
        MatchGame.displayHidden($thisCard);
        $thisCard.data('flipped', false);
      }
    });
    cardsFlipped.pop();
    cardsFlipped.pop();
  }, 500);
};

/*
  Random integers given a range thanks to Mozilla
*/

MatchGame.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
