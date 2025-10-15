<script>
	import TechHero from './components/TechHero.svelte';
	import TechStack from './components/TechStack.svelte';
	import TechCTA from './components/TechCTA.svelte';
</script>

<!-- Technology Page Container -->
<div class="relative bg-white">
	<!-- Tech Hero Section -->
	<TechHero />

	<!-- Tech Stack Section -->
	<section class="relative bg-white py-16 z-20">
		<TechStack />
	</section>

	<!-- Tech CTA Section -->
	<section class="relative bg-white py-16 z-20">
		<TechCTA />
	</section>
</div>
