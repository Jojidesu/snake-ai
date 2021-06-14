// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Snake {
  constructor(brain) {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.canMove = true;
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(6, 128, 2);
    }
    this.score = 0;
    this.fitness = 0;
    this.starve = 0;
    this.distanceToFood = 0;
    this.color = color(random(255), random(255), random(255));
  }

  copy() {
    return new Snake(this.brain);
  }

  setDir(x, y) {
    if (this.canMove) {
      this.xdir = x;
      this.ydir = y;
      this.canMove = false;
    }
  }

  moveLeft() {
    if(this.xdir != 1) {
      this.setDir(-1, 0);
    }
  }

  moveRight() {
    if(this.xdir != -1) {
      this.setDir(1, 0);
    }
  }

  moveDown() {
    if(this.ydir != -1) {
      this.setDir(0, 1);
    }
  }

  moveUp() {
    if(this.ydir != 1) {
      this.setDir(0, -1);
    }
  }

  think(foods) {
    let head = this.body[this.body.length - 1].copy();
    let tail = this.body[0].copy();
    let closestFood = 0;
    let closestFoodDistance = 0;
    for(let i = 0; i < foods.length; i++) {
      if(closestFoodDistance < foods[i].dist(head)) {
        closestFood = i
        closestFoodDistance = foods[i].dist(head)
      }
    }
    let food = foods[closestFood];
    if(this.distanceToFood > closestFoodDistance) {
      if(head.x == food.x || head.y == food.y) {
        this.score++
      }
    } else {
      if (this.score > 0) {
        this.score-=2
      } else {
        this.score=0
      }
    }
    this.distanceToFood = closestFoodDistance;
    let headToBorderYDistance = h - head.y;
    let headToBorderXDistance = w - head.x;

    let largestDistance = createVector(floor(w), floor(h)).mag();

    let inputs = [];
    //1.head x position
    inputs[0] = map(head.x, 0, w, 0, 1);
    //2.head y position
    inputs[1] = map(head.y, 0, h, 0, 1);
    //3.food x position
    inputs[2] = map(food.x, 0, w, 0, 1);
    //4.food y position
    inputs[3] = map(food.y, 0, h, 0, 1);
    //5.food y position
    inputs[4] = map(headToBorderYDistance, 0, h, 0, 1);
    //6.food x position
    inputs[5] = map(headToBorderXDistance, 0, w, 0, 1);
    // console.log("input");
    // console.table(inputs);
    // Get the outputs from the network
    let action = this.brain.predict(inputs);
    // console.log("output");
    // console.table(action);
    //4 direction
    if (action[0] <= 0.5 && action[1] <= 0.5 ) {
      this.moveUp();
    } else if (action[0] > 0.5 && action[1] > 0.5) {
      this.moveDown();
    } else if (action[0] <= 0.5 && action[1] > 0.5) {
      this.moveLeft();
    } else {
      this.moveRight();
    }
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
    this.starve+=1;
    this.score+=1;
  }

  isStarving() {
    if (this.starve >= 400) {
      this.score = this.score / 5;
      return true;
    } else {
      return false
    }
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.body.push(head);
    this.score+=100;
    this.starve=0;
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
      return true;
    }
    // for (let i = 0; i < this.body.length - 1; i++) {
    //   let part = this.body[i];
    //   if (part.x == x && part.y == y) {
    //     return true;
    //   }
    // }
    return false;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x == pos.x && y == pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      fill(this.color);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
    this.canMove = true;
  }
}
