<script>
	import LatarBelakang from './components/LatarBelakang.svelte';
	import VisiMisi from './components/VisiMisi.svelte';
	import Statistics from './components/Statistics.svelte';
</script>

<main class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
	<!-- Hero Header -->
	<section class="pt-32 pb-16 px-4">
		<div class="max-w-7xl mx-auto text-center">
			<h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
				Tentang Kahasolusi.
			</h1>
			<div class="w-32 h-1 bg-[#004D66] mx-auto"></div>
		</div>
	</section>

	<!-- Latar Belakang Section -->
	<section class="py-16 px-4">
		<LatarBelakang />
	</section>

	<!-- Visi Misi Section -->
	<section class="py-16 px-4 bg-gray-50">
		<VisiMisi />
	</section>

	<!-- Statistics Section -->
	<section class="py-20 px-4">
		<Statistics />
	</section>
</main>
