// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA

const POPULATION = 100;
const FOODCOUNT = 1;

let activeSnakes = [];
let allSnakes = [];
let rez = 20;
let foods = [];
let w;
let h;
let bestSnake;
let bestScore = 0;
let highScoreSpan;
let speedSlider;
let speedSpan;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('canvascontainer');
  highScoreSpan = select('#hs');
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  frameRate(10);
  w = floor(width / rez);
  h = floor(height / rez);
  for(let i = 0; i < POPULATION; i++) {
    let snake = new Snake();
    activeSnakes[i] = snake;
    allSnakes[i] = snake;
  }
  initialFoodLocation();
}

function initialFoodLocation() {
  for(let i = 0; i < FOODCOUNT; i++) {
    let x = floor(random(w));
    let y = floor(random(h));
    foods[i] = createVector(x, y);
  }
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
  let cycles = speedSlider.value();
  speedSpan.html(cycles);
  for (let n = 0; n < cycles; n++) {
    for(let i = 0; i < activeSnakes.length; i++) {
      let snake = activeSnakes[i];
      for(let j = 0; j < foods.length; j++) {
        if (snake.eat(foods[j])) {
          let x = floor(random(w));
          let y = floor(random(h));
          foods[j] = createVector(x, y);
        }
      }
      snake.think(foods);
      snake.update();
      snake.show();
      if (snake.endGame() || snake.isStarving()) {
        activeSnakes.splice(i, 1);
      }
    }
    for(let i = 0; i < foods.length; i++) {
      noStroke();
      fill(255, 0, 0);
      rect(foods[i].x, foods[i].y, 1, 1);
    }

    if (activeSnakes.length == 0) {
      nextGeneration();
    }
  }
}
