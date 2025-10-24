<script>
	import SDMHero from './components/SDMHero.svelte';
	import TeamGrid from './components/TeamGrid.svelte';
	import SDMCTA from './components/SDMCTA.svelte';
</script>

<!-- SDM Page Container -->
<div class="relative bg-white">
	<!-- SDM Hero Section -->
	<SDMHero />

	<!-- Team Grid Section -->
	<section class="relative bg-white py-16 z-20">
		<TeamGrid />
	</section>

	<!-- SDM CTA Section -->
	<section class="relative bg-white py-16 z-20">
		<SDMCTA />
	</section>
</div>
