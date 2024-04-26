import type { Ball } from "./PhysicsObject";

export class GridCell {
    objects: Array<number>;

    constructor() {
        this.objects = [];
    }

    addBall(index: number) {
        this.objects.push(index);
    }

    removeBall(ballIndex: number) {
        let index = this.objects.indexOf(ballIndex);
        if (index !== -1) {
            this.objects.splice(index, 1);
        } 
    }
}

export class Grid {
    balls: Array<Ball>;
    grid: Array<Array<GridCell>>;
    cellSize: number;

    width: number;
    height: number;

    constructor(canvasWidth: number, canvasHeight: number, cellSize: number, balls: Array<Ball>) {
        this.balls = balls;
        this.grid = new Array();
        this.cellSize = cellSize;

        let width = Math.floor(canvasWidth / cellSize) + 1;
        let height = Math.floor(canvasHeight / cellSize);

        this.width = width;
        this.height = height;

        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < width; x++) {
                row.push(new GridCell());
            }
            this.grid.push(row);
        }

        for (let ball of balls) {
            this.addBall(ball);
        }
    }

    addBall(ball: Ball) {
        let gridX = Math.max(Math.floor(ball.currentPosition.x / this.cellSize) - 1, 0);
        let gridY = Math.max(Math.floor(ball.currentPosition.y / this.cellSize) - 1, 0);
        let ballIndex = this.balls.indexOf(ball);

        if (!this.grid[gridY][gridX]) {
            console.log("Here", gridY, gridX, ball); 
        }
        this.grid[gridY][gridX].addBall(ballIndex);
    }

    removeBall(ball: Ball) {
        let gridX = Math.max(Math.floor(ball.currentPosition.x / this.cellSize) - 1, 0);
        let gridY = Math.max(Math.floor(ball.currentPosition.y / this.cellSize) - 1, 0);
        let ballIndex = this.balls.indexOf(ball);

        if (!this.grid[gridY][gridX]) {
            console.log("Here", gridY, gridX, ball); 
        }

        this.grid[gridY][gridX].removeBall(ballIndex);
    }

    pushBall(ball: Ball) {
        this.balls.push(ball);
        this.addBall(ball);
    }

    get(x: number, y: number): GridCell {
        return this.grid[y][x];
    }
}