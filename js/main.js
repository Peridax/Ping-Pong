// Initializing game data & variables
const core = new Core();
var winner = document.getElementById('winner');
var gui = document.getElementById('gui');
var menu = document.querySelector('.menu-container');
var p1score = document.getElementById('p1score');
var p2score = document.getElementById('p2score');
var btn = document.querySelector('.start-btn');
var menutitle = document.querySelector('.title');

// Event Listeners
function keyListen(e) {
	core._p1.vel.y = 0;
	core._p2.vel.y = 0;

	for (var key in core._keysDown) {
		if (key == 87) {
			core._p1.vel.y = -core.paddleSpeed;
		} else if (key == 83) {
			core._p1.vel.y = core.paddleSpeed;
		}

		if (key == 38) {
			core._p2.vel.y = -core.paddleSpeed;
		} else if (key == 40) {
			core._p2.vel.y = core.paddleSpeed;
		}
	}
}

window.addEventListener("keydown", function(e) {
	core._keysDown[e.keyCode] = true;
	keyListen(e);
});

window.addEventListener("keyup", function(e) {
	delete core._keysDown[e.keyCode];
	keyListen(e);
});

// Game initializing function
function callback() {
	var now = Date.now();
	var dt = now - core._lastUpdate;
	core._lastUpdate = now;

	if (core._firstgame) {
		core._p1Score = 0;
		core._p2Score = 0;

		core._canvas.style.display = 'block';
		gui.style.display = 'flex';
		menu.style.display = 'none';
	};

	update(dt);
	draw();
	
	core._repeat = requestAnimationFrame(callback);
}

function update(delta) {
	if (!core._firstgame) {
		if (!core._over) {
			// Acceleration
			core._ball.pos.x += core._ball.vel.x * (delta / 1000);
			core._ball.pos.y += core._ball.vel.y * (delta / 1000);
			core._p1.pos.y += core._p1.vel.y * (delta / 1000);
			core._p2.pos.y += core._p2.vel.y * (delta / 1000);

			// Detecting if player scored
			if (core._ball.left < 0) {
				core._p2Score++;
			} else if (core._ball.right > core._canvas.width) {
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
						core._ball.vel.x += 17;
					} else if (core._ball.vel.x < 0) {
						core._ball.vel.x -= 17;
					} else {
						core._ball.vel.x = (Math.round(Math.random() * 1 - (17 - 17) + 17));
					}
					console.log('Ball\'s X velocity: ' + core._ball.vel.x);
				}
			}

			// Move ball if behind paddle
			if ((core._ball.left <= core._p1.left || core._ball.right <= core._p1.left) && core._ball.top < core._p1.bottom && core._ball.bottom > core._p1.top) {
				core._ball.pos.x = core._ball.pos.x + (core._p1.right - core._p1.left);
			} else if ((core._ball.left >= core._p2.left || core._ball.right >= core._p2.left) && core._ball.top > core._p2.bottom && core._ball.bottom < core._p2.top) {
				core._ball.pos.x = core._ball.pos.x + (core._p2.left - core._p2.right);
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
	} else {
		core._firstgame = false;
		reset();
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

	// Changing game GUIs
	p1score.innerHTML = core._p1Score;
	p2score.innerHTML = core._p2Score;

	if (core._p1Score < 3 && core._p2Score < 3) {
		setTimeout(function() {
			core._over = false;
		}, 3000);
	} else {
		core._over = true;

		if (core._p1Score >= 3) {
			menutitle.innerHTML = 'Player 1 won!';
		}
		
		if (core._p2Score >= 3) {
			menutitle.innerHTML = 'Player 2 won!';
		};

		btn.innerHTML = 'Play Again';
		menu.style.display = 'block';
		core._canvas.style.display = 'none';
		gui.style.display = 'none';

		btn.onclick = function() {
			location.reload();
		}
	}
}
