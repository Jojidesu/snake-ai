// Daniel Shiffman
// http://youtube.com/thecodingtrain
// http://codingtra.in

// Coding Challenge #115: Snake Game Redux
// https://youtu.be/OMoVcohRgZA
function mutate(x) {
  if (random(1) < 0.3) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}
let actions = [];
let records = [];
class Record {
  constructor(input, output) {
    this.input = input;
    this.output = output;
  }
}

class Snake {
  constructor(brain) {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 1;
    this.ydir = 0;
    this.canMove = true;
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(7, 128, 1);
      this.brain.setLearningRate(0.2);
      // for (let i = 0; i < trainingData.length; i++) {
      //   let td = random(trainingData);
      //   this.brain.train(td.input, td.output);
      // }
    }
    this.score = 0;
    this.fitness = 0;
    this.starve = 0;
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

  steerLeft() {
    this.setDir(-1 * this.ydir, this.xdir);
  }

  steerRight() {
    this.setDir(this.ydir, -1 * this.xdir);
  }

  moveForward() {
    this.setDir(this.xdir, this.ydir);
  }

  getInputs(foods) {
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
    let headToBorderYDistance = h - head.y;
    let headToBorderXDistance = w - head.x;

    let largestDistance = createVector(floor(w), floor(h)).mag();

    let inputs = [];
    let isFrontObstacle = this.isThereObstacleOn(head.x + this.xdir, head.y + this.ydir) ? 1 : 0;
    let isLeftObstacle = this.isThereObstacleOn(head.x - this.ydir, head.y + this.xdir) ? 1 : 0;
    let isRightObstacle = this.isThereObstacleOn(head.x + this.ydir, head.y - this.xdir) ? 1 : 0;
    inputs[0] = isFrontObstacle;
    inputs[1] = isLeftObstacle;
    inputs[2] = isRightObstacle;
    //1.head x position
    inputs[3] = map(head.x, 0, w, 0, 1);
    //2.head y position
    inputs[4] = map(head.y, 0, h, 0, 1);
    //3.food x position
    inputs[5] = map(food.x, 0, w, 0, 1);
    //4.food y position
    inputs[6] = map(food.y, 0, h, 0, 1);
    //5.food y position
    // inputs[7] = map(headToBorderYDistance, 0, h, 0, 1);
    //6.food x position
    // inputs[8] = map(headToBorderXDistance, 0, w, 0, 1);
    return inputs;
  }

  think(foods) {
    let inputs = this.getInputs(foods);
    let action = this.brain.predict(inputs);
    // console.log(action[0]);
    if (action[0] > 0 && action[0] < 0.2 ) {
      // console.log("should move left");
      this.moveLeft();
    } else if (action[0] >= 0.2 && action[0] < 0.4) {
      // console.log("should move right");
      this.moveRight();
    } else if (action[0] >= 0.4 && action[0] < 0.6) {
      // console.log("should move down");
      this.moveDown();
    } else if (action[0] >= 0.6 && action[0] < 0.8) {
      // console.log("should move up");
      this.moveUp();
    } else {
      // console.log("should move straight");
    }
  }

    moveLeft() {
      if(this.xdir != 1) {
        this.setDir(-1, 0);
        actions.push(random(0.01,0.19));
      }
    }

    moveRight() {
      if(this.xdir != -1) {
        this.setDir(1, 0);
        actions.push(random(0.2,0.39));
      }
    }

    moveDown() {
      if(this.ydir != -1) {
        this.setDir(0, 1);
        actions.push(random(0.4,0.59));
      }
    }

    moveUp() {
      if(this.ydir != 1) {
        this.setDir(0, -1);
        actions.push(random(0.60,0.79));
      }
    }

  recordTraining(foods) {
    let inputs = this.getInputs(foods);
    //record outputs
    let output = random(0.8,0.99);
    if(actions.length != 0) {
      output = actions.pop();
      let singleRecord = new Record(inputs,[output]);
      records.push(singleRecord);
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
    if (this.starve >= 100) {
      this.score = this.score / 10;
      return true;
    } else {
      return false
    }
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.body.push(head);
    this.score+=1000;
    this.starve=0;
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    return this.isThereObstacleOn(x,y);
  }

  isThereObstacleOn(x,y) {
    if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
      return true;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x == x && part.y == y) {
        return true;
      }
    }
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
