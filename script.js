// <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
// 	<div class="flipper">
// 		<div class="front">
// 			<!-- front content -->
// 		</div>
// 		<div class="back">
// 			<!-- back content -->
// 		</div>
// 	</div>
// </div>

$(document).ready(function() {


  var game = {

    board: "div#board",
    decks: {
      test: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    },

    start: function () {
      // pass
      // for ( var i = 0; i < 9; i += 1 ) {
      //   $(this.board).append("<div class='flip-container' ontouchstart='this.classList.toggle('hover');'><div class='card flipper'><div class='front'></div><div class='back'"+ this.decks.test[i] + "</div></div></div></div>");
      // }

      // flip all the cards


    }
  };

  game.start();


  //   currentPlayerIsX: true,
  //
  //   inPlay: true,
  //
  //   xPlayerIsHuman: true,
  //
  //   oPlayerIsHuman: true,
  //
  //   reset: function () {
  //     $("td").each( function () {
  //       $(this).text("");
  //     });
  //   },
  //
  //   // turnDone: function () {
  //   //   // check for winner, lets load up the data in an array
  //   //   var board = [];
  //   //   $("tr").each( function (i) {
  //   //     var cells = [];
  //   //     $(this).children().each( function (i) {
  //   //       var cell = $(this).text();
  //   //       if (cell) {
  //   //         cells.push( cell == "X" );
  //   //       } else {
  //   //         cells.push(null);
  //   //       }
  //   //     });
  //   //     board.push(cells);
  //   //   });
  //   //   // first check horizontals
  //   //   for ( var row in board ) {
  //   //     var winner = "X";
  //   //     if ( )
  //   //   }
  //   //   // next check verticals
  //   //   // finally check diagonals
  //   //   this.currentPlayerIsX = !this.currentPlayerIsX;
  //   // },
  //
  //   onEndOfTurn: function () {
  //     // if winner
  //     var winner = this.hasWinner();
  //     if ( winner === null ) { // no winner
  //       console.log("no winner yet.");
  //       this.currentPlayerIsX = !this.currentPlayerIsX;
  //     //   change currentPlayer
  //     //   if new current player is human do human stuff
  //     //   else do computer stuff
  //     }
  //     else { // we have winner
  //       // change display/ui to say winner
  //       console.log("winner is", winner);
  //       // stop game play
  //     }
  //   },
  //
  //   findShowWinningRow: function ( jq_obj ) {
  //     var string_seq = jq_obj.text().trim();
  //     if ( string_seq == "XXX" || string_seq == "OOO" ) {
  //       jq_obj.attr("class", "win"); // side effect: styling
  //       this.inPlay = false;
  //       return string_seq == "XXX" ? "X" : "O"; // winner
  //     }
  //     return null; // no winner
  //   },
  //
  //   checkRow: function ( index ) {
  //     return this.findShowWinningRow($("#board tr").eq(index));
  //     // do some styling if win found
  //   },
  //
  //   checkColumn: function ( index ) {
  //     return this.findShowWinningRow($("#board tr > td:nth-child(" + index + ")"));
  //     // do some styling if win found
  //   },
  //
  //   checkDiagonals: function () {
  //     //pass
  //   },
  //
  //   hasWinner: function () {
  //     for ( var i = 0; i < $("#board tr").length; i++ ) {
  //       if ( this.checkRow(i) !== null ) {
  //         return this.checkRow(i);
  //       }
  //     } // horizontal rows checked
  //     for ( var j = 0; j < $("#board tr").eq(0).children().length; j++ ) {
  //       if ( this.checkColumn(j) !== null ) {
  //         return this.checkColumn(j);
  //       }
  //     } // vertical columns checked
  //     // diagonals should be checked here
  //     return null;
  //   },
  //
  //   start: function () {
  //     var game = this;
  //
  //     $("#reset").on("click", function (e) {
  //       e.preventDefault();
  //       game.reset();
  //     });
  //
  //     $("td").each( function () { // listen to each spot for click events
  //       $(this).on("click", function (e) {
  //         e.preventDefault();
  //         if ( game.inPlay ) {
  //           if ( $(this).text() ) { // if there is text
  //             console.log("Nope. Try another spot.");
  //           } else {
  //             $(this).text( game.currentPlayerIsX ? "X" : "O" );
  //           }
  //           game.onEndOfTurn();
  //         }
  //       });
  //     });
  //   }
  // };

});
