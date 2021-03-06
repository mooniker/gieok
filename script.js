var hanjaCards = {
  "type": "hanja",
  "set": [
    {
      "value": "&#26085;",
      "title": "day"
    },{
      "value": "&#26376;",
      "title": "moon"
    },{
      "value": "&#28779;",
      "title": "fire"
    },{
      "value": "&#27700;",
      "title": "water"
    },{
      "value": "&#26408;",
      "title": "wood"
    },{
      "value": "&#37329",
      "title": "metal"
    },{
      "value": "&#22303;",
      "title": "earth"
    },{
      "value": "&#20154;",
      "title": "person"
    }
  ]
};

var helpers = {

  shuffle: function(set) {
    var i = 0, j = 0, temp = null;
    for (i = set.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = set[i];
      set[i] = set[j];
      set[j] = temp;
    }
  },

  getCardValueFor: function(cardElement) {
    var cardValueSelector = '.card-face p.value';  // jquery selector for card value
    return $(cardElement, cardValueSelector).text();
  },

  // used in debugMode only
  getClickHistoryString: function(clickHistory) {
    var output = '';
    for (var i = 0; i < clickHistory.length; i++) {
      output += this.getCardValueFor(clickHistory[i]) + ' ';
    }
    return output;
  },

  animateCard: function(card, animationClass, classToRemove) {
    $(card).addClass(animationClass);

    setTimeout(function() { // remove animate-nod class from elements
      $(card).removeClass(animationClass);
      if (classToRemove)
        $(card).removeClass(classToRemove);
    }, game.flipDelay);
  },

  callbackAfterCardClick: function(card, game) {
    if ($(card).hasClass('card-container') && game.mode === 0) {

      // if button doesn't already have shake animation class
      if (!$(game.button).hasClass(game.shakeClass)) {
        // add a temporary shake animation class
        $(game.button).addClass(game.shakeClass);
        setTimeout(function() { // remove animate-nod class from elements
          $(game.button).removeClass(game.shakeClass);
        }, game.flipDelay);
      }

    } else if (!$(card).hasClass('flip') && game.mode > 0) { // user clicks on a flippable card

      // player clicks on card, change to mode 2 (in play) and start timer;
      if (game.mode === 1) {
        game.start();
      }

      $(card).toggleClass('flip');
      game.clicks++;

      var thisCardValue = helpers.getCardValueFor(card);
      game.clickHistory.push(card);

      game.debugConsoleLog('<debug-mode> CLICK #' + game.clicks +
        ' CLICK HISTORY: ' + helpers.getClickHistoryString(game.clickHistory) +
        ' MATCHES: ' + game.scoring.matches + ' MISSES: ' +
        game.scoring.misses);

      if (game.clicks % 2 === 0) { // every second card click
        // check if they match
        var lastCard = game.clickHistory[game.clickHistory.length - 1];
        var lastLastCard = game.clickHistory[game.clickHistory.length - 2];
        var lastCardValue = helpers.getCardValueFor(lastCard);
        var lastLastCardValue = helpers.getCardValueFor(lastLastCard);

        if (lastCardValue === lastLastCardValue) {

          game.debugConsoleLog('Match: ' + lastCardValue);
          game.scoring.matches += 1;

          // mark these cards as solved with a CSS class for the business logic
          $(lastCard).addClass('solved');
          $(lastLastCard).addClass('solved');

          this.animateCard(lastCard, game.nodClass);
          this.animateCard(lastLastCard, game.nodClass);

          game.checkSolved();

        } else {

          game.debugConsoleLog('Not a Match: ' + lastCardValue + ' and ' + lastLastCardValue);
          game.scoring.misses += 1;

          this.animateCard(lastCard, game.shakeClass, 'flip');
          this.animateCard(lastLastCard, game.shakeClass, 'flip');
        }
      }

      game.updateStats();

    }//big if

  }

};

var game = {

  // game modes
  // 0 === game is suspended/not active
  // 1 === game is set and ready to go
  // 2 === game is in progress
  mode: 0,

  columns: 4,

  // jquery selectors and jquery objects for game elements
  table: '#table',
  // $table: $(this.table),
  stopWatch: '#stopwatch',
  // $stopWatch: $(this.stopWatch),
  button: '#button',
  // $button: $(this.button),

  shakeClass: 'animate-shake',
  nodClass: 'animate-nod',

  debugMode: false, // toggle this to true for debugging UI elements and console messages

  debugConsoleLog: function(msg) {
    if (this.debugMode) {
      console.log(msg);
    }
  },

  clicks: 0,

  clickHistory: [],

  lastCardClicked: null,
  lastLastCardClicked: null,

  lastCardValue: null,

  scoring: {
    matches: 0,
    matchesEl: '#matches',
    misses: 0,
    missesEl: '#misses',
    clicksEl: '#clicks',
    won: null
  },

  flipDelay: 2000, // delay (in millaseconds) for unmatched cards to flip back

  cards: {
    type: undefined,
    set: []
  },

  timerId: null,
  timer: 0, // in seconds, incremented by timer

  createCardElement: function(value, title) {

    var game = this;

    var hintContentInDebugMode = '';
    if (this.debugMode)
      hintContentInDebugMode = '<p class="hint">' + title + '</p>';

    var cardValueElement = '<p title="' + title + '">' + value + '</p>';
    var card = $('<div class="card-container"><div class="flippable-card"><div class="card-back">' + hintContentInDebugMode + '</div><div class="card-face">' + cardValueElement + '</div></div></div>');

    card.on('click', function(e) {
      e.preventDefault();
      helpers.callbackAfterCardClick(this, game);
    });

    return card;
  },

  dealCard: function(card) {
    $(this.table).append(this.createCardElement(card.value, card.title));
  },

  dealTheCards: function() {

    // remove cards from table
    $(this.table).empty();

    // Randomize
    helpers.shuffle(this.cards.set);

    // var totalCardMax = 12;

    if (this.debugMode) {

      // let us see where the cards are in debugMode
      var output = '';
      for (var i = 0; i < this.cards.set.length; i++) {
        output += this.cards.set[i].title + ' ';
        if ((i + 1) % this.columns === 0) // line break according to columns
          output += '\n';
      }
      console.log(output);
    }

    $.each(this.cards.set, function(index, value) {
      this.dealCard(value);
    }.bind(this));

    // change game mode to 1 (ready to play)
    this.mode = 1;

  },

  checkSolved: function() {
    this.debugConsoleLog('SOLVED: ' + $('.card-container.solved').length + ' OUT OF ' + this.cards.set.length);
    if ($('.card-container.solved').length >= this.cards.set.length) {
      this.debugConsoleLog('YAY!');
      this.scoring.won = true;
      this.stop();
    } else this.scoring.won = false;
  },

  getHintFor: function(cardValue) {

    var matches = $('.card-container:contains(\'' + cardValue + '\')');
    return matches;

  },

  getHint: function(cardValue) {

    // if match for given card exists, give its pair instead of continuing
    if (this.getHintFor(cardValue).length > 1)
      return this.getHintFor(cardValue);

    var unsolvedCards = this.clickHistory.filter(function(card) {
      return !$(card).hasClass('solved');
    });

    // if there are only two unsolved cards, they are obviously a match that should be hinted (as if they needed to be hinted)
    if (unsolvedCards.length === 2) {
      return unsolvedCards;
    }

    var uniqueCards = unsolvedCards.filter(function(item, pos) {
      return $(unsolvedCards).index(item) == pos;
    });

    // seach the cards we've flipped over already for matches.
    var matchFound = false;
    for (var i = 0; i < uniqueCards.length; i++) {
      if (matchFound) break; // if we've already found a match, don't do the rest of this for loop
      var matchedCards = uniqueCards.filter(function(card) {
        return $(uniqueCards[i], 'p').text() === $(card, 'p').text();
      });
      if (matchedCards.length > 1) {
        matchFound = true;
        return matchedCards;
      }
    }
    if (!matchFound) { // if above for loop has been exhausted
      this.debugConsoleLog('No matches in memory, need to choose a random card.');
    } else {
      this.debugConsoleLog('Found a match in memory');
    }
    return null;
  },

  indicateHint: function() {
    var hint = this.getHint();
    if (hint) {
      helpers.animateCard(hint[0], this.nodClass);
      helpers.animateCard(hint[1], this.nodClass);
    } else {
      helpers.animateCard(this.button, this.shakeClass);
    }
  },

  randomlyChooseUnflippedCard: function() {
    // TODO randomly choose from among
    var numUnflippedCards = $('.card-container:not(.flip)').length;
    if ($('.card-container.solved').length > 0 && numUnflippedCards > 0) {
      var randomInt = Math.floor(Math.random() * (numUnflippedCards - 1));
    }
  },

  flipCardsAutomatically: function() {
    var hint = this.getHint();
    if (hint) {
      // check to see if first hint card is flipped
      // if it isn't, flip it over and wait
      // if it is, skip it
      if (!$(hint[0]).hasClass('flip')) { // if this card is not flipped

      }

    } else {
      // TODO
      // flip random unflipped card

    }
  },

  updateStats: function() {
    $(this.stopWatch).text(this.timer);
    $(this.scoring.clicksEl).text(this.clickHistory.length);
    $(this.scoring.missesEl).text(this.scoring.misses);
    $(this.scoring.matchesEl).text(this.scoring.matches);
  },

  updateStopWatch: function() {
    this.timer += 1;
    this.updateStats();
    // this.debugConsoleLog('Timer: ' + this.timer);
  },

  toggleButton: function(e) {

    e.preventDefault();

    switch(this.mode) {
      case 0: // game is suspended
        this.set(); // set up game, ie mode 1
        break;
      case 1: // game is set up and ready to go
        this.start(); // start timer and game play
        break;
      case 2: // game is in progress
        this.stop(); // end game play, freeze timer
        break;
      default:
        game.debugConsoleLog('Button toggled.');
    }
  },

  init: function(cardsJson) { // get stuff needed for game
    // remind developer if debugMode is enabled.
    this.debugConsoleLog('ANNOUNCEMENT: debugMode === true');

    for (var i = 0; i < cardsJson.set.length; i++) {
      this.cards.set.push(cardsJson.set[i]);
      this.cards.set.push(cardsJson.set[i]); // second copy
    }

    $(this.button).on('click', this.toggleButton.bind(this)); // bind this.toggleButton callback to this game, not the clicked-on button element

    this.debugConsoleLog('Game initiated. (Mode 0)');

    this.set(); // switch to mode 1

  },

  set: function() { // switch/reset to mode 1 (game is ready to begin)

    this.mode = 1;
    this.timer = 0;
    this.scoring.matches = 0;
    this.scoring.misses = 0;
    this.clickHistory = [];
    clearInterval(this.timerId);
    this.updateStats();

    this.dealTheCards();

    // Uncomment this card to show all cards flipped faceside up on startup
    // $.each($('.card-container'), function(index, div) {
    //   $(div).toggleClass('flip');
    // });

    $(this.button).text('Pair the Cards');

    this.debugConsoleLog('Cards dealt, game set. (Mode 1)');

  },

  start: function() { // switch to mode 2, game is now in progress

    this.mode = 2;
    this.timerId = setInterval(this.updateStopWatch.bind(this), 1000);

    $(this.button).text('Give Up?');

    this.debugConsoleLog('Game now in progress. (Mode 2)');
  },

  automate: function() { // switch
    this.automated = true;

  },

  stop: function() { // switch to mode 0, gameplay is suspended
    this.mode = 0;
    clearInterval(this.timerId);
    var buttonText = this.scoring.won ? 'Nice! Play Again?' : 'Try Again?';
    $(this.button).text(buttonText);
    this.debugConsoleLog(buttonText + ' - Game stopped. (Mode 0)');
  }

};

$(document).ready(function() {

  game.init(hanjaCards);

  $(document).on('keydown', function(e) {

    // e.preventDefault();

    game.debugConsoleLog('KEYPRESS: ' + e.keyCode);

    switch(e.keyCode) {
      case 72: // h
        game.indicateHint();
        game.debugConsoleLog('HINT.');
        break;
      case 65: // A
        game.automate();
        game.debugConsoleLog('AUTOMATE.');
        break;
      default:
        // do nothing
        console.log(e.keyCode);
    }
  });

});

function hintFor(value) {
  console.log(game.getHintFor(value));
}
