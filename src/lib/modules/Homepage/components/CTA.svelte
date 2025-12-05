<script>
	import { companyAPI } from '$lib/api.js';
	import { onMount } from 'svelte';

	let whatsappLink = '#';

	onMount(async () => {
		try {
			const companies = await companyAPI.get();
			if (companies && companies.length > 0) {
				let phone = companies[0].phone;
				// Bersihkan dari karakter non-digit
				let cleanPhone = phone.replace(/\D/g, '');
				// Ganti 0 di awal dengan 62
				if (cleanPhone.startsWith('0')) {
					cleanPhone = '62' + cleanPhone.substring(1);
				}
				whatsappLink = `https://wa.me/${cleanPhone}?text=Halo%20Kahasolusi%2C%20saya%20ingin%20berkonsultasi`;
			}
		} catch (error) {
			console.error('Failed to load company phone:', error);
		}
	});

	function ctaPressed() {
		window.location.href='/layanan'
	}
</script>

<section class="w-full bg-white py-16 md:py-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- CTA Card with Gradient Masking -->
		<div class="relative bg-[#D7EDF5] rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
			<!-- Blur Circle Effect - Top Left -->
			<div class="absolute -top-36 -left-36 w-100 h-100 bg-[#176684] rounded-full blur-3xl opacity-60"></div>
			
			<!-- Blur Circle Effect - Bottom Right -->
			<div class="absolute -bottom-36 -right-36 w-100 h-100 bg-[#176684] rounded-full blur-3xl opacity-60"></div>
			
			<!-- Content -->
			<div class="relative z-10 text-center max-w-5xl mx-auto">
				<h2 class="text-2xl md:text-3xl lg:text-4xl font-regular font-family-sans text-[#176684] mb-6">
					Mulai Transformasi Digital<br />Anda dengan Kahasolusi
				</h2>
				
				<p class="text-black text-base font-family-sans font-medium md:text-lg leading-relaxed mb-8">
					Melalui inovasi digital yang tepat guna, Kahasolusi membantu bisnis dan organisasi menemukan jawaban atas setiap tantangan digital. Mulai dari website, aplikasi mobile, hingga solusi perangkat lunak custom, kami hadir sebagai mitra strategis yang benar-benar memahami kebutuhan Anda. Konsultasikan bersama kami sekarang, dan temukan bagaimana teknologi dapat mendorong pertumbuhan bisnis serta tim Anda.
				</p>
				
				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a 
						href={whatsappLink}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-[#176684] w-full md:w-1/3 lg:w-1/3 md:text-base lg:text-base text-white px-8 md:px-24 lg:px-24 py-3 rounded-full font-medium hover:bg-[#0d4d5f] transition-colors no-underline inline-block text-center">
						Hubungi Kami
					</a>
					<button 
						onclick={ctaPressed}
						class="bg-transparent w-full md:w-1/5 lg:w-1/5 text-[#176684] px-8 py-3 rounded-full font-medium hover:bg-[#9ACFDD] hover:border-[#9ACFDD] hover:text-white transition-colors border-2 border-[#176684]">
						Lihat Layanan
					</button>
				</div>
			</div>
		</div>
	</div>
</section>
