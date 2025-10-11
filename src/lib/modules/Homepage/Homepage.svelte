<script>
	import Hero from './components/Hero.svelte';
	import TentangKami from './components/TentangKami.svelte';
	import Client from './components/Client.svelte';
	import Kelebihan from './components/Kelebihan.svelte';
</script>

<!-- Homepage Container -->
<div class="relative bg-white">
	<!-- Hero Section -->
	<Hero />

	<!-- Tentang Kami Section - Overlapping position -->
	<div class="relative -mt-32 z-30 px-4 sm:px-6 lg:px-8">
		<TentangKami />
	</div>

	<!-- Client Section -->
	<section class="relative bg-white pt-32 z-20" data-section="client">
		<Client />
	</section>
	<!-- Kelebihan Section -->
	<section class="relative bg-white pt-32 z-20 overflow-hidden">
		<Kelebihan />
	</section>
</div>
