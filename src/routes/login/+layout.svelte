<script>
	import "../../app.css";
	let { children } = $props();
</script>

<!-- Layout khusus untuk halaman login tanpa navbar -->
<main class="w-full">
	{@render children?.()}
</main>

<style>
	main {
		min-height: 100vh;
	}
</style>