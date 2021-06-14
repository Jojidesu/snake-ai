// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA

const POPULATION = 150;
const FOODCOUNT = 25;

let activeSnakes = [];
let allSnakes = [];
let rez = 20;
let food;
let w;
let h;

function setup() {
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(500);
  for(let i = 0; i < POPULATION; i++) {
    let snake = new Snake();
    activeSnakes[i] = snake;
    allSnakes[i] = snake;
  }
  foodLocation();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

// function keyPressed() {
//   if (keyCode === LEFT_ARROW) {
//     snake.moveLeft();
//   } else if (keyCode === RIGHT_ARROW) {
//     snake.moveRight();
//   } else if (keyCode === DOWN_ARROW) {
//     snake.moveDown();
//   } else if (keyCode === UP_ARROW) {
//     snake.moveUp();
//   } else if (key == ' ') {
//     snake.grow();
//   }
// }

function draw() {
  scale(rez);
  background(220);
  for(let i = 0; i < activeSnakes.length; i++) {
    let snake = activeSnakes[i];
    if (snake.eat(food)) {
      foodLocation();
    }
    snake.think(food);
    snake.update();
    snake.show();
    if (snake.endGame() || snake.isStarving()) {
      activeSnakes.splice(i, 1);
    }
  }
  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
  if (activeSnakes.length == 0) {
    nextGeneration();
  }
}
