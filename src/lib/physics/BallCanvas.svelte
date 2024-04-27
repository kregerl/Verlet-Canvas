<script lang="ts">
    import { onMount } from "svelte";
    import { Simulation } from "./Simulation";
    import { Curve } from "three";

    let canvas: HTMLCanvasElement;
    let simulation: Simulation;
    $: ballCount = simulation?.grid?.balls.filter((ball) => !isNaN(ball.currentPosition.x) && !isNaN(ball.currentPosition.y)).length ?? 0;

    onMount(() => {
        let ctx = canvas.getContext("2d");

        if (ctx) {
            simulation = new Simulation(canvas.width, canvas.height, ctx);
        }
        function loop() {
            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                simulation.simulate();                
            }
            requestAnimationFrame(loop);
        }
        loop();
    });



    function click(e: MouseEvent) {
        // let ball = new Ball(new Vec2(canvas.width / 2, 50), radius);
        // ball.accelerate(new Vec2(Math.random() * 10, 1000));
        // grid.balls.push(ball);
        console.log(simulation.grid);
        simulation.toggleEmitter = !simulation.toggleEmitter;
    }
</script>

<canvas
    on:mousedown={click}
    bind:this={canvas}
    width="1920"
    height="900"
/>

<p id="count">{ballCount}</p>


<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
