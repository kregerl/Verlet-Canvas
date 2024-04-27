import { Grid, GridCell } from "./Grid";
import { Ball, Vec2 } from "./PhysicsObject";

export class Simulation {
    readonly debugCells = true;
    readonly debugGrid = true;
    readonly cellSize = 100;
    grid: Grid;
    lastUpdate: number;
    context: CanvasRenderingContext2D;

    width: number;
    height: number;

    toggleEmitter: boolean;

    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        let balls: Array<Ball> = [];
        // for (let i = 0; i < 85; i++) {
        //     balls.push(new Ball(new Vec2(135 + (i * (10 * 2)), 50), 10));
        //     balls.push(new Ball(new Vec2(140 + (i * (10 * 2)), 70), 10));
        //     balls.push(new Ball(new Vec2(144 + (i * (10 * 2)), 90), 10));
        //     balls.push(new Ball(new Vec2(150 + (i * (10 * 2)), 110), 10));
        // }
        this.grid = new Grid(width, height, this.cellSize, balls);
        this.lastUpdate = Date.now();
        this.context = context;

        this.width = width;
        this.height = height;

        this.toggleEmitter = false;
    }

    spawnBalls() {
        console.log("spawnBalls");
        for (let i = 0; i < 10; i++) {
            let pos = new Vec2(10 + (10 * 2 * i), 10);
            let ball = new Ball(pos, 10);
            ball.previousPosition.x = ball.previousPosition.x - 1.5;
            ball.previousPosition.y = ball.previousPosition.y - (i / 20) * 1.5;
            this.grid.balls.push(ball)
        }
    }

    simulate() {

        let dt = 1.0 / 60.0;

        if (this.grid.balls.length < 200 && this.toggleEmitter) {
            for (let i = 0; i < 10; i++) {
                let pos = new Vec2(10 + (10 * 2 * i), 10);
                let ball = new Ball(pos, 10);
                ball.previousPosition.x = ball.previousPosition.x - 1.5;
                ball.previousPosition.y = ball.previousPosition.y - (i / 20) * 1.5;
                this.grid.balls.push(ball)
            }
        }

        this.update(dt);
        this.render();
    }

    update(deltaTime: number) {
        let substeps = 8;
        let subDeltaTime = deltaTime / substeps;
        for (let i = substeps; i > 0; i--) {
            this.addObjectsToGrid();
            this.solveCollisions();
            this.updatePositions(subDeltaTime);
        }
    }

    render() {
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.width, this.height);

        if (this.debugGrid) {
            this.context.setLineDash([3]);
            this.context.strokeStyle = 'white';
            for (var x = 0; x < this.width; x += this.cellSize) {
                this.context.beginPath();
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.height);
                this.context.stroke();
                this.context.closePath();
            }
            for (var y = 0; y < this.height; y += this.cellSize) {
                this.context.beginPath();
                this.context.moveTo(0, y);
                this.context.lineTo(this.width, y);
                this.context.stroke();
                this.context.closePath();
            }
        }

        if (this.debugCells) {
            for (let y = 1; y < this.grid.lengthY(); y++) {
                for (let x = 1; x < this.grid.lengthX(y); x++) {
                    if (this.grid.get(x, y).objects.length > 0) {
                        let cellX = (x * this.cellSize) - this.cellSize;
                        let cellY = (y * this.cellSize) - this.cellSize;
                        this.context.fillStyle = 'red';
                        this.context.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    }
                }
            }
        }

        for (let ball of this.grid.balls) {
            ball.render(this.context);
        }
    }

    addObjectsToGrid() {
        this.grid.clear();
        for (let i = 0; i < this.grid.balls.length; i++) {
            let ball = this.grid.balls[i];
            let pos = ball.currentPosition;
            this.grid.addBall(ball);
        }
    }

    solveCollisions() {
        for (let x = 1; x < this.grid.width - 1; x++) {
            for (let y = 1; y < this.grid.height - 1; y++) {
                let cell = this.grid.get(x, y);
                this.processCell(cell, new Vec2(x, y));
            }
        }
    }

    processCell(cell: GridCell, cellIndex: Vec2) {
        for (let ballIndex of cell.objects) {
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y + 1));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y - 1));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y + 1));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y - 1));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y + 1));
            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y - 1));
        }
    }

    checkBallCollisions(ballIndex: number, cell: GridCell) {
        for (let secondBallIndex of cell.objects) {
            if (ballIndex !== secondBallIndex) {
                this.solveBallCollision(ballIndex, secondBallIndex);
            }
        }
    }

    solveBallCollision(firstBallIndex: number, secondBallIndex: number) {
        let ball1 = this.grid.balls[firstBallIndex];
        let ball2 = this.grid.balls[secondBallIndex];

        let axis = ball1.currentPosition.sub(ball2.currentPosition);
        let dist = axis.length();
        if (dist < ball1.radius + ball2.radius && dist * dist > 0.0001) {
            let n = axis.div_n(dist);
            let delta = ball1.radius + ball2.radius - dist;
            ball1.currentPosition = ball1.currentPosition.add(
                n.mul_n(0.5 * delta),
            );

            ball2.currentPosition = ball2.currentPosition.sub(
                n.mul_n(0.5 * delta),
            );
        }
    }

    updatePositions(deltaTime: number) {
        for (let ball of this.grid.balls) {
            ball.accelerate(new Vec2(0, 1000));
            ball.update(deltaTime);

            ball.applyConstraints(this.width, this.height);
        }
    }
}