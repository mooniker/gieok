

var game = {

  table: "div#table",

  flip_count: 0,

  suits: {
    d: "diamonds",
    s: "spades",
    c: "clubs",
    h: "hearts",
  },

  timer: null,

  is_active: false,

  last_card_clicked: [],

  click_history: [],

  matched: [],

  temporarily_visible: [],

  cards_to_unflip: [],

  cards_in_deck: [],

  cards_on_table: [],

  speed: 3000,

  timerId: null,

  stopwatch: 0,

  createCard: function ( rank, suit ) {
    return "<div class=\"card-on-table\"><div class=\"flippable-card\">" +
    "<figure class=\"card card-facedown\"><span></span></figure>" + "<figure class=\"card card-faceup card-" +
    this.suits[suit] + " card-" + rank + " card-faceup\"><span>" + rank + "</span></figure>" +
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
    for (var j, x, i = this.cards_in_deck.length; i; j = Math.floor(Math.random() * i), x = this.cards_in_deck[--i], this.cards_in_deck[i] = this.cards_in_deck[j], this.cards_in_deck[j] = x);
  },

  draw_card: function () {
    return this.cards_in_deck.pop();
  },

  update: function () {
    $("#matches-so-far").text("Matches so far:", this.matched.length, this.matches);
    $("#misses-so-far").text("Misses:", this.last_card_clicked.length, this.last_card_clicked);
    console.log("Matched so far:", this.matched, "Misses so far:", this.last_card_clicked);
    this.last_card_clicked.push();
    this.last_card_clicked.push();
    var game = this;
    $(".flipped").each( function () {
      if ( game.matched.indexOf($(this).text()) == -1 ) {
        $(this).toggleClass("flipped");
      }
    });
    console.log("Board refreshed.");
  },

  refresh: function () {
    var game = this;
    $(".flipped").each( function () {
      if ( game.matched.indexOf($(this).text()) == -1 ) {
        $(this).toggleClass("flipped");
      }
    });
    console.log("Board refreshed.");
  },

  unflip: function () {
    // cards to remove
    console.log(this);
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
  },

  increment_time: function () {
    this.stopwatch += 1;
    this.update_stats();
  },

  reset: function ( and_play ) {
    $(".flipped").toggleClass("flipped");
    this.matched = [];
    this.click_history = [];
    this.update_stats();
    if ( and_play ) {
      this.is_active = true;
      game.timerId = setInterval(this.increment_time.bind(this), 1000);
      $("button").text("Give Up?"); // change button to reflect game now in play
    } else {
      $("button").text("Begin?"); // change button to reflect game now in play
    }
  },

  start: function () {

    // create and shuffle deck
    // this.cards_in_deck = this.createSuit("h");
    // this.cards_in_deck = this.cards_in_deck.concat(this.createSuit("d"));
    // this.cards_in_deck = this.cards_in_deck.concat(this.createSuit("c"));
    // this.cards_in_deck = this.cards_in_deck.concat(this.createSuit("s"));
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
    //this.shuffle(); // Shuffle deck

    // put cards on the table
    for (var i = 0; i < 24; i++ ) {
      var drawn_card = this.draw_card();
      $(this.table).append(this.createCard(drawn_card[0], drawn_card[1]));
    }

    var game = this; // for the thisiness in the callbacks

    // Attach click listener to start/stop/reset button

    $("button").on("click", function (e) {
      console.log("Active game:", game.is_active);
      if ( game.is_active ) { // if game is active, let's stop it
        $(e.target).text("Try Again?");
        game.is_active = false;
        game.timerId = clearInterval(game.timerId);
        game.stopwatch = 0;
      } else { // if game is not active, activate it
        $(e.target).text("Give Up?"); // change button to reflect game now in play
        //game.is_active = true;
        //game.update_stats();
        //game.timerId = setInterval(game.increment_time.bind(game), 1000);
        game.reset(true);
      }
      console.log("Game now active:", game.is_active);

    });

    // Attach click listeners to cards

    $(this.table).on("click", function (e) {
      var flip_container = $(e.target).parent().parent();

      if ( !game.is_active ) { // if game not active, clicks not registered
        console.log("Game not active.");
      } else if ( !flip_container.hasClass("flipped") ) {
        // Only do stuff if click is validly on unflipped card
        var this_card = flip_container.text(); // we'll need this a lot
        game.click_history.push(this_card); // add this just clicked card to history
        flip_container.toggleClass("flipped"); // flip the card
        $("h1").text(game.get_click_history()); // output to debug
        console.log("Just clicked on", this_card, "card. (Click #" + game.click_history.length + ")" );

        if ( game.click_history.length % 2 === 0 ) {
          console.log("click_history.length % 2:", game.click_history.length % 2);
          // Not the first click in an attempted pairing
          var last_letter = game.click_history[game.click_history.length - 1];
          var last_last_letter = game.click_history[game.click_history.length - 2];
          console.log("last_letter:", last_letter, "last_last_letter:", last_last_letter);
          console.log("Does", last_letter, "match with", last_last_letter + "?",
          last_letter === last_last_letter ? "Yes!" : "No.");

          if ( last_letter === last_last_letter ) { // valid pairing
            game.matched.push(last_letter);
          } else { // botched attempt at pairing
            game.cards_to_unflip.push(last_last_letter);
            game.cards_to_unflip.push(last_letter);
            setTimeout(game.unflip.bind(game), 3000);
          }

        }
      }
    });
  }
};

$(document).ready(function() {
  game.start();
});
