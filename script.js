

var game = {

  table: "div#table",

  flip_count: 0,

  suits: {
    d: "diamonds",
    s: "spades",
    c: "clubs",
    h: "hearts",
  },

  last_card_clicked: null,

  matched: [],

  cards_in_deck: [],

  cards_on_table: [],

  createCard: function (rank, suit) {
    return "<div class='card-on-table'><div class='flippable-card'>" +
    "<figure class='card card-facedown card-" + this.suits[suit] + " card-" +
    rank + "'><span></span></figure>" + "<figure class='card card-faceup card-" +
    this.suits[suit] + " card-" + rank + "'><span>" + rank + "</span></figure>" +
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
    for(var j, x, i = this.cards_in_deck.length; i; j = Math.floor(Math.random() * i), x = this.cards_in_deck[--i], this.cards_in_deck[i] = this.cards_in_deck[j], this.cards_in_deck[j] = x);
  },

  draw_card: function () {
    return this.cards_in_deck.pop();
  },

  refresh: function () {
    console.log("Refreshed.");
    console.log("Matched so far:", this.matched);
    var game = this;
    console.log("Matched so far:", this.matched, "game.matched:", game.matched);
    $(".flipped").each( function () {
      console.log("Matched so far:", game.matched);
      if ( game.matched.indexOf($(this).text()) == -1 ) {
        $(this).toggleClass("flipped");
      }
    });
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
      if ( $(e.target).parent().parent().hasClass("flipped") ) {
        // do nothing because it's already flipped
      } else if ( game.last_card_clicked ) { // we already have a card clicked
        $(e.target).parent().parent().toggleClass("flipped");
        console.log("Does", $(e.target).parent().parent().text(), "match with", game.last_card_clicked + "?");
        if ( $(e.target).parent().parent().text() == game.last_card_clicked ) {
          alert("match!");
          game.matched.push(game.last_card_clicked);
        }
        game.last_card_clicked = null;
        setTimeout(game.refresh.bind(game), 3000);
      } else { // this is a fresh try
        $(e.target).parent().parent().toggleClass("flipped");
        // alert($(e.target).parent().parent().text());
        game.last_card_clicked = $(e.target).parent().parent().text();
        console.log("Clicked on:", game.last_card_clicked);
        //$(e.target).parent().parent().toggleClass("flipped");
      }
    });

  }
};

$(document).ready(function() {
  game.start();
});
