import { Grid, GridCell } from "./Grid";
import { Ball, Vec2 } from "./PhysicsObject";

export class Simulation {
    readonly debug = true;
    readonly cellSize = 100;
    grid: Grid;
    lastUpdate: number;
    context: CanvasRenderingContext2D;

    width: number;
    height: number;

    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        let balls: Array<Ball> = [];
        for (let i = 0; i < 10; i++) {
            balls.push(new Ball(new Vec2(110 + (i * (10 * 2)), 50), 10));
            balls.push(new Ball(new Vec2(110 + (i * (10 * 2)), 100), 10));
        }
        this.grid = new Grid(width, height, this.cellSize, balls);
        this.lastUpdate = Date.now();
        this.context = context;

        this.width = width;
        this.height = height;
    }

    simulate() {
        let now = Date.now();
        let dt = now - this.lastUpdate;
        this.lastUpdate = now;

        this.update(dt);
        this.render();
    }

    update(deltaTime: number) {
        let substeps = 6;
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

        for (let y = 0; y < this.grid.grid.length; y++) {
            for (let x = 0; x < this.grid.grid[y].length; x++) {
                if (this.grid.grid[y][x].objects.length > 0 && this.debug) {
                    let cellX = x * this.cellSize;
                    let cellY = y * this.cellSize;
                    this.context.fillStyle = 'red';
                    this.context.fillRect(cellX, cellY, this.cellSize, this.cellSize);
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
            if (pos.x > 1 && pos.x < this.width - 1 && pos.y > 1 && pos.y < this.height - 1) {
                this.grid.addBall(ball);
            }
        }
    }

    solveCollisions() {
        for (let x = 0; x < this.grid.width; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                let cell = this.grid.get(x, y);
                this.processCell(cell, new Vec2(x, y));
            }
        }
    }

    processCell(cell: GridCell, cellIndex: Vec2) {
        for (let ballIndex of cell.objects) {
            if (cellIndex.x - 1 > 0 && cellIndex.x < this.grid.width) {
                this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y));

                if (cellIndex.y + 1 < this.grid.height && cellIndex.y > 0) {
                    this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y + 1));
                }

                if (cellIndex.y - 1 > 0 && cellIndex.y < this.grid.height) {
                    this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y - 1));
                }
            }

            if (cellIndex.x + 1 < this.grid.width && cellIndex.x > 0) {
                this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y));

                if (cellIndex.y + 1 > this.grid.height && cellIndex.y > 0) {
                    this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y + 1));
                }

                if (cellIndex.y - 1 > 0 && cellIndex.y < this.grid.height) {
                    this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y - 1));
                }
            }

            this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y));
            
            if (cellIndex.y + 1 > this.grid.height && cellIndex.y > 0) {
                this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y + 1));
            }

            if (cellIndex.y - 1 > 0 && cellIndex.y < this.grid.height) {
                this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y - 1));
            }


            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y + 1));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x - 1, cellIndex.y - 1));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y + 1));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x, cellIndex.y - 1));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y + 1));
            // this.checkBallCollisions(ballIndex, this.grid.get(cellIndex.x + 1, cellIndex.y - 1));
        }
    }

    checkBallCollisions(ballIndex: number, cell: GridCell) {
        for (let secondBallIndex of cell.objects) {
            if (ballIndex === secondBallIndex) {
                continue;
            }
            this.solveBallCollision(ballIndex, secondBallIndex);
        }
    }

    solveBallCollision(firstBallIndex: number, secondBallIndex: number) {
        let ball1 = this.grid.balls[firstBallIndex];
        let ball2 = this.grid.balls[secondBallIndex];
        let axis = ball1.currentPosition.sub(ball2.currentPosition);
        let dist = axis.length();
        if (dist < ball1.radius + ball2.radius) {
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

            if (ball.currentPosition.x > this.width - ball.radius) {
                ball.currentPosition.x = this.width - ball.radius;
            } else if (ball.currentPosition.x < ball.radius) {
                ball.currentPosition.x = ball.radius;
            }

            if (ball.currentPosition.y > this.height - ball.radius) {
                ball.currentPosition.y = this.height - ball.radius;
            } else if (ball.currentPosition.y < ball.radius) {
                ball.currentPosition.y = ball.radius;
            }
        }
    }
}