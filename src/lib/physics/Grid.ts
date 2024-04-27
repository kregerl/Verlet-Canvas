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
    data: Array<Array<GridCell>>;
    cellSize: number;

    width: number;
    height: number;

    constructor(canvasWidth: number, canvasHeight: number, cellSize: number, balls: Array<Ball>) {
        this.balls = balls;
        this.data = new Array();
        this.cellSize = cellSize;

        let width = Math.ceil(canvasWidth / cellSize) + 2;
        let height = Math.ceil(canvasHeight / cellSize) + 2;

        this.width = width;
        this.height = height;

        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < width; x++) {
                row.push(new GridCell());
            }
            this.data.push(row);
        }

        for (let ball of balls) {
            this.addBall(ball);
        }
    }

    clear() {
        for (let row of this.data) {
            for (let col of row) {
                col.clear();
            }
        }
    }

    addBall(ball: Ball) {
        let gridX = Math.floor(ball.currentPosition.x / this.cellSize) + 1
        let gridY = Math.floor(ball.currentPosition.y / this.cellSize) + 1

        let ballIndex = this.balls.indexOf(ball);

        if (!this.data[gridY][gridX]) {
            console.log("Here", gridY, gridX, ball); 
        }
        this.data[gridY][gridX].addBall(ballIndex);
    }

    removeBall(ball: Ball) {
        let gridX = Math.floor(ball.currentPosition.x / this.cellSize) + 1
        let gridY = Math.floor(ball.currentPosition.y / this.cellSize) + 1

        let ballIndex = this.balls.indexOf(ball);

        if (!this.data[gridY][gridX]) {
            console.log("Here", gridY, gridX, ball); 
        }

        this.data[gridY][gridX].removeBall(ballIndex);
    }

    pushBall(ball: Ball) {
        this.balls.push(ball);
        this.addBall(ball);
    }

    get(x: number, y: number): GridCell {
        return this.data[y][x];
    }

    lengthY(): number {
        return this.data.length;
    }

    lengthX(row: number): number {
        return this.data[row].length;
    }
}