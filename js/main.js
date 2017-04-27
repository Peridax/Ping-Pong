// Keep in mind that this was just a coding challenge.
// Made by Peridax & Jefemy

class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
  	constructor(w, h) {
      	this.pos = new Vec();
      	this.size = new Vec(w, h);
    }
}

class Ball extends Rect {
  	constructor() {
      	super(10, 10);
      	this.vel = new Vec();
    }
  
  	get left() {
      	return this.pos.x;
    }
  
  	get right() {
      	return this.pos.x + this.size.x;
    }
  
  	get top() {
      	return this.pos.y;
    }
  
  	get middle() {
    	return this.pos.y + (this.size.y / 2);
    }
  
  	get bottom() {
		return this.pos.y + this.size.y;
    }
}

class Pong extends Rect {
  	constructor() {
      	super(15, 80);
      	this.vel = new Vec();
    }
  
  	get left() {
      	return this.pos.x;
    }
  
  	get right() {
      	return this.pos.x + this.size.x;
    }
  
  	get top() {
      	return this.pos.y;
    }
  
  	get bottom() {
      	return this.pos.y + this.size.y;
    }
  	
  	get middle() {
      	return this.pos.y + (this.size.y / 2);
    }
  
	get floor() {
      	return core._canvas.height - this.size.y;
    }
}

class Core {
	constructor() {
		this.debug = true;			// Debug mode
		this.acceleration = true;		// Accelerate the ball's x velocity on paddle collision
		this.paddleSpeed = 180;			// Paddle speed, self explanatory

		this._canvas = document.getElementById('game');
		this._ctx = this._canvas.getContext('2d');
		this._lastUpdate = Date.now();
		this._ball = new Ball();
		this._p1 = new Pong();
		this._p2 = new Pong();
		this._keysDown = {};
		this._p1Score = 0;
		this._p2Score = 0;
		this._over;

		this._p1.pos.x = 10;
		this._p2.pos.x = this._canvas.width - this._p2.size.x - 10;
		this._p1.pos.y = this._canvas.height / 2 - this._p1.size.y / 2;
		this._p2.pos.y = this._canvas.height / 2 - this._p2.size.y / 2;
		this._ball.pos.x = this._canvas.width / 2 - this._ball.size.x / 2;
		this._ball.pos.y = this._canvas.height / 2 - this._ball.size.y / 2;
		this._ball.vel.x = 250;
		this._ball.vel.y = Math.floor(Math.random() * 150) - 75;
	}
}

// Initializing game data & starting game
var core = new Core();
callback();

window.addEventListener("keydown", function(e) {
	core._keysDown[e.keyCode] = true;
	keyListen();
});

window.addEventListener("keyup", function(e) {
	delete core._keysDown[e.keyCode];
	keyListen();
});

function keyListen() {
	core._p1.vel.y = 0;
	core._p2.vel.y = 0;

	for (var key in core._keysDown) {
		if (key == 87) {
			core._p1.vel.y = -core.paddleSpeed;
		} else if (key == 83) {
			core._p1.vel.y = core.paddleSpeed;
		} else {
			core._p2.vel.y = 0;
		}
		if (key == 73) {
			core._p2.vel.y = -core.paddleSpeed;
		} else if (key == 75) {
			core._p2.vel.y = core.paddleSpeed;
		} else {
			core._p2.vel.y = 0;
		}
	}
}

function callback() {
	var now = Date.now();
    var dt = now - core._lastUpdate;
    core._lastUpdate = now;

	update(dt);
	draw();
	requestAnimationFrame(callback);
}

function update(delta) {
	if (!core._over) {
		// Acceleration
		core._ball.pos.x += core._ball.vel.x * (delta / 1000);
		core._ball.pos.y += core._ball.vel.y * (delta / 1000);
		core._p1.pos.y += core._p1.vel.y * (delta / 1000);
		core._p2.pos.y += core._p2.vel.y * (delta / 1000);
		  
		// Detecting if player scored
		if (core._ball.left < 0){
			core._p2Score++;
		} else if (core._ball.right > core._canvas.width){
			core._p1Score++;
		}
      
      	// Simple core._ball bounds
		if (core._ball.right > core._canvas.width || core._ball.left < 0) {
			core._ball.vel.x = -core._ball.vel.x;
			reset();
		}
		if (core._ball.bottom > core._canvas.height || core._ball.top < 0) {
			core._ball.vel.y = -core._ball.vel.y;
		}
		 
		// core._Ball collision detection with paddle (player 1 & 2)
		if (core._ball.left < core._p1.right && core._ball.top < core._p1.bottom && core._ball.bottom > core._p1.top || core._ball.right > core._p2.left && core._ball.top < core._p2.bottom && core._ball.bottom > core._p2.top) {
			core._ball.vel.x = -core._ball.vel.x;
          
          	// core._Ball spin
			if (core._p1.vel.y != 0) {
				core._p1.vel.y < 0 ? core._ball.vel.y += core._p1.vel.y * (delta / 500) : core._ball.vel.y -= core._p1.vel.y * (delta / 500);
			} else if (core._p2.vel.y != 0) {
				core._p2.vel.y < 0 ? core._ball.vel.y += core._p2.vel.y * (delta / 500) : core._ball.vel.y -= core._p2.vel.y * (delta / 500);
			}

			// Detecting what part of the paddle the core._ball hits to bounce it more
			if (core._ball.pos.x < core._p1.right + 2 * core._ball.size.x) {
              	if (core._ball.middle < core._p1.middle) {
                    Math.floor(core._ball.vel.y -= core._p1.middle - core._ball.middle + (delta / 1000));
                    if (core.debug) {
                    	console.log('Hit core._P1 top\nBounce force:', Math.floor(core._ball.vel.y -= core._p1.middle - core._ball.middle + (delta / 1000)));
                    }
                } else {
                  	Math.floor(core._ball.vel.y += core._ball.middle - core._p1.middle - (delta / 1000));
                  	if (core.debug) {
                  		console.log('Hit core._P1 bottom\nBounce force:', Math.floor(core._ball.vel.y += core._ball.middle - core._p1.middle - (delta / 1000)));
                  	}
                }
            } else if (core._ball.pos.x > (core._p2.left - 2 * core._ball.size.x)) {
              	if (core._ball.middle < core._p2.middle) {
                    Math.floor(core._ball.vel.y -= core._p2.middle - core._ball.middle + (delta / 1000));
                    if (core.debug) {
                    	console.log('Hit core._P2 top\nBounce force:', Math.floor(core._ball.vel.y -= core._p2.middle - core._ball.middle + (delta / 1000)));
                    }
                } else {
                  	Math.floor(core._ball.vel.y += core._ball.middle - core._p2.middle - (delta / 1000));
                  	if (core.debug) {
                  		console.log('Hit core._P2 bottom\nBounce force:', Math.floor(core._ball.vel.y += core._ball.middle - core._p2.middle - (delta / 1000)));
                  	}
                }
            }

            // Accelerating the ball's X velocity
			if (core.acceleration) {
				if (core._ball.vel.x > 0) {
					core._ball.vel.x += 5;
				} else if (core._ball.vel.x < 0) {
					core._ball.vel.x -= 5;
				} else {
					core._ball.vel.x = (Math.round(Math.random() * 1 - (5 - 5) + 5));
				}
				console.log('Ball\'s X velocity: ' + core._ball.vel.x);
			}
		}
		
		// Move core._ball if behind paddle
		if ((core._ball.left <= core._p1.left || core._ball.right <= core._p1.left) && core._ball.top < core._p1.bottom && core._ball.bottom > core._p1.top) {
			core._ball.pos.x = core._ball.pos.x+(core._p1.right-core._p1.left);
		} else if ((core._ball.left >= core._p2.left || core._ball.right >= core._p2.left) && core._ball.top > core._p2.bottom && core._ball.bottom < core._p2.top) {
          	core._ball.pos.x = core._ball.pos.x+(core._p2.left-core._p2.right);
        }
      
      	// Simple paddle bounds detection
		if (core._p1.top < 0) {
			core._p1.pos.y = 0;
			core._p1.vel.y = 0;
		} else if (core._p2.top < 0) {
          	core._p2.pos.y = 0;
			core._p2.vel.y = 0;
        } else if (core._p1.bottom > core._canvas.height) {
			core._p1.pos.y = core._p1.floor;
			core._p1.vel.y = 0;
		} else if (core._p2.bottom > core._canvas.height) {
          	core._p2.pos.y = core._p2.floor;
			core._p2.vel.y = 0;
        }
      
      	// Checking if core._ball is in a straight line
      	if (core._ball.pos.x == 0 && core._ball.vel.y == 0) {
          	core._ball.vel.y = delta / 100;
        } else if (core._ball.pos.x == core._canvas.width && core._ball.vel.y == 0) {
          	core._ball.vel.y = -(delta / 100);
        }
	}
}

function draw() {
  	// Clearing canvas for next frame
  	core._ctx.clearRect(0, 0, core._canvas.width, core._canvas.height);
  
    // Background
    core._ctx.fillStyle = "#000";
    core._ctx.fillRect(0, 0, core._canvas.width, core._canvas.height);

    // Ball
    core._ctx.fillStyle = "#FFF";
    core._ctx.fillRect(core._ball.pos.x, core._ball.pos.y, core._ball.size.x, core._ball.size.y);
	  
    // Player 1
    core._ctx.fillStyle = "#FFF";
    core._ctx.fillRect(core._p1.pos.x, core._p1.pos.y, core._p1.size.x, core._p1.size.y);
		
    // Player 2
    core._ctx.fillStyle = "#FFF";
    core._ctx.fillRect(core._p2.pos.x, core._p2.pos.y, core._p2.size.x, core._p2.size.y);
  
  	// Game GUIs
  	core._ctx.font = '50pt Calibri';
  	core._ctx.textAlign = 'center';
  	core._ctx.fillText(core._p1Score + ' : ' + core._p2Score, core._canvas.width / 2, 80);
};

function reset() {
	var xNum = Math.floor(Math.random() * 2) - 1;
	if (xNum == 0) {
		xNum++;
	}
	core._p1.pos.y = core._canvas.height / 2 - core._p1.size.y / 2;
	core._p2.pos.y = core._canvas.height / 2 - core._p2.size.y / 2;
	core._ball.pos.x = core._canvas.width / 2 - core._ball.size.x / 2;
    core._ball.pos.y = core._canvas.height / 2 - core._ball.size.y / 2;
    core._ball.vel.x = 250 * xNum;
    core._ball.vel.y = Math.floor(Math.random() * 150) - 75;
    core._over = true;
    setTimeout(function() {
    	core._over = false;
    }, 3000)
}
