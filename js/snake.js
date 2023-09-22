class SnakeGame {
  constructor() {
    //Get elements from the DOM
    /*The $ sign is often used as a convention in JavaScript to 
    indicate that a variable represents a DOM element. 
    It helps to differentiate between regular variables and 
    variables that hold DOM elements. */
    this.$screen = document.querySelector('#screen');
    this.$canvas = this.$screen.querySelector('canvas');
    this.ctx = this.$canvas.getContext('2d');
    this.$firstScreen = this.$screen.querySelector('.first-screen');
    this.$score = this.$screen.querySelector('.score');

    //Game main components
    this.components = {
      canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#07021e', //dark purple color
      },
      crystalSnake: {
        //The size of the snake's segments (both width and height) is set to 30 pixels
        largeness: 25, background: '#FFFFFF'
      }
    };

    //Game variables
    this.game = {
      //This property represents the speed of the game, the speed at which the snake moves. 
      //The value is set to 150, snake will move at a rate of 170 milliseconds/step
      speed: 150,
      //This is an object that maps key codes to their corresponding directions. 
      keyCodes: {
        37: 'left',
        38: 'Up', //mappings
        39: 'right',
        40: 'down'
      }
    };

    //Sound effects
    this.sound = {
      score: new Audio('./sound/score.mp3'),
      gameOver: new Audio('./sound/gameover.mp3')
    };

    //Set Up game
    this.setUpGame();
    this.initialiseGame();
  }

  //This method initializes the game.
  initialiseGame() {
    //Event listener for difficulty buttons
    this.$firstScreen.querySelector('.selection').addEventListener('click', event => {
      this.selectDifficulty(event.target.dataset.difficulty);
    });

    //Event listener for play button
    this.$firstScreen.querySelector('.play-btn').addEventListener('click', () => {
      this.startGame();
    });
  }

  //This method sets the game speed based on the selected difficulty,
  //setting up event listeners for the difficulty buttons and the play button
  selectDifficulty(difficulty) {
    //Set game speed based on chosen difficulty
      this.game.speed = difficulty;
    
      // Remove "active" class from all buttons and add to the clicked button
      this.$firstScreen.querySelectorAll('.selection button')
      .forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');
  }
  // This method sets the initial game values (setting up the initial state of the game)
  setUpGame() {
    //Set initial crystalSnake position
    const x = 400;
    const y = 500;

    // Set initial crystalSnake array

    //The this.components.crystalSnake.largeness refers to the size of 
    //each segment of the snake's body. It is used to calculate the x
    //of each segment relative to the head's position.
    this.crystalSnake = [
      { x: x, y: y }, //position of the snake's head
      { x: x - this.components.crystalSnake.largeness, y: y }, //is placed 1 segment to the left of the head
      { x: x - (this.components.crystalSnake.largeness * 2), y: y }, //2 segments size left
      { x: x - (this.components.crystalSnake.largeness * 3), y: y }, //3
      { x: x - (this.components.crystalSnake.largeness * 4), y: y }  //4
      // snake's body segments is determined by subtracting multiples of 
      //this.components.crystalSnake.largeness from the x of the head's position
    ];

    //Set initial crystal object
    this.crystal = {
      active: false, //whether the crystal is currently present
      background: '#609ded', //background color of the crystal
      coordinates: { x: 0, y: 0}
    };

    //Set initial game variables
    //The this.game object contains properties related to the game state
    this.game.score = 0; //initially set to 0
    this.game.direction = 'right'; //the current direction the snake is moving
    this.game.nextDirection = 'right'; //the next direction to be taken by the snake
  }
  
    //This method starts the game.
    startGame() {
      //Stop game over sound effect if it's still playing
      this.sound.gameOver.pause();
      this.sound.gameOver.currentTime = 0;
    
      //Add classes to change screen styling
      this.$screen.classList.add('game-in-progress');
      this.$screen.classList.remove('game-over');
      this.$score.innerText = 0;
    
      //Start game loop
      this.generateSnake();
      this.startGameInterval = setInterval(() => {
        if(!this.detectCollision()) {
          this.generateSnake();
        } else {
          this.endGame();
        }
      }, this.game.speed);
      
      //Event listener for arrow key inputs
      /*When an arrow key is pressed, the changeDirection method is called, 
      passing the keyCode of the pressed key as an argument. 
      The validateDirectionChange method checks if the requested direction 
      change is valid based on the current direction of the snake. 
      If the requested direction is valid, it updates the 
      nextDirection property of the game to the new direction.*/
      document.addEventListener('keydown', event => {
        this.changeDirection(event.keyCode);
      });
    }
    
  
    changeDirection(keyCode) {
      /*Object.keys(this.game.keyCodes) retrieves an array of all the keys (keyCodes) 
      in the this.game.keyCodes object. In this case, it will be an array of strings 
      representing the valid keyCodes for the snake's movement 
      ( "38" for Up, "40" for Down, "37" for Left, "39" for Right). */
      const validKeyPress = Object.keys(this.game.keyCodes).includes(keyCode.toString()); // Only allow (Up|down|left|right)
      /*validKeyPress, will be true if the pressed key's keyCode is included 
      in the array of valid keyCodes (Up, Down, Left, Right), indicating 
      that it is a valid key for controlling the snake's movement. 
      Otherwise, validKeyPress will be false. */
      if(validKeyPress && this.validateDirectionChange(this.game.keyCodes[keyCode], this.game.direction)) {
        this.game.nextDirection = this.game.keyCodes[keyCode]; //if both are true, we change the direction
      }
    }
  
    //validation so that snake does not eat itself (or pass itself)
    validateDirectionChange(keyPress, currentDirection) {
      return (keyPress === 'left' && currentDirection !== 'right') || 
        (keyPress === 'right' && currentDirection !== 'left') ||
        (keyPress === 'Up' && currentDirection !== 'down') ||
        (keyPress === 'down' && currentDirection !== 'Up');
    }
    
    //This function is responsible for clearing the canvas and resetting its 
    //properties before rendering the next frame of the game
    resetCanvas() {
      //sets the width of the canvas element to the desired width 
      //defined in the this.components.canvas object. 
      //This ensures that the canvas has the correct width for rendering.
      this.$canvas.width = this.components.canvas.width;
      //works the same as width, but for height
      this.$canvas.height = this.components.canvas.height;
  
      //sets the fill style of the canvas context (this.ctx) to the 
      //desired background color defined in the this.components.canvas object. 
      //This determines the color that will be used to fill the canvas.
      this.ctx.fillStyle = this.components.canvas.background;
      //fills a rectangle on the canvas starting from the top-left corner (0, 0) 
      //with the width and height of the canvas element
      this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height);
    }
  
    //The generateSnake() method is responsible for generating the movement 
    //of the snake based on the current direction of the snake
    generateSnake() {
      let coordinate; //holds the new position of the snake's head based on the current direction
      switch(this.game.direction) {
        //it calculates the new coordinates for the snake's head (coordinate) 
        //by adjusting the x and y values based on the size of each snake segment 
        case 'right': //If the direction is 'right', it adds the segment size to the current x position and keeps the y position the same.
          coordinate = {
            x: this.crystalSnake[0].x + this.components.crystalSnake.largeness,
            y: this.crystalSnake[0].y
          };
        break;
        case 'Up': //If the direction is 'Up', it keeps the x position the same and subtracts the segment size from the current y position.
          coordinate = {
            x: this.crystalSnake[0].x,
            y: this.crystalSnake[0].y - this.components.crystalSnake.largeness
          };
        break;
        case 'left': //If the direction is 'left', it subtracts the segment size from the current x position and keeps the y position the same.
          coordinate = {
            x: this.crystalSnake[0].x - this.components.crystalSnake.largeness,
            y: this.crystalSnake[0].y
          };
        break;
        case 'down': //If the direction is 'down', it keeps the x position the same and adds the segment size to the current y position.
          coordinate = {
            x: this.crystalSnake[0].x,
            y: this.crystalSnake[0].y + this.components.crystalSnake.largeness
          };
      }
  
      // Add the new coordinate to the crystalSnake array
      this.crystalSnake.unshift(coordinate);
      /*The canvas is then cleared using the resetCanvas() method 
      to prepare for rendering the updated snake position. */
      this.resetCanvas();
      
      //It checks if the snake's head has touched the crystal.
      const touchedCrystal = this.crystalSnake[0].x 
      === this.crystal.coordinates.x && this.crystalSnake[0].y 
      === this.crystal.coordinates.y;
      
      // If it has, it increments the score, plays a sound, and keeps the tail 
      //of the snake intact.
      if(touchedCrystal) {
        this.crystal.active = false; //make the current crystal unactive
        this.game.score += 15;
        this.$score.innerText = this.game.score;
        this.sound.score.play();
      } else {
        //If the snake's head didn't touch the crystal, 
        //the last segment of the snake is removed using pop(). 
        //This simulates the snake's movement by removing the tail segment.
        this.crystalSnake.pop();
      }
      this.initialiseCrystal(); //create a new crystal or to check if a new crystal needs to be generated 
      this.createCrystalSnake(); //to render the updated snake on the canvas.
    }
    
    /*The createCrystalSnake() method is responsible for rendering the 
    snake on the canvas based on the current state of the this.crystalSnake array. */
    createCrystalSnake() {
      const largeness = this.components.crystalSnake.largeness; //represents the size of each segment of the snake. This value is obtained from this.components.crystalSnake.largeness.
  
      this.ctx.fillStyle = this.components.crystalSnake.background; //background and border colors specified in this.components.crystalSnake.
      
      //It iterates over each coordinate in the this.crystalSnake array using the forEach()
      this.crystalSnake.forEach(coordinate => {
        /*For each coordinate, it uses the fillRect() method of context 
        to draw a filled rectangle on the canvas at the given x and y, 
        with the width and height equal to largeness. 
        This represents each segment of the snake's body. */
        this.ctx.fillRect(coordinate.x, coordinate.y, largeness, largeness);
        //this.ctx.strokeRect(coordinate.x, coordinate.y, largeness, largeness); // to draw an outline (border) around each segment of the snake
      });
      this.game.direction = this.game.nextDirection;
    }
  
    //Initializing the crystal object in the game. 
    //The crystal is represented by a single rectangle on the canvas.
    initialiseCrystal() {
      /*It checks if the crystal is already active (this.crystal.active). 
      If it is active, it means that the crystal is already present on the 
      canvas, so it calls the createCrystal() method with the existing
      coordinates (this.crystal.coordinates.x and this.crystal.coordinates.y) to redraw the crystal. */
      if(this.crystal.active) {
        this.createCrystal(this.crystal.coordinates.x, this.crystal.coordinates.y);
        return;
      }
      
      //otherwise, it goes to generate new random coordinates for the crystal
      const gridSize = this.components.crystalSnake.largeness; //based on the size of each segment of the snake 
      /*It calculates the maximum possible values for the x and y
       of the crystal within the canvas. It subtracts gridSize from the 
       width and height of the canvas (this.components.canvas.width and this.components.canvas.height) 
       to ensure that the crystal is fully within the boundaries of the canvas. */
      const xMax = this.components.canvas.width - gridSize; 
      const yMax = this.components.canvas.height - gridSize;
      
      //It generates random x and y
      const x =Math.ceil(((Math.random() * xMax)) / gridSize) * gridSize;
      const y =Math.ceil(((Math.random() * yMax)) / gridSize) * gridSize;
  
      /*It checks for any conflict between the generated crystal coordinates and 
      the coordinates of each segment of the snake. If there is a conflict, 
      it recursively calls initialiseCrystal() again to generate new random x, y 
      until a conflict-free position is found. */
      this.crystalSnake.forEach(coordinate => {
        const crystalSnakeConflict = coordinate.x == x && coordinate.y == y;
  
        if(crystalSnakeConflict) {
          this.initialiseCrystal();
        } else {
          this.createCrystal(x, y); //once good coordinates to draw the crystal on the canvas
        }
      });
    }
    
    /*Drawing the crystal on the canvas at the specified coordinates (x, y). 
    It sets the fill style, stroke style, and dimensions of the rectangle 
    representing the crystal, and then fills and strokes the rectangle on the canvas. */
    createCrystal(x, y) {
      const largeness = this.components.crystalSnake.largeness;
  
      this.ctx.fillStyle = this.crystal.background; //background of crystal
      this.ctx.strokestyle = this.crystal.border; //border color of crystal
      /*Takes 4 arguments and draws
      x, y -where this rectangle is going to be
      largenness - width and height of the rectangle*/
      this.ctx.fillRect(x, y, largeness, largeness);
      //this.ctx.strokeRect(x, y, largeness, largeness); 
  
      this.crystal.active = true; //updates the state of created crystal
      this.crystal.coordinates.x = x; //updates the coordinates of the crystal
      this.crystal.coordinates.y = y;
    }
    
    //detecting collisions in the game. 
    //It checks for 2 collisions: self-collision and boundary collision.
    detectCollision() {
      for(let i = 4; i < this.crystalSnake.length; i++) { 
        //it checks if the coordinates of the current segment 
        //are the same as the coordinates of the head of the snake 
        const selfCollison = this.crystalSnake[i].x === this.crystalSnake[0].x && this.crystalSnake[i].y === this.crystalSnake[0].y;
        if(selfCollison) {
          return true; //there is a collision
        }
      }
      
      //it checks for boundary collisions 
      //by comparing the coordinates of the head of the snake with the boundaries of the canvas.
      const leftCollison = this.crystalSnake[0].x < 0;  //if the x-coordinate of the head of the snake is less than 0, indicating a collision with the left boundary of the canvas
      const topCollison = this.crystalSnake[0].y < 0; //if the y-coordinate of the head of the snake is less than 0, indicating a collision with the top boundary of the canvas
      const rightCollison = this.crystalSnake[0].x > this.$canvas.width - this.components.crystalSnake.largeness; //if the x-coordinate of the head of the snake is greater than the canvas width minus the largeness of the snake's segments, indicating a collision with the right boundary of the canvas
      const bottomCollison = this.crystalSnake[0].y > this.$canvas.height - this.components.crystalSnake.largeness; // if the y-coordinate of the head of the snake is greater than the canvas height minus the largeness of the snake's segments, indicating a collision with the bottom boundary of the canvas
      
      //It returns true if any of the b. collisions are true, indicating a collision with the canvas boundaries.
      return leftCollison || topCollison || rightCollison || bottomCollison;
    }
    
    //Ending the game and displaying the game over screen
    endGame() {
      this.sound.gameOver.play(); //play the sound
      //It clears the interval that controls the game loop.
      //This stops the continuous execution of the game logic.
      clearInterval(this.startGameInterval); 
  
      //adds and deletes some classes of the screen element
      this.$screen.classList.remove('game-in-progress');
      this.$screen.classList.add('game-over');
      this.$firstScreen.querySelector('h1').textContent = 'Game Over'; //udates text in firstscreen element
      this.$firstScreen.querySelector('.selection h3').innerText = `Score: ${this.game.score}`; //expression inside the curly braces will be evaluated, and its value will be inserted into the string
      
      //It calls setUpGame() to reset the game state and prepare for 
      //a new game. This function initializes the game variables, 
      //resets the snake and crystal, and sets up the event listeners
      this.setUpGame();
    }
  }
  
//creates a new instance of the SnakeGame class and assigns it to the snakeGame var
const snakeGame = new SnakeGame();
