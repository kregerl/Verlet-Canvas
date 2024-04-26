import { Grid } from "./Grid";

export class Simulation {
    readonly cellSize = 100;
    grid: Grid;
    lastUpdate: number;
    context: CanvasRenderingContext2D;


    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        this.grid = new Grid(width, height, this.cellSize, []);
        this.lastUpdate = Date.now();
        this.context = context;
    }

    simulate() {
        let now = Date.now();
        let dt = now - this.lastUpdate;
        this.lastUpdate = now;

        this.update(dt);
        this.render();
    }

    update(deltaTime: number) {
    }


    render() {

    }
}