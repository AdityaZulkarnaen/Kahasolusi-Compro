<script>
	import coders from '$lib/assets/images/coders.png';
	import working from '$lib/assets/images/working.png';
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

	const cards = [
		{
			title: 'Kenali Tim Kami.',
			description:
				'Setiap keberhasilan proyek Kahasolusi lahir dari tim yang berdedikasi dan berbakat. Dengan pengalaman beragam sekolah serta keahlian mendalam di bidangnya, tim kami bekerja dengan semangat kolaborasi dan profesionalisme tinggi untuk menghadirkan solusi terbaik bagi setiap klien.',
			buttonText: 'Meet Our Team',
			image: coders
		},
		{
			title: 'Layanan Kami.',
			description:
				'Setiap keberhasilan proyek Kahasolusi lahir dari tim yang berdedikasi dan berbakat. Dengan pengalaman beragam sekolah serta keahlian mendalam di bidangnya, tim kami bekerja dengan semangat kolaborasi dan profesionalisme tinggi untuk menghadirkan solusi terbaik bagi setiap klien.',
			buttonText: 'Konsultasi Sekarang',
			image: working
		}
	];
</script>

<section class="w-full bg-white py-16 md:py-20 lg:py-24 px-4 sm:px-6">
	<div class="max-w-7xl mx-auto">
		<!-- Cards Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16 md:mb-20">
			{#each cards as card}
				<div class="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
					<!-- Background Image with Overlay -->
					<div class="relative h-[450px] md:h-[500px]">
						<img
							src={card.image}
							alt={card.title}
							class="w-full h-full object-cover"
						/>
						<!-- Blue overlay layer with 60% opacity -->
						<div class="absolute inset-0 bg-[#004D66]/60"></div>
						<!-- Gradient overlay for text readability -->
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
					</div>

					<!-- Content Overlay -->
					<div class="absolute inset-0 flex flex-col justify-center p-6 md:p-8 text-white">
						<h3 class="text-3xl self-center text-start w-[95%] font-family-sans md:text-4xl font-semibold mb-6">
							{card.title}
						</h3>
						<p class="text-sm sm:text-md md:text-xl w-[95%] text-start self-center text-white/90 leading-relaxed font-family-sans mb-[10%]">
							{card.description}
						</p>
						{#if card.buttonText === 'Meet Our Team'}
							<a
								href="/sdm"
								class="w-[95%] px-6 py-3 border-2 border-white rounded-full font-family-sans text-white font-medium hover:bg-white hover:text-[#004D66] transition-all duration-300 flex justify-center self-center items-center gap-2"
							>
								{card.buttonText}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="w-5 h-5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
								</svg>
							</a>
						{:else}
							<a
								href="/layanan"
								class="w-[95%] px-6 py-3 border-2 border-white rounded-full font-family-sans text-white font-medium hover:bg-white hover:text-[#004D66] transition-all duration-300 flex justify-center self-center items-center gap-2"
							>
								{card.buttonText}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="2"
									stroke="currentColor"
									class="w-5 h-5"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
								</svg>
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- CTA Section -->
		<div class="relative bg-gradient-to-br from-[#D7EDF5] to-[#B3DDF2] rounded-3xl p-8 md:p-12 lg:p-16 text-center overflow-hidden">
			<!-- Blur Circle Effect - Top Left -->
			<div class="absolute -top-36 -left-36 w-100 h-100 bg-[#004D66] rounded-full blur-3xl opacity-60"></div>
			
			<!-- Blur Circle Effect - Bottom Right -->
			<div class="absolute -bottom-36 -right-36 w-100 h-100 bg-[#004D66] rounded-full blur-3xl opacity-60"></div>
			
			<!-- Content -->
			<div class="relative z-10">
				<h2 class="text-2xl sm:text-3xl md:text-4xl font-regular font-family-sans text-[#004D66] mb-4 md:mb-6">
					Kisah Sukses Digital Dimulai dari Sini
				</h2>
				<p class="text-sm sm:text-base md:text-lg text-black font-family-sans font-medium leading-relaxed max-w-6xl mx-auto mb-8">
					Di balik setiap proyek Kahasolusi, ada cerita tentang tantangan, kerja sama, dan keberhasilan. Kami percaya, kisah sukses berikutnya adalah milik Anda. Bergabunglah bersama kami dalam perjalanan transformasi digital yang penuh makna.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<a
					href={whatsappLink}
					target="_blank"
					rel="noopener noreferrer"
					class="w-full sm:w-auto px-24 py-3 bg-[#004D66] text-white rounded-full font-medium hover:bg-[#003D56] transition-all duration-300 shadow-lg hover:shadow-xl no-underline inline-block text-center"
				>
					Hubungi Kami
				</a>
				<a
					href='/layanan'
					class="w-full sm:w-auto px-8 py-3 border-2 border-[#004D66] text-[#004D66] rounded-full font-medium hover:bg-[#004D66] hover:text-white transition-all duration-300 no-underline inline-block text-center"
				>
					Lihat Layanan
				</a>
				</div>
			</div>
		</div>
	</div>
</section>
