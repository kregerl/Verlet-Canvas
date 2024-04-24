<script lang="ts">
    import Canvas from "$lib/Canvas.svelte";
    import ContactButton from "$lib/ContactButton.svelte";
    import BallCanvas from "$lib/physics/BallCanvas.svelte";
</script>

<BallCanvas />

<div class="landing">
    <div class="center">
        <!-- <h1>Loucas Kreger</h1>
        <h2>Software Engineer</h2>
        <div class="links">
            <ContactButton src="about.svg" href=""/>
            <ContactButton src="email.svg" href="mailto:loucas.kreger@gmail.com"/>
            <ContactButton src="github.svg" href="https://www.github.com/kregerl"/>
            <ContactButton src="linkedin.svg" href="https://www.linkedin.com/in/loucas-kreger"/>
            <ContactButton src="doc.svg" href=""/>
        </div> -->
    </div>
</div>

<!-- <style>

.landing {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* background-color: black; */
        margin: 0px 0px 0px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .links {
        height: 3.5rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    h1,
    h2 {
        text-align: center;
        color: white;
        opacity: 88%;
    }
</style> -->
