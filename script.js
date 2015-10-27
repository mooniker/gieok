

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

  is_active: true,

  last_card_clicked: [],

  click_history: [],

  matched: [],

  temporarily_visible: [],

  cards_to_unflip: [],

  cards_in_deck: [],

  cards_on_table: [],

  speed: 3000,

  timerId: null,

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

    // Attach click listeners to cards
    var game = this;
    $(this.table).on("click", function (e) {
      console.log("Click history:", game.click_history);
      var flip_container = $(e.target).parent().parent();

      if ( false ) { // if game not active, clicks not registered
        // game over code goes here
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

      // if ( flip_container.hasClass("flipped") ) {
      //   // do nothing because it's already flipped
      //   // All other scenarios assume that the card clicked is not flipped
      // } else if ( game.last_card_clicked.length > 0 ) {
      //   // we already have a card clicked in a pairing attempt or multiples
      //   flip_container.toggleClass("flipped");
      //   var this_card = flip_container.text();
      //   game.click_history.push(this_card);
      //   console.log("Does", this_card, "match with", game.last_card_clicked[0] + "?");
      //
      //   if ( this_card == game.last_card_clicked[0] && game.last_card_clicked.length % 2 === 0 ) {
      //     console.log("Yes!");
      //     game.show_match(this_card);
      //     game.matched.push(game.last_card_clicked.shift());
      //   } else {
      //     console.log("No.");
      //     console.log("Clicked on:", game.last_card_clicked);
      //     game.last_card_clicked.unshift(this_card);
      //     if ( game.last_card_clicked.length % 2 === 0 ) {
      //       setTimeout(game.update.bind(game), 3000);
      //       //game.flip_back(flip_container);
      //     }
      //   }
      // } else { // this is a fresh attempt at pairing
      //   flip_container.toggleClass("flipped");
      //   game.last_card_clicked.unshift(flip_container.text());
      //   game.click_history.push(flip_container.text());
      //   console.log("Clicked on:", game.last_card_clicked);
      // }
      // $("h1").text(game.click_history);
    });
    //setInterval(this.refresh.bind(this), 1000);
  }
};

$(document).ready(function() {
  game.start();
});
