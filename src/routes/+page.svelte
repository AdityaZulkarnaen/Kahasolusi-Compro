<script>
	import Hero from '$lib/modules/Hero.svelte';
</script>

<Hero />

<style lang="postcss">
  @reference "tailwindcss";

  :global(html) {
    background-color: theme(--color-gray-900);
  }
</style>