
export class Vec2 {
    static ZERO: Vec2 = new Vec2(0,0);

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(vec: Vec2): Vec2 {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    add_n(n: number): Vec2 {
        return new Vec2(this.x + n, this.y + n);
    }

    sub(vec: Vec2): Vec2 {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    mul(vec: Vec2): Vec2 {
        return new Vec2(this.x * vec.x, this.y * vec.y);
    }

    mul_n(n: number): Vec2 {
        return new Vec2(this.x * n, this.y * n);
    }

    length(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    div_n(n: number) {
        return new Vec2(this.x / n, this.y / n);
    }
}

export class Ball {
    currentPosition: Vec2;
    previousPosition: Vec2;
    acceleration: Vec2;
    radius: number;
    
    constructor(pos: Vec2, radius: number) {
        this.currentPosition = pos;
        this.previousPosition = pos;
        this.acceleration = Vec2.ZERO;
        this.radius = radius;
    }

    accelerate(acceleration: Vec2) {
        this.acceleration = this.acceleration.add(acceleration);
    }

    applyConstraints(width: number, height: number) {
        if (this.currentPosition.y + this.radius >= height) {
            this.currentPosition.y = height - this.radius;
        }

        if (this.currentPosition.y - this.radius <= 0) {
            this.currentPosition.y = this.radius;
        }

        if (this.currentPosition.x + this.radius >= width) {
            this.currentPosition.x = width - this.radius;
        }

        if (this.currentPosition.x - this.radius <= 0) {
            this.currentPosition.x = this.radius;
        }
    }

    update(dt: number) {
        // console.log("dt", dt);
        let time = dt / 1000;
        let velocity = this.currentPosition.sub(this.previousPosition);
        this.previousPosition = this.currentPosition;
        this.currentPosition = this.currentPosition.add(velocity).add(this.acceleration.mul_n(time * time))
        this.acceleration = Vec2.ZERO;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.currentPosition.x, this.currentPosition.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
    }
}