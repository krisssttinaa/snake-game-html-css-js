//board

//size of each box
var boxSize=20;
var rows=20;
var cols=20;
var board;
var context;

//snake head
var snakeX= boxSize*5;
var snakeY= boxSize*5;

var velocityX=0;
var velocityY=0;

var snakeBody=[];

//food-crystal
var crystalX;
var crystalY;

//when u collapse with your body
var gameOver=false;


window.onload=function(){
    board=document.getElementById("board");
    board.height=rows*boxSize;
    board.width=cols*boxSize;
    context=board.getContext("2d"); //for drawing on the board

    placeCrystal();
    document.addEventListener("keyup", changeDirection)
    //update();
    setInterval(update, 1000/10); //100 milisecond
}

function update(){
    if(gameOver){
        return;
    }

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height);

    //we were painting the crystal over the snake's head so i moved it here
    context.fillStyle="white";
    context.fillRect(crystalX, crystalY, boxSize, boxSize);

    //now we need to do smth when the snake collides with the crystal
    if(snakeX==crystalX && snakeY==crystalY){
        snakeBody.push([crystalX, crystalY]);
        placeCrystal(); //just for now to see if it works

    }

    for(let i=snakeBody.length-1; i>0; i--){
        snakeBody[i]=snakeBody[i-1];
        //basicly, we start from the head and before we update the x and y cordinates
        //we want the tail to get the previous x and y cordinates so that they can move forward
        //if i move the head first, we need to inform also the other pieces where to go
    }

    //to finish making the tail going along with the head and knowing where to go
    if(snakeBody.length){
        snakeBody[0]=[snakeX, snakeY];
    }


    context.fillStyle="lime";
    snakeX += velocityX*boxSize; //we move 1 box over the time unit
    snakeY +=velocityY*boxSize; //otherwise we would move 1 px over the time unit
    context.fillRect(snakeX, snakeY, boxSize, boxSize);
    //now, we have array, body segments and we need to draw them
    for(let i=0; i<snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], boxSize, boxSize);
    }
    
    //now the problem is that we are drawwing, but it is just left when we drow it and does not move...
    //we do not move the body along with the head

    //game over
    if(snakeX<0 || snakeX> cols*boxSize || snakeY<0 || snakeY>rows*boxSize){
        gameOver = true;
        alert("Game Over"); //for bounds
    }
    for(let i=0; i<snakeBody.length; i++){
        if(snakeX==snakeBody[i][0] && snakeY==snakeBody[i][1]){
            gameOver=true; //for any of your body parts
            alert("Game Over");
        }
    }
}

function changeDirection(e){
    //we need to add an additional check, so that user can not go 
    //on opposite direction because it's=clide with its body
    if(e.code=="ArrowUp" && velocityY!=1){
        velocityX=0;
        velocityY=-1;
    }
    else if(e.code=="ArrowDown" && velocityY!=-1){
        velocityX=0;
        velocityY=1;
    }
    else if(e.code=="ArrowRight" && velocityX!=-1){
        velocityX=1;
        velocityY=0;
    }
    else if(e.code=="ArrowLeft" && velocityX!=1){
        velocityX=-1;
        velocityY=0;
    }
}

function placeCrystal(){
    crystalX=Math.floor(Math.random()*cols)*boxSize;
    crystalY=Math.floor(Math.random()*rows)*boxSize;
}