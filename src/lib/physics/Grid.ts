import type { Ball } from "./PhysicsObject";

export class GridCell {
    objects: Array<number>;

    constructor() {
        this.objects = [];
    }

    clear() {
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

        let width = Math.ceil(canvasWidth / cellSize);
        let height = Math.ceil(canvasHeight / cellSize);

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

    clear() {
        for (let row of this.grid) {
            for (let col of row) {
                col.clear();
            }
        }
    }

    addBall(ball: Ball) {
        let gridX = Math.floor(ball.currentPosition.x / this.cellSize)
        let gridY = Math.floor(ball.currentPosition.y / this.cellSize)

        // let gridX = Math.ceil(ball.currentPosition.x / this.cellSize)
        // let gridY = Math.ceil(ball.currentPosition.y / this.cellSize)
        let ballIndex = this.balls.indexOf(ball);

        if (!this.grid[gridY][gridX]) {
            console.log("Here", gridY, gridX, ball); 
        }
        this.grid[gridY][gridX].addBall(ballIndex);
    }

    removeBall(ball: Ball) {
        let gridX = Math.floor(ball.currentPosition.x / this.cellSize)
        let gridY = Math.floor(ball.currentPosition.y / this.cellSize)

        // let gridX = Math.ceil(ball.currentPosition.x / this.cellSize)
        // let gridY = Math.ceil(ball.currentPosition.y / this.cellSize)
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