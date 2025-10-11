<script>
	import { ArrowUpRight } from 'lucide-svelte';
	import LaptopIcon from '$lib/assets/svg/Laptop.svg';
	import PhoneIcon from '$lib/assets/svg/Phone.svg';
	import InnovationIcon from '$lib/assets/svg/Innovation.svg';
	import SolveIcon from '$lib/assets/svg/Solve.svg';
</script>

<section class="w-full bg-white pb-16 md:pb-24">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
			<div>
				<h2 class="text-[#176684] uppercase tracking-wider text-md font-medium mb-2">
					LAYANAN KAMI
				</h2>
				<h3 class="text-3xl md:text-4xl font-normal text-[#0C0C0C]">
					Solusi Digital untuk Mendukung<br />Transformasi Digital Anda
				</h3>
			</div>
			<button
				class="self-start md:self-auto bg-[#176684] text-white px-6 py-3 rounded-full font-medium hover:bg-[#0d4d5f] transition-colors inline-flex items-center gap-2"
			>
				Pelajari Selengkapnya
			</button>
		</div>

		<!-- Service Cards Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Website Development Card -->
			<div
				class="group bg-[#D7EDF5] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
			>
				<!-- Blur Circle Effect -->
				<div
					class="absolute -top-12 -right-12 w-40 h-40 bg-[#176684] rounded-full blur-3xl opacity-90"
				></div>

				<div class="relative z-10">
					<img src={LaptopIcon} alt="Laptop" class="w-12 h-12 mb-4" />
				</div>

				<h4 class="text-2xl font-semibold text-black mb-3 relative z-10">Website Development</h4>
				<p
					class="text-black text-md font-family-sans font-regular leading-relaxed mt-auto relative z-10"
				>
					Membangun website profesional, cepat, dan responsif untuk memperkuat citra bisnis atau
					institusi
				</p>
			</div>

			<!-- Mobile Application Development Card -->
			<div
				class="group bg-[#D7EDF5] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
			>
				<!-- Blur Circle Effect -->
				<div
					class="absolute -top-12 -right-12 w-40 h-40 bg-[#176684] rounded-full blur-3xl opacity-90"
				></div>

				<div class="relative z-10">
					<img src={PhoneIcon} alt="Phone" class="w-12 h-12 mb-4" />
				</div>

				<h4 class="text-2xl font-semibold text-[#0C0C0C] mb-3 relative z-10">
					Mobile Application Development
				</h4>
				<p
					class="text-black text-md font-regular font-family-sans leading-relaxed mt-auto relative z-10"
				>
					Membangun website profesional, cepat, dan responsif untuk memperkuat citra bisnis atau
					institusi
				</p>
			</div>

			<!-- Custom Software Solutions Card -->
			<div
				class="group bg-[#D7EDF5] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
			>
				<!-- Blur Circle Effect -->
				<div
					class="absolute -top-12 -right-12 w-40 h-40 bg-[#176684] rounded-full blur-3xl opacity-90"
				></div>

				<div class="relative z-10">
					<img src={InnovationIcon} alt="Innovation" class="w-12 h-12 mb-4" />
				</div>

				<h4 class="text-2xl font-semibold text-black mb-3 relative z-10">
					Custom Software Solutions
				</h4>
				<p
					class="text-black text-md font-family-sans font-regular leading-relaxed mt-auto relative z-10"
				>
					Membangun website profesional, cepat, dan responsif untuk memperkuat citra bisnis atau
					institusi
				</p>
			</div>

			<!-- IT Consultation Card -->
			<div
				class="group bg-[#D7EDF5] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden"
			>
				<!-- Blur Circle Effect -->
				<div
					class="absolute -top-12 -right-12 w-40 h-40 bg-[#176684] rounded-full blur-3xl opacity-90"
				></div>

				<div class="relative z-10">
					<img src={SolveIcon} alt="Solve" class="w-12 h-12 mb-4" />
				</div>

				<h4 class="text-2xl font-semibold text-black mb-3 relative z-10">IT Consultation</h4>
				<p
					class="text-black text-md font-family-sans font-regular leading-relaxed mt-auto relative z-10"
				>
					Membangun website profesional, cepat, dan responsif untuk memperkuat citra bisnis atau
					institusi
				</p>
			</div>
		</div>
	</div>
</section>
