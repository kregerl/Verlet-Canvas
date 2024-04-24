<script lang="ts">
    import { onMount } from "svelte";
    import { Ball, Vec2 } from "./PhysicsObject";
    import { sub } from "three/examples/jsm/nodes/Nodes.js";

    let canvas: HTMLCanvasElement;
    let balls: Array<Ball> = [];
    let lastUpdate = Date.now();
    let radius = 10;

    let grid = [];
    let cellSize = 30;

    onMount(() => {
        let ctx = canvas.getContext("2d");


        // let width = Math.floor(canvas.width / cellSize) + 2;
        // let height = Math.floor(canvas.height / cellSize) + 2;
        // for (let y = -2; y <= height; y++) {
        //     let row = [];
        //     for (let x = -2; x <= width; x++) {
        //         row.push([]);
        //     }
        //     grid.push(row);
        // }



        for (let i = 0; i < 100; i++) {
            balls.push(new Ball(new Vec2(100 + i, 100), radius));
        }
        console.log(balls);

        function update(balls: Array<Ball>, deltaTime: number) {
            function applyGravity() {
                for (let ball of balls) {
                    ball.accelerate(new Vec2(50, 100));
                }
            }

            function applyConstraints() {
                for (let ball of balls) {
                    ball.applyConstraints(canvas.width, canvas.height);
                }
            }

            function updatePosition(dt: number) {
                for (let ball of balls) {
                    ball.update(dt);
                }
            }

            function solveCollisions() {
                for (let i = 0; i < balls.length; i++) {
                    let ball1 = balls[i];
                    for (let j = (i + 1); j < balls.length; j++) {
                        let ball2 = balls[j];
                        let axis = ball1.currentPosition.sub(ball2.currentPosition);
                        let dist = axis.length();
                        if (dist < (radius * 2)) {
                            let n = axis.div_n(dist);
                            let delta = (radius * 2) - dist;
                            ball1.currentPosition = ball1.currentPosition.add(n.mul_n(0.5 * delta));
                            ball2.currentPosition = ball2.currentPosition.sub(n.mul_n(0.5 * delta));
                        }
                    }
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

            for (let ball of balls) {
                ball.render(ctx);
            }
        }
        
        function loop() {
            if (canvas && ctx) {
                let now = Date.now();
                let dt = now - lastUpdate;
                lastUpdate = now;
        
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                update(balls, dt);
                render(ctx, balls);
            }
            requestAnimationFrame(loop);
        }
        loop();
    });

    function click(e: MouseEvent) {
        balls.push(new Ball(new Vec2(e.clientX, e.clientY), radius));
        
    }

</script>

<canvas on:mousedown={click} on:mousemove={click} bind:this={canvas} width="1920" height="900" />

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>