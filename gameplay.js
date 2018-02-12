/** Based on the original Copter game*/

var HoveringHarry = {
  //give our character some attributes
  character : {
    x: 50,
    y: 0,
    velocity: 0,
    degree: 0,
    width : 50,
    height : 50,
    fastest : 5,
    acceleration: 0.2,
    gravity : .15,
    image : "HarryHead.jpeg",
  },

  obstacles : {
    x: [],
    y: [],
    velocity: 3,
    width: 150,
    height: 80,
    cloudrate: 3,
  },

  click: false,

  canvas: null,

  gameover: false,

  obstacleDelay: 0, //to stop massing of obstacles

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
    this.mouseListener();
    this.createCharacter();
    this.newRender = setInterval('HoveringHarry.draw()', 10);
  },
  //record user mouse interactions
  mouseListener: function() {
    var that = this;
    document.onmousedown = function(e) {
      if (event.target.id === "HoveringHarryCanvas") {
        that.click = true;

      }

    };

    document.onmouseup = function() {
      that.click = false;
    };
  },

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
    if (this.character.y + this.character.height > 500) this.character.y = 500;


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
      cloud.src = "http://res.cloudinary.com/arpannln/image/upload/v1518456320/cloud.png";
      var that = this;
      cloud.onload = function() {
        that.ctx.drawImage(cloud, x, y, that.obstacles.width, that.obstacles.height);
      };

      this.ctx.restore();
    }
  },

  recreateObstacles: function() {
    for (var i = 0; i < this.obstacles.x.length; i++) {
      let x = this.obstacles.x[i];
      let y = this.obstacles.y[i];
      if (x > -100) {
        x -= this.obstacles.cloudrate;
        this.obstacles.x[i] = x;
      } else {
        this.obstacles.x.shift();
        this.obstacles.y.shift();
      }

      this.ctx.save();
      this.ctx.translate(x, y);

      var cloud = new Image();
      cloud.src = "http://res.cloudinary.com/arpannln/image/upload/v1518456320/cloud.png";
      var that = this;
      cloud.onload = function() {
        that.ctx.drawImage(cloud, x, y, that.obstacles.width, that.obstacles.height);
      };

      this.ctx.restore();
    }
  },
  //loop through all the obstacles and see if theres an overlap between character and obs
  checkImpact: function () {
    for (var i = 0; i < this.obstacles.x.length; i++) {
      if (
        this.character.x + this.character.width >= this.obstacles.x[i]
      ) {
        if (
          !(this.character.y  >= this.obstacles.y[i] + this.obstacles.height ||
          this.character.y + this.character.height <= this.obstacles.y[i])
        ) {
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
    let text = document.createTextNode("GG Harry");
    gameover.appendChild(text);
    clearInterval(this.newRender);
    var body = document.getElementById("HoveringHarry");
    body.appendChild(gameover);
  },

  draw: function() {
    this.ctx.clearRect(0, 0, 800, 500);
    this.createCharacter();
    if (this.obstacleDelay === 50) {
      this.createObstacle();
      this.obstacleDelay = 0;
    } else {
      this.obstacleDelay += 1;
    }
    this.recreateObstacles();
    this.checkImpact();
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
