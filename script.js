

var game = {

  table: "div#table",

  flip_count: 0,

  suits: {
    d: "diamonds",
    s: "spades",
    c: "clubs",
    h: "hearts",
  },

  last_card_clicked: [],

  click_history: [],

  matched: [],

  temporarily_visible: [],

  cards_in_deck: [],

  cards_on_table: [],

  speed: 3000,

  createCard: function ( rank, suit ) {
    return "<div class=\"card-on-table\"><div class=\"flippable-card\">" +
    "<figure class=\"card card-facedown card-" + this.suits[suit] + " card-" +
    rank + "\"><span></span></figure>" + "<figure class=\"card card-faceup card-" +
    this.suits[suit] + " card-" + rank + "\"><span>" + rank + "</span></figure>" +
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
  },

  flip_back: function ( flip_container ) {
    // flip back if not matched
    var game = this;
    setTimeout( function () {
      if ( game.matched.indexOf(this.text()) == -1  && this.hasClass("flipped")) {
        this.toggleClass("flipped");
      } // else { do nothing }
    }.bind( flip_container ), this.speed);
  },

  show_match: function () {

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

    console.log("Matched so far:", this.matched);

    var deck = "";
    for ( var d = 0; d < this.cards_in_deck.length; d++ ) {
      deck += this.cards_in_deck[d][0] + this.cards_in_deck[d][1] + " ";
    }
    console.log("Deck created:", deck);
    //this.shuffle();

    // put cards on the table
    for (var i = 0; i < 24; i++ ) {
      var drawn_card = this.draw_card();
      $(this.table).append(this.createCard(drawn_card[0], drawn_card[1]));
    }


    // make all cards flippable
    var game = this;
    $(this.table).on("click", function (e) {
      var flip_container = $(e.target).parent().parent();
      if ( flip_container.hasClass("flipped") ) {
        // do nothing because it's already flipped
      } else if ( game.last_card_clicked.length > 0 ) { // we already have a card clicked
        flip_container.toggleClass("flipped");
        var this_card = flip_container.text();
        console.log("Does", this_card, "match with", game.last_card_clicked[0] + "?");
        if ( this_card == game.last_card_clicked[0] && game.last_card_clicked.length % 2 === 0 ) {
          console.log("Yes!");
          game.show_match(this_card);
          game.matched.push(game.last_card_clicked.shift());
        } else {
          console.log("No.");
          console.log("Clicked on:", game.last_card_clicked);
          game.last_card_clicked.unshift(this_card);
          if ( game.last_card_clicked.length % 2 === 0 ) {
            setTimeout(game.update.bind(game), 3000);
            //game.flip_back(flip_container);
          }
        }
      } else { // this is a fresh attempt at pairing
        flip_container.toggleClass("flipped");
        game.last_card_clicked.unshift(flip_container.text());
        console.log("Clicked on:", game.last_card_clicked);
      }
    });

  }
};

$(document).ready(function() {
  game.start();
});
