<script>
	import HeroBackground from '$lib/assets/images/HeroBackground.jpg';
    import { ArrowRight } from 'lucide-svelte';
</script>

<section class="relative h-[135vh] flex items-center justify-center bg-gray-900 rounded-b-3xl overflow-hidden">
	<!-- Background Image -->
	<div class="absolute inset-0 bg-cover bg-center z-0" style="background-image: url({HeroBackground});"></div>
	
	<!-- Overlay Gradient -->
	<div class="absolute inset-0 z-10 opacity-43" style="background: linear-gradient(to bottom, #000000 23%, #1F4353 67.23%, #367590 100%);"></div>
	
	<div class="w-full h-screen mx-auto relative z-20 flex self-start justify-center items-center">
		<div class="w-[85%] h-fit animate-fade-in-up flex-col align-start mt-[8%]">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold font-family-sans text-white leading-tight mb-6 drop-shadow-lg">
				Solusi Digital Inovatif untuk<br class="hidden sm:block">
				Masa Depan Bisnis Anda
			</h1>
			<p class="text-base md:text-lg text-white/90 font-family-sans leading-relaxed mb-8 drop-shadow">
				Kahasolusi menghadirkan layanan pengembangan<br class="hidden sm:block">
				teknologi berbasis website dan mobile apps<br class="hidden sm:block">
				dengan kualitas terbaik, menghubungkan ide Anda<br class="hidden sm:block">
				dengan solusi nyata.
			</p>
			<button class="inline-flex items-center gap-2 bg-[#176684] font-family-sans text-white px-8 py-4 rounded-full text-base font-semibold hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/30 transition-all group">
				Hubungi Kami
                <ArrowRight class="w-5 h-5" />
			</button>
		</div>
	</div>
</section>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 1s ease-out;
	}
</style>
