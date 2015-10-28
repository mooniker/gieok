
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
    "<figure class=\"card card-facedown\"><span></span></figure>" + "<figure class=\"card card-faceup card-" +
    this.suits[suit] + " card-" + rank + " card-faceup\"><span></span></figure>" +
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

  update_stats: function () {
    $("#stopwatch").text(this.stopwatch.toString());
    $("#matches").text(this.matched.length);
    $("#misses").text(Math.floor(this.click_history.length / 2) - this.matched.length);
    $("#clicks").text(this.click_history.length);
  },

  increment_time: function () {
    this.stopwatch += 1;
    this.update_stats();
  },

  reset: function ( and_play ) {
    $(".flipped").removeClass("flipped");
    this.matched = [];
    this.click_history = [];
    this.update_stats();
    this.timerId = clearInterval(game.timerId);
    this.stopwatch = 0;

    var hearts = this.createSuit("h");
    hearts.pop();
    var clubs = this.createSuit("c");
    clubs.pop();
    this.cards_in_deck = hearts.concat(clubs);

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
      this.is_active = true;
      game.timerId = setInterval(this.increment_time.bind(this), 1000);
      $("#button").css("width", "3em");
      $("#button").text("Give Up?"); // change button to reflect game now in play
      $("#button").css("width", "auto");
    } else {
      $("#button").css("width", "3em");
      $("#button").text("Pair the Cards?"); // change button to reflect game now in play
      $("#button").css("width", "auto");
    }
  },

  start: function () {

    this.reset();

    var game = this; // for the thisiness in the callbacks

    // Attach click listener to start/stop/reset button

    $("button").on("click", function (e) {
      e.preventDefault();
      if ( game.is_active ) { // if game is active, let's stop it
        $(e.target).text("Try Again?");
        game.is_active = false;
        game.timerId = clearInterval(game.timerId);
        game.stopwatch = 0;
      } else { // if game is not active, activate it
        $(e.target).text("Give Up?"); // change button to reflect game now in play
        game.reset(true);
      }
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

      if ( !game.is_active ) { // if game not active, clicks not registered
        console.log("Game not active.");
        if ( confirm( "Begin?" ) ) {
          game.reset(true);
        // if ( game.timerId === null ) {
        //   console.log("Starting game.");
        //   game.reset(true);
        //   alert("hey");
        //   var this_card = flip_container.text(); // we'll need this a lot
        //   game.click_history.push(this_card); // add this just clicked card to history
        //   flip_container.toggleClass("flipped"); // flip the card
        }

      } else if ( !flip_container.hasClass("flipped") && flip_container.hasClass("flippable-card")) {
        // Only do stuff if click is validly on unflipped flippable card
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

$(document).ready(function() {
  game.start();
});
