<script lang="ts">
    export let src: string;
    export let href: string;
</script>

<div class="circle">
    <a {href}>
        <img alt="about" {src} />
    </a>
</div>

<style>
    * {
        --size: 3.2rem;
    }

    a {
        width: 100%;
        height: 100%;
    }

    img {
        width: 100%;
        height: 100%;
        opacity: var(--high-emphasis);
    }

    .circle {
        border: 2px solid rgba(255, 255, 255, var(--high-emphasis));
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px;
    }

    .circle:hover {
        opacity: 67%;
        cursor: pointer;
    }
</style>
