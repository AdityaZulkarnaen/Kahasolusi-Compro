<script>
	import coders from '$lib/assets/images/coders.png';
	import working from '$lib/assets/images/working.png';

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
					<div class="relative h-[400px] md:h-[450px]">
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
					<div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
						<h3 class="text-3xl self-center text-start w-[95%] md:text-4xl font-semibold mb-6">
							{card.title}
						</h3>
						<p class="text-sm sm:text-md md:text-xl w-[95%] text-start self-center text-white/90 leading-relaxed mb-[10%]">
							{card.description}
						</p>
						<button
							class="w-[95%] px-6 py-3 border-2 border-white rounded-full text-white font-medium hover:bg-white hover:text-[#004D66] transition-all duration-300 flex justify-center self-center items-center gap-2"
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
						</button>
					</div>
				</div>
			{/each}
		</div>

		<!-- CTA Section -->
		<div class="bg-gradient-to-br from-[#D7EDF5] to-[#B3DDF2] rounded-3xl p-8 md:p-12 lg:p-16 text-center">
			<h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#004D66] mb-4 md:mb-6">
				Kisah Sukses Digital Dimulai dari Sini
			</h2>
			<p class="text-sm sm:text-base md:text-lg text-[#004D66]/80 leading-relaxed max-w-3xl mx-auto mb-8">
				Di balik setiap proyek Kahasolusi, ada cerita tentang tantangan, kerja sama, dan keberhasilan. Kami percaya, kisah sukses berikutnya adalah milik Anda. Bergabunglah bersama kami dalam perjalanan transformasi digital yang penuh makna.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<button
					class="w-full sm:w-auto px-8 py-3 bg-[#004D66] text-white rounded-full font-medium hover:bg-[#003D56] transition-all duration-300 shadow-lg hover:shadow-xl"
				>
					Hubungi Kami
				</button>
				<button
					class="w-full sm:w-auto px-8 py-3 border-2 border-[#004D66] text-[#004D66] rounded-full font-medium hover:bg-[#004D66] hover:text-white transition-all duration-300"
				>
					Lihat Layanan
				</button>
			</div>
		</div>
	</div>
</section>
