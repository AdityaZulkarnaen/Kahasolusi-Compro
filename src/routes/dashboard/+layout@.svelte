<script>
	import "../../app.css";
	let { children } = $props();
</script>

<svelte:head>
	<title>Dashboard - Kahasolusi</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="dashboard-app">
	{@render children?.()}
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100%;
		overflow-x: hidden;
	}
	
	.dashboard-app {
		min-height: 100vh;
		background-color: #f9fafb;
		width: 100vw;
		overflow-x: hidden;
	}
	
	/* Hide any navbar/footer that might still appear */
	:global(nav),
	:global(footer) {
		display: none !important;
	}
</style>