
var game = {

  table: "div#table", // shortcut for refering to the card table

  suits: { // used as shortcuts to convert playing cards represented as
    // two-letter strings to HTML element classes specially styled by CSS
    d: "diamonds",
    s: "spades",
    c: "clubs",
    h: "hearts",
  },

  debug_mode: false, // true turns off card deck shuffling

  is_active: false, // where game is in play or suspended

  mode: 0, // mode 0 is reset and ready to go, 1 is active, 2 is suspended/review

  click_history: [], // for card ranks/values of every card clicked per game

  matched: [], // card rank/value of each matched pair

  cards_to_unflip: [], // queue for unmatched cards to unflip next refresh

  cards_in_deck: [], // array of two-element arrays [[rank, suit], [r, s], etc]

  //cards_on_table: [],

  speed: 2000, // speed in millaseconds for timeout to flipback unmatched cards

  timerId: null,

  stopwatch: 0, // current time

  createCard: function ( rank, suit ) {
    return "<div class=\"card-on-table\"><div class=\"flippable-card\">" +
    "<div class=\"card card-facedown\"><span></span></div>" + "<div class=\"card card-faceup card-" +
    this.suits[suit] + " card-" + rank + " card-faceup\"><span></span><p>" + rank + "</p></div>" +
    "</div></div>";
  },

  createSuit: function ( suit ) {
    var cards = [];
    cards.push(["a", suit]);
    for ( var i = 2; i <= 10; i++ ) {
      cards.push([i, suit]);
    }
    cards.push(["j", suit]);
    cards.push(["q", suit]);
    cards.push(["k", suit]);
    return cards;
  },

  shuffle: function () { // need to find better code
    if ( !this.debug_mode ) {
      for ( var j, x, i = this.cards_in_deck.length; i; j = Math.floor(Math.random() * i), x = this.cards_in_deck[--i], this.cards_in_deck[i] = this.cards_in_deck[j], this.cards_in_deck[j] = x);
    }
  },

  draw_card: function () {
    return this.cards_in_deck.pop();
  },

  unflip: function () {
    // cards to remove
    var card1 = this.cards_to_unflip.shift();
    var card2 = this.cards_to_unflip.shift();

    $(".flipped").each( function () {
      var text = $(this).text();
      if ( text === card1 || text === card2 ) {
        $(this).toggleClass("flipped");
      }
    });
  },

  show_match: function () {

  },

  get_click_history: function () {
    var output = "";
    for ( var i = 0; i < this.click_history.length; i++ ) {
      if ( i % 2 === 0 ) {
        output += "[" + this.click_history[i].toString().toUpperCase() + ",";
      } else {
        output += this.click_history[i].toString().toUpperCase() + "]";
      }
    }
    return output;
  },

  refresh_stats: function () {
    $("#stopwatch").text(this.stopwatch.toString());
    $("#matches").text(this.matched.length);
    $("#misses").text(Math.floor(this.click_history.length / 2) - this.matched.length);
    $("#clicks").text(this.click_history.length);

  },

  increment_time: function () {
    this.stopwatch += 1;
    this.refresh_stats();
  },

  reset: function ( and_play ) { // consolidates all features to
    this.mode = 0; // game mode 0
    $(".flipped").removeClass("flipped");
    this.matched = [];
    this.click_history = [];
    this.refresh_stats();
    this.timerId = clearInterval(this.timerId);
    this.stopwatch = 0;

    var red = Math.random() < 0.5 ? "h" : "d";
    var black = Math.random() < 0.5 ? "c" : "s";
    red = this.createSuit(red);
    black = this.createSuit(black);
    if ( Math.random() < 0.5 ) {
      red.pop();
      black.pop();
    } else {
      red.shift();
      black.shift();
    }
    this.cards_in_deck = red.concat(black);

    var deck = "";
    for ( var d = 0; d < this.cards_in_deck.length; d++ ) {
      deck += this.cards_in_deck[d][0] + this.cards_in_deck[d][1] + " ";
    }

    console.log("Deck created:", deck);

    if ( and_play !== "debug" ) {
      this.shuffle(); // Shuffle deck
    }

    $(this.table).empty();

    for (var i = 0; i < 24; i++ ) {
      var drawn_card = this.draw_card();
      $(this.table).append(this.createCard(drawn_card[0], drawn_card[1]));
    }
    if ( and_play ) {
      //this.is_active = true;
      // this.mode = 1;
      // game.timerId = setInterval(this.increment_time.bind(this), 1000);
      // $("#button").css("width", "3em");
      // $("#button").text("Give Up?"); // change button to reflect game now in play
      // $("#button").css("width", "auto");
    } else {
      $("#button").css("width", "3em");
      $("#button").text("Pair the Cards"); // change button to reflect game now in play
      $("#button").css("width", "auto");
      this.refresh_stats();
    }
  },

  start: function () {
    this.mode = 1;
    this.timerId = clearInterval(this.timerId);
    this.timerId = setInterval(this.increment_time.bind(this), 1000);
    $("#button").css("width", "3em");
    $("#button").text("Give Up?"); // change button to reflect game now in play
    $("#button").css("width", "auto");
  },

  suspend: function () {
    this.mode = 2;
    $("#button").text("Try Again?");
    this.timerId = clearInterval(game.timerId);
  },

  toggleMode: function () {
    switch ( this.mode ) {
      case 0: this.start();
      break;
      case 1: this.suspend();
      break;
      case 2: this.reset();
      break;
    }
  },

  automate: function () { // mode 9 computer plays automatically
    //
    var memory = [];
    var done = false;

    while ( !done ) {
      var match_found = false;
      var current_card = 0;
      while ( !match_found ) {
        var chosen_card = unflipped_cards.eq(current_card);
        var text = chosen_card.text();
        chosen_card.toggleClass("flipped");
        // TODO
        if ( memory.indexOf(text) !== -1 ) {
          // we found a match
          match_found = true;
          // TODO
        }
      }
      current_card++;
    }



  },

  init: function () {

    this.reset();

    var game = this; // for the thisiness in the callbacks

    // Attach click listener to start/stop/reset button

    $("button").on("click", function (e) {
      e.preventDefault();
      game.toggleMode();
      // if ( game.mode === 1 ) { //game.is_active ) { // if game is active, let's stop it
      //   $(e.target).text("Try Again?");
      //   game.is_active = false;
      //   game.timerId = clearInterval(game.timerId);
      //   game.stopwatch = 0;
      // } else { // if game is not active, activate it
      //   $(e.target).text("Give Up?"); // change button to reflect game now in play
      //   game.reset(true);
      // }
    });

    $("#interval").on("click", function (e) {
      e.preventDefault();
      console.log("Interval changed.");
      if (game.speed > 1000) {
        game.speed -= 1000;
      } else if ( game.speed == 1000 ) {
        game.speed = 500;
      } else {
        game.speed = 3000;
      }
      $("#interval").text(game.speed / 1000);
    });

    // Attach click listeners to cards

    $(this.table).on("click", function (e) {
      e.preventDefault();
      var flip_container = $(e.target).parent().parent();
      // need to prevent stray clicks here

      if ( game.mode === 2 || game.mode === 9 ) { // !game.is_active ) { // if game not active, clicks not registered
        console.log("Game not active.");
        // TODO implement review mode
        // if ( confirm( "Begin?" ) ) {
        //   game.reset(true);
        // }
        // if ( game.stopwatch === 0 ) {
        //   alert("hey has stadrted");
        //   game.reset(true);
        //   var this_card = flip_container.text(); // we'll need this a lot
        //   game.click_history.push(this_card); // add this just clicked card to history
        //   flip_container.toggleClass("flipped"); // flip the card
        // }
        //   console.log("Starting game.");
        //   game.reset(true);
        //   alert("hey");
        //   var this_card = flip_container.text(); // we'll need this a lot
        //   game.click_history.push(this_card); // add this just clicked card to history
        //   flip_container.toggleClass("flipped"); // flip the card
        // }

      } else if ( !flip_container.hasClass("flipped") && flip_container.hasClass("flippable-card")) {
        // Only do stuff if click is validly on unflipped flippable card
        if ( game.click_history.length === 0 ) {
          game.start();
        }
        var this_card = flip_container.text(); // we'll need this a lot
        game.click_history.push(this_card); // add this just clicked card to history
        flip_container.toggleClass("flipped"); // flip the card
        //$("h1").text(game.get_click_history()); // output to debug
        console.log("Just clicked on", this_card, "card. (Click #" + game.click_history.length + ")" );

        if ( game.click_history.length % 2 === 0 ) {
          //console.log("click_history.length % 2:", game.click_history.length % 2);
          // Not the first click in an attempted pairing
          var last_letter = game.click_history[game.click_history.length - 1];
          var last_last_letter = game.click_history[game.click_history.length - 2];
          console.log("last_letter:", last_letter, "last_last_letter:", last_last_letter);
          console.log("Does", last_letter.toUpperCase(), "match with", last_last_letter.toUpperCase() + "?",
          last_letter === last_last_letter ? "Yes!" : "No.");

          if ( last_letter === last_last_letter ) { // valid pairing
            game.matched.push(last_letter);
          } else { // botched attempt at pairing
            game.cards_to_unflip.push(last_last_letter);
            game.cards_to_unflip.push(last_letter);
            setTimeout(game.unflip.bind(game), game.speed);
          }
        }
      }
    });
  }
};

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

  getClickHistoryString: function(clickHistory) {
    var output = '';
    for (var i = 0; i < clickHistory.length; i++) {
      output += this.getCardValueFor(clickHistory[i]) + ' ';
    }
    return output;
  }

};

var gameRedux = {

  // game modes
  // 0 === game is suspended/not active
  // 1 === game is set and ready to go
  // 2 === game is in progress
  mode: 0,

  columns: 4,

  // jquery selectors and jquery objects for game elements
  table: '#table',
  $table: $(this.table),
  stopWatch: '#stopwatch',
  $stopWatch: $(this.stopWatch),
  button: '#button',
  $button: $(this.button),

  debugMode: false, // toggle this to true for debugging UI elements and console messages

  debugConsoleLog: function(msg) {
    if (this.debugMode) {
      console.log(msg);
    }
  },

  reset: function() {
    this.mode = 1;
  },

  clicks: 0,

  clickHistory: [],

  lastCardClicked: null,
  lastLastCardClicked: null,

  lastCardValue: null,

  scoring: {
    matches: 0,
    misses: 0
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

      if ($(this).hasClass('card-container') && game.mode === 0) {

        // if button doesn't already have shake animation class
        if (!game.$button.hasClass('not-matched-shake')) {
          // add a temporary shake animation class
          $(game.button).addClass('not-matched-shake');
          setTimeout(function() { // remove highlighted-match class from elements
            $(game.button).removeClass('not-matched-shake');
          }, game.flipDelay);
        }

      } else if (!$(this).hasClass('flip') && game.mode > 0) { // user clicks on a flippable card

        // player clicks on card, change to mode 2 (in play) and start timer;
        if (game.mode === 1) {
          game.start();
        }

        $(this).toggleClass('flip');
        game.clicks++;

        var thisCardValue = helpers.getCardValueFor(this);
        game.clickHistory.push(this);

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

            $(lastCard).addClass('highlighted-match');
            $(lastLastCard).addClass('highlighted-match');

            setTimeout(function() { // remove highlighted-match class from elements
              $(lastCard).removeClass('highlighted-match');
              $(lastLastCard).removeClass('highlighted-match');
            }, game.flipDelay);

            game.checkFinished();

          } else {

            game.debugConsoleLog('Not a Match: ' + lastCardValue + ' and ' + lastLastCardValue);
            game.scoring.misses += 1;

            $(lastCard).addClass('not-matched-shake');
            $(lastLastCard).addClass('not-matched-shake');

            setTimeout(function() { // turn the unmatched cards back over
              $(lastCard).removeClass('not-matched-shake').removeClass('flip');
              $(lastLastCard).removeClass('not-matched-shake').removeClass('flip');
            }.bind(this), game.flipDelay);
          }
        }

        game.updateStats();

      }//big if
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

  checkFinished: function() {
    this.debugConsoleLog('SOLVED: ' + $('.card-container.solved').length + ' OUT OF ' + this.cards.set.length);
    if ($('.card-container.solved').length >= this.cards.set.length) {
      // all cards have been solved
      // TODO
      // yay-ness
      this.debugConsoleLog('YAY!');
      this.stop();
    }
  },

  randomlyChooseUnflippedCard: function() {
    // TODO randomly choose from among
    var numUnflippedCards = $('.card-container:not(.flip)').length;
    if ($('.card-container.solved').length > 0 && numUnflippedCards > 0) {
      var randomInt = Math.floor(Math.random() * (numUnflippedCards - 1));
    }
  },

  updateStats: function() {
    $(this.stopWatch).text(this.timer);
    $('#clicks').text(this.clickHistory.length);
    $('#misses').text(this.scoring.misses);
    $('#matches').text(this.scoring.matches);
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

    $('#button').on('click', this.toggleButton.bind(this)); // bind this.toggleButton callback to this game, not the clicked-on button element

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

    $('#button').text('Pair the Cards');

    this.debugConsoleLog('Cards dealt, game set. (Mode 1)');

  },

  start: function() { // switch to mode 2, game is now in progress

    this.mode = 2;
    this.timerId = setInterval(this.updateStopWatch.bind(this), 1000);

    $('#button').text('Give Up?');

    this.debugConsoleLog('Game now in progress. (Mode 2)');
  },

  stop: function() { // switch to mode 0, gameplay is suspended
    this.mode = 0;
    clearInterval(this.timerId);

    $('#button').text('Try Again?');

    this.debugConsoleLog('Game stopped. (Mode 0)');
  }

};

$(document).ready(function() {

  gameRedux.init(hanjaCards);

});
