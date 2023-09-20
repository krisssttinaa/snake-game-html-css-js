# snake-game-html-css-js
Modified snake game in html,css,js (named Crystal Snake)

Crystal Snake is the usual snake game, but with some modifications: 
-easy/medium/hard levels are based on the speed of snake
-snake is white (crystal)

This is a Snake game written in JavaScript that uses the canvas element 
of HTML5 to create the game's graphics. The game follows the classic rules 
of the Snake game, where the player has to control a snake and eat food 
that appears randomly on the screen. Each time the snake eats food, 
it grows longer. If the snake hits a wall or its own body, the game is over.

The SnakeGame class is the main class that handles the game's logic. 
The constructor function initializes the game by setting up the canvas, 
defining the settings for the game, and adding event listeners to the 
start and options buttons. The init function adds the event listeners 
to the buttons that control the game. The chooseDifficulty function sets 
the game's speed according to the difficulty chosen by the player.

The line "this.ctx = this.$canvas.getContext('2d');" is used to get 
the 2D rendering context for the canvas element. The 2D context 
provides functions and properties for drawing and manipulating graphics 
on the canvas.
By setting the 2D context to a variable called "ctx", it becomes easier 
to reference and use this context throughout the code for drawing and 
manipulating the canvas graphics.

Recourse I used is this (fancy-link for animation for some of my buttons):
https://github.com/kevin-powell/fun-with-transforms-and-transform-origin/blob/master/css/main.css
