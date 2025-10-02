<script>
	import Hero from '$lib/modules/Hero.svelte';
	import TentangKami from '$lib/modules/TentangKami.svelte';
</script>

<Hero />
<TentangKami />

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-900);
  }
</style>