<script lang="ts">
    import { onMount } from "svelte";
    import { Ball, Vec2 } from "./PhysicsObject";
    import { Grid, GridCell } from "./Grid";
    import { Simulation } from "./Simulation";

    let canvas: HTMLCanvasElement;
    let lastUpdate = Date.now();
    let radius = 10;

    let grid: Grid;

    let simulation: Simulation;

    onMount(() => {
        let ctx = canvas.getContext("2d");

        if (ctx) {
            simulation = new Simulation(canvas.width, canvas.height, ctx);
        }

        let balls: Array<Ball> = [];
        for (let i = 0; i < 10; i++) {
            balls.push(new Ball(new Vec2(100 + (i * (radius * 2)), 100), radius));
        }
        grid = new Grid(canvas.width, canvas.height, 100, balls);
        console.log("First", grid);

        function update(deltaTime: number) {
            function applyGravity() {
                for (let ball of grid.balls) {
                    ball.accelerate(new Vec2(0, 1000));
                }
            }

            function applyConstraints() {
                for (let ball of grid.balls) {
                    ball.applyConstraints(canvas.width, canvas.height);
                }
            }

            function updatePosition(dt: number) {
                for (let ball of grid.balls) {
                    ball.update(dt);
                    grid.removeBall(ball);
                    grid.addBall(ball);

                    if (
                        ball.currentPosition.x < 0 ||
                        ball.currentPosition.x > canvas.width ||
                        ball.currentPosition.y < 0 ||
                        ball.currentPosition.y > canvas.height
                    ) {
                        console.log("Ball outside world", ball.currentPosition);
                    }
                }
            }

            function solveCellCollisions(current: GridCell, other: GridCell) {
                if (current === other) {
                    let x = 1;
                }

                for (let ball1Index of current.objects) {
                    for (let ball2Index of other.objects) {
                        if (ball1Index == ball2Index) {
                            continue;
                        }

                        let ball1 = grid.balls[ball1Index];
                        let ball2 = grid.balls[ball2Index];
                        solveCollision(ball1, ball2);
                    }
                }
            }

            function solveCollisions() {
                for (let y = 0; y < grid.height; y++) {
                    for (let x = 0; x < grid.width; x++) {
                        let currentCell = grid.get(x, y);
                        solveCellCollisions(currentCell, currentCell); 
                        // for (let dx = -1; dx < 1; dx++) {
                        //     for (let dy = -1; dy < 1; dy++) {
                        //         let otherCell = grid.get(x + dx, y + dy);
                        //         solveCellCollisions(currentCell, otherCell); 
                        //     }
                        // }
                    }
                }



                // for (let i = 0; i < grid.balls.length; i++) {
                //     let ball1 = grid.balls[i];
                //     for (let j = i + 1; j < grid.balls.length; j++) {
                //         let ball2 = grid.balls[j];
                //         solveCollision(ball1, ball2);
                //     }
                // }
            }

            function solveCollision(ball1: Ball, ball2: Ball) {
                let axis = ball1.currentPosition.sub(ball2.currentPosition);
                let dist = axis.length();
                if (dist < ball1.radius + ball2.radius) {
                    let n = axis.div_n(dist);
                    let delta = ball1.radius + ball2.radius - dist;
                    ball1.currentPosition = ball1.currentPosition.add(
                        n.mul_n(0.5 * delta),
                    );
                    grid.removeBall(ball1);
                    grid.addBall(ball1);

                    ball2.currentPosition = ball2.currentPosition.sub(
                        n.mul_n(0.5 * delta),
                    );
                    grid.removeBall(ball2);
                    grid.addBall(ball2);
                }
            }

            let substeps = 6;
            let subDeltaTime = deltaTime / substeps;
            for (let i = substeps; i > 0; i--) {
                applyGravity();
                applyConstraints();
                solveCollisions();
                updatePosition(subDeltaTime);
            }
        }

        function render(ctx: CanvasRenderingContext2D, balls: Array<Ball>) {
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let ball of grid.balls) {
                ball.render(ctx);
            }
        }

        function loop() {
            if (canvas && ctx) {
                let now = Date.now();
                let dt = now - lastUpdate;
                lastUpdate = now;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                update(dt);
                render(ctx, balls);
            }
            requestAnimationFrame(loop);
        }
        loop();
    });



    function click(e: MouseEvent) {
        let ball = new Ball(new Vec2(canvas.width / 2, 50), radius);
        ball.accelerate(new Vec2(Math.random() * 10, 1000));
        grid.balls.push(ball);
        console.log(grid);
    }
</script>

<canvas
    on:mousedown={click}
    bind:this={canvas}
    width="1920"
    height="900"
/>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
