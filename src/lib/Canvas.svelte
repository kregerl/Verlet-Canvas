<script lang="ts">
    import { onMount } from "svelte";
    import { Particle, Vec2 } from "./Particle";

    let canvas: HTMLCanvasElement;

    let particles: Array<Particle> = [];

    onMount(() => {
        let width = canvas.width / 2;
        let height = canvas.height / 2;

        for (let i = 0; i < 500; i++) {
            let angle = Math.random() * Math.PI * 2;
            let radius = 10.0;
            let r = radius * Math.sqrt(Math.random());
            let x = width + r * Math.cos(angle);
            let y = height + r * Math.sin(angle);

            particles[i] = new Particle(
                new Vec2(x, y),
                Math.random() * Math.PI * 2,
            );
        }

        let ctx = canvas.getContext("2d");
        function render(
            ctx: CanvasRenderingContext2D | null,
            particles: Array<Particle>,
        ) {
            if (ctx !== null) {
                ctx.globalAlpha = 0.05;
                // ctx.filter = "blur(8px)";
                ctx.fillStyle = "#000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#2ee3ff";
                ctx.globalAlpha = 1.0;

                for (let particle of particles) {
                    particle.render(ctx);
                }
            }
        }

        function update(
            ctx: CanvasRenderingContext2D | null,
            particles: Array<Particle>,
        ) {
            if (ctx !== null) {
                for (let particle of particles) {
                    particle.update(ctx, canvas.width, canvas.height);
                }
            }
        }

        function loop() {
            update(ctx, particles);
            render(ctx, particles);
            requestAnimationFrame(loop);
        }
        loop();
        setInterval(() => {
            for (let particle of particles) {
                particle.shouldSense = true;
            }
        }, 2500)

    });
</script>

<canvas bind:this={canvas} width="1920" height="900" />

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
