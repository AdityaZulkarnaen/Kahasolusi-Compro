<script>
	import LatarBelakang from './components/LatarBelakang.svelte';
	import VisiMisi from './components/VisiMisi.svelte';
	import Statistics from './components/Statistics.svelte';
	import Foundation from './components/Foundation.svelte';
	import TeamServices from './components/TeamServices.svelte';
	import MapSection from './components/MapSection.svelte';
</script>

<main class="min-h-screen bg-white overflow-hidden">
	<!-- Hero Header -->
	<section class="pt-32 pb-16 px-4">
		<div class="max-w-7xl mx-auto text-center">
			<h1 class="text-4xl md:text-5xl font-medium font-family-sans text-gray-900 mb-4">
				Tentang Kahasolusi
			</h1>
			<div class="w-64 h-1 bg-[#004D66] mx-auto"></div>
		</div>
	</section>

	<!-- Latar Belakang Section -->
	<section class="pt-8 px-4">
		<LatarBelakang />
	</section>

	<!-- Visi Misi Section -->
	<section class="py-16 px-4 bg-white">
		<VisiMisi />
	</section>

	<!-- Statistics Section -->
	<section class="py-20 px-4">
		<Statistics />
	</section>

	<!-- Foundation Section -->
	<Foundation />

	<!-- Team & Services Section -->
	<TeamServices />

	<!-- Map Section -->
	<MapSection />
</main>
