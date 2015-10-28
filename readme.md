# Overview

_Project Gieok_ ("ghee uhk") is a [memory/concentration card game](https://en.wikipedia.org/wiki/Concentration_(game)) implemented in CSS and JavaScript/jQuery with semantic HTML as a two-day [assignment](https://github.com/ga-dc/project1) for students at [General Assembly](https://generalassemb.ly/washington-dc)'s [Web Development Immersive program](https://generalassemb.ly/education/web-development-immersive) in Washington, D.C.

All visual elements, graphics, and animations are handled in CSS and HTML. JavaScript administers the business logic, updates stats to the HTML, and toggles elements' classes on click events. No images are used (other than the external image used for the Github ribbon).

See the [demo hosted here on Github](http://mooniker.github.io/gieok/).

## CSS

The CSS for the playing cards is lightly adapted from Jeff Yaus's [CSS Playing Cards](https://github.com/jyaus/css-playing-cards/) (v.2.0, released Feb. 2015). No images were used in this project, which is why the face cards appropriate chess-related symbols via HTML character codes. The flipping animation is also adapted from David DeSandro's [Intro to CSS 3D transforms](https://desandro.github.io/3dtransforms/docs/card-flip.html).

## Unimplemented Features

- Provide feedback to show a correct pairing, such as a visual flow or highlighting.
- Optionally show a replay of the most recent game.
- Implement other card sets and allow users to choose a set.
- Improve the UI for the usual reasons (responsive, scalable, accessibility, etc).
- Allow speed/interval changes for card flips.
- Allow an option for a countdown timer.

## User Stories

- As a user, I should be able to click on a pair of cards to turn them over to see their content.
- As a user, I should be able get visual feedback when I click on a matching pair to confirm that I've matched them correctly or incorrectly.
- As a user, I should be able to supply my own content for some of the cards so I can customize the game.
- As a user, I should be able to toggle or adjust visual and content aspects of the game so that I have some choice in how the game works.
- As a user I should be able to resize my screen without interfering with gameplay so that the game works on various-sized devices.
