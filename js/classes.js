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

// Core game class
class Core {
    constructor() {
        this.debug = true; // Debug mode
        this.acceleration = true; // Accelerate the ball's x velocity on paddle collision
        this.paddleSpeed = 260; // Paddle speed, self explanatory

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
        this._ball.vel.x = 300;
        this._ball.vel.y = Math.floor(Math.random() * 150) - 75;

        this._firstgame = true;
        this._repeat;
    }
}