<script lang="ts">
    import { onMount } from "svelte";
    import { createScene } from "$lib/three";
    let canvas: HTMLCanvasElement;
    onMount(() => {
        createScene(canvas);
    });
</script>

<canvas bind:this={canvas} width="1920" height="500" />

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
