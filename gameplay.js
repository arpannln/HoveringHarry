/** Based on the original Copter game*/

var HoveringHarry = {
  //give our character some attributes
  character : {
    x: 50,
    y: 200,
    velocity: 0,
    degree: 0,
    width : 100,
    height : 60,
    fastest : 5,
    acceleration: 0.2,
    gravity : .05,
    image : "https://res.cloudinary.com/arpannln/image/upload/v1518485318/DopeHarry.png",
  },

  obstacles : {
    x: [],
    y: [],
    velocity: 3,
    width: 150,
    height: 80,
    rate: 3,
  },

  snitch : {
    x: null,
    y: null,
    velocity: 5,
    width: 30,
    height: 30,
  },

  score: 0,

  click: true,

  canvas: null,

  gameover: false,

  obstacleDelay: 0, //to stop massing of obstacles

  snitchDelay: 100,

  highestScore: 0,

  resetGame: function() {
    var body = document.getElementById("HoveringHarry");
    let child = document.getElementById("gameover");
    let child2 = document.getElementById("HoveringHarryCanvas");
    console.log(child);
    body.removeChild(child);
    body.removeChild(child2);
    this.obstacles.x = [];
    this.obstacles.y = [];
    this.obstacles.velocity = 3;
    this.obstacles.rate = 3;
    this.gameover = false;
    this.newRender = null;
  },
  //create main gameplay canvas
  createCanvas: function() {
    var canvas = document.createElement("canvas");
    canvas.id = "HoveringHarryCanvas";
    canvas.width = 800;
    canvas.height = 500;

    var body = document.getElementById("HoveringHarry");

    body.appendChild(canvas);

    this.ctx = canvas.getContext("2d");

    return canvas;

  },

  init: function() {
    this.canvas = this.createCanvas();
    // let that = this;
    // that.spaceListener = that.spaceListener.bind(this);
    // that.stop = that.stop.bind(this);
    // document.addEventListener("keyup", that.stop, false);
    // document.addEventListener("keydown", that.spaceListener, false);
    this.mouseListener();
    this.createCharacter();
    this.newRender = setInterval('HoveringHarry.draw()', 10);
  },


  //record user mouse interactions
  mouseListener: function() {
    var that = this;
    document.onmousedown = function(e) {
      if (event.target.id === "HoveringHarryCanvas") {
        if (that.gameover === true) {
          that.resetGame();
          that.init();
        }
        that.click = false;
      }

    };

    document.onmouseup = function() {
      that.click = true;
    };
  },
  //spacebar listener
  // stop: function (e) {
  //   e.preventDefault();
  //   this.click = false;
  // },
  //
  // spaceListener: function(e) {
  //   if (e.keyCode === 32) {
  //     e.preventDefault();
  //     this.click = true;
  //   }
  // },

  createCharacter: function() {


    if (this.click === true) {
      this.character.velocity -= this.character.acceleration;
      if (this.character.velocity < -this.character.fastest) this.character.velocity = -this.character.fastest; //reset incase too fast
    } else {
      this.character.velocity = this.character.velocity + this.character.gravity;
      if (this.character.velocity < 3) this.character.velocity = 3;
    }

    this.character.y = this.character.y + this.character.velocity;

    //position adjustment, Harry is not allowed to leave the screen breh

    if (this.character.y < 0) this.character.y = 0;
    if (this.character.y + this.character.height > 500) {
      this.character.y = 500 - this.character.height;
      this.character.velocity = this.character.velocity - this.character.gravity;
    }

    this.ctx.save();
    this.ctx.translate(this.character.x, this.character.y);

    var wizard = new Image();
    wizard.src = this.character.image;
    var that = this;
    wizard.onload = function() {
      that.ctx.drawImage(wizard, that.character.x, that.character.y, that.character.width, that.character.height);
    };

    this.ctx.restore();
  },
  // plan is to generate like 3-4 randomly, once one moves off the map we need to reset
  // the cloud at a new y location
  // jk generate 1 and make sure theres only 3 max
  createObstacle: function() {
    if (this.obstacles.x.length < 5) {
      this.obstacles.x.push(800);
      this.obstacles.y.push(Math.floor(Math.random()*500));
      let x = this.obstacles.x[this.obstacles.x.length-1];
      let y = this.obstacles.y[this.obstacles.y.length-1];
      this.ctx.save();
      this.ctx.translate(x, y);

      var cloud = new Image();
      cloud.src = "https://res.cloudinary.com/arpannln/image/upload/v1518505067/dementor.png";
      var that = this;
      cloud.onload = function() {
        that.ctx.drawImage(cloud, x, y, that.obstacles.width, that.obstacles.height);
      };

      this.ctx.restore();
    }
  },

  recreateObstacles: function() {
    if (this.score % 500 === 0 && this.score !== 0) {
      this.obstacles.rate += .05;
    }
    for (var i = 0; i < this.obstacles.x.length; i++) {
      let x = this.obstacles.x[i];
      let y = this.obstacles.y[i];
      if (x > -100) {
        x -= this.obstacles.rate;
        this.obstacles.x[i] = x;
      } else {
        this.obstacles.x.shift();
        this.obstacles.y.shift();
      }

      this.ctx.save();
      this.ctx.translate(x, y);

      var cloud = new Image();
      cloud.src = "https://res.cloudinary.com/arpannln/image/upload/v1518505067/dementor.png";
      var that = this;
      cloud.onload = function() {
        that.ctx.drawImage(cloud, x, y, that.obstacles.width, that.obstacles.height);
      };

      this.ctx.restore();
    }
  },

  createSnitch: function() {
    this.snitch.x = 800;
    this.snitch.y = Math.floor(Math.random()*500);
    let x = this.snitch.x;
    let y = this.snitch.y;
    this.ctx.save();
    this.ctx.translate(x, y);

    var snitch = new Image();
    snitch.src = "http://res.cloudinary.com/arpannln/image/upload/v1518497984/snitch.png";
    var that = this;
    snitch.onload = function() {
      that.ctx.drawImage(snitch, x, y, that.snitch.width, that.snitch.height);
    };

    this.ctx.restore();
  },

  recreateSnitch: function() {
    this.snitch.x -= this.snitch.velocity;
    let options = [-this.snitch.velocity, this.snitch.velocity];
    this.snitch.y = this.snitch.y + options[Math.floor(Math.random()*options.length)];
    let x = this.snitch.x;
    let y = this.snitch.y;
    this.ctx.save();
    this.ctx.translate(x, y);

    var snitch = new Image();
    snitch.src = "http://res.cloudinary.com/arpannln/image/upload/v1518497984/snitch.png";
    var that = this;
    snitch.onload = function() {
      that.ctx.drawImage(snitch, x, y, that.snitch.width, that.snitch.height);
    };

    this.ctx.restore();
  },

  caughtSnitch: function() {
    if ((this.snitch.x > this.character.x && this.snitch.x < (this.character.x + this.character.width)) &&
       (this.snitch.y > this.character.y && this.snitch.y < (this.character.y + this.character.height))) {
         this.score += 100;
         this.snitch.y = 900;
         this.snitch.x = 1500;
         this.obstacles.rate = 3;
    }
  },
  //loop through all the obstacles and see if theres an overlap between character and obs
  checkImpact: function () {
    for (var i = 0; i < this.obstacles.x.length; i++) {
      if (
        this.character.x + this.character.width >= this.obstacles.x[i]
      ) {
        if (
          (!(this.character.y + 12 >= this.obstacles.y[i] + this.obstacles.height ||
            this.character.y + this.character.height - 14 <= this.obstacles.y[i])) &&
            (this.character.x >= (this.obstacles.x[i] + (this.obstacles.width*1/5))) &&
            (this.character.x <= (this.obstacles.x[i] + (this.obstacles.width*2/5)))
          ) {
            console.log(1);
            this.endGame();
            break;
          }
        if (
          (!(this.character.y + 15 >= this.obstacles.y[i] + this.obstacles.height ||
            this.character.y + this.character.height - 20 <= this.obstacles.y[i])) &&
            (this.character.x >= (this.obstacles.x[i] + (this.obstacles.width*1/5))) &&
            (this.character.x <= (this.obstacles.x[i] + (this.obstacles.width*2/5)))
          ) {
            console.log(2);
            this.endGame();
            break;
          }
        if (
         (!(this.character.y + 20 >= this.obstacles.y[i] + this.obstacles.height ||
         this.character.y + this.character.height - 25 <= this.obstacles.y[i])) &&
         (this.character.x >= (this.obstacles.x[i] + (this.obstacles.width*2/5))) &&
         (this.character.x <= (this.obstacles.x[i] + (this.obstacles.width*3/5)))
        ) {
            console.log(3);
            this.endGame();
            break;
          }
        if (
          (!(this.character.y + 50 >= this.obstacles.y[i] + this.obstacles.height ||
            this.character.y + this.character.height - 40 <= this.obstacles.y[i])) &&
            (this.character.x >= (this.obstacles.x[i] + (this.obstacles.width*3/5))) &&
            (this.character.x <= (this.obstacles.x[i] + (this.obstacles.width*4/5)))
          ) {
            console.log(4);
            this.endGame();
            break;
          }
        if (
          (!(this.character.y + 70 >= this.obstacles.y[i] + this.obstacles.height ||
            this.character.y + this.character.height - 70 <= this.obstacles.y[i])) &&
            (this.character.x >= (this.obstacles.x[i] + (this.obstacles.width*4/5))) &&
            (this.character.x <= (this.obstacles.x[i] + (this.obstacles.width)))
          ) {
            console.log(5);
            this.endGame();
          }
        }
      // if (
      //   this.obstacles.y[i] >= this.obstacles
      // )
    }
  },

  endGame: function() {
    this.gameover = true;
    let gameover = document.createElement("h1");
    gameover.id = "gameover";
    let text = document.createTextNode("You're a Muggle Harry");
    // let text2 = document.createTextNode("Click to Prove Me Wrong");
    gameover.appendChild(text);
    // gameover.appendChild(text2);
    clearInterval(this.newRender);
    var body = document.getElementById("HoveringHarry");
    body.appendChild(gameover);
    if (this.score > this.highestScore) this.highestScore = this.score;
    this.score = 0;
  },

  displayScore: function() {
    this.ctx.font = '20pt Calibri';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`Highest: ${this.highestScore} Score: ${this.score}`, 500, 50);
  },



  draw: function() {
    this.ctx.clearRect(0, 0, 800, 500);
    this.createCharacter();
    if (this.obstacleDelay === 50) {
      this.createObstacle();
      this.obstacleDelay = 0;
      this.score += 20;
    } else {
      this.obstacleDelay += 1;
    }
    this.recreateObstacles();
    if (this.snitchDelay === 300) {
      this.createSnitch();
      this.snitchDelay = 0;
    } else {
      this.snitchDelay += 1;
    }
    this.recreateSnitch();
    this.caughtSnitch();
    this.checkImpact();
    this.displayScore();
  }




};

//white circle incase harry head don't work :(
//this.ctx.beginPath();
// this.ctx.arc(this.character.x, this.character.y,5,0,2*Math.PI);
// this.ctx.stroke();
// this.ctx.fillStyle = "#ffffff";
// this.ctx.fill();
//
// this.ctx.restore();
// if (
//  (!(this.character.y  >= this.obstacles.y[i] + this.obstacles.height ||
//  this.character.y + this.character.height <= this.obstacles.y[i])) &&
//  (this.character.x >= (this.obstacles.x[i] + (this.obstacles.width*2/5))) &&
//  (this.character.x <= (this.obstacles.x[i] + (this.obstacles.width*3/5)))
// ) {
