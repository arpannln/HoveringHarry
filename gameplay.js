/** Based on the original Copter game*/

var HoveringHarry = {
  //give our character some attributes
  character : {
    x: 50,
    y: 0,
    velocity: 0,
    degree: 0,
    width : 100,
    height : 100,
    fastest : 5,
    acceleration: 0.2,
    gravity : .15,
  },

  click: false,

  canvas: null,

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

    this.ctx.save();
    this.ctx.translate(this.character.x, this.character.y);

    var wizard = new Image();
    wizard.src = "HarryHead.jpeg";
    var that = this;
    wizard.onload = function() {
      that.ctx.drawImage(wizard, that.character.x, that.character.y, that.character.width, that.character.height);
    };

    this.ctx.restore();
  },

  draw: function() {
    this.ctx.clearRect(0, 0, 800, 500);
    this.createCharacter();
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
