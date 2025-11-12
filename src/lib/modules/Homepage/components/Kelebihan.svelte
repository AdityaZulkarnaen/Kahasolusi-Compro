<script>
	import { ArrowRight } from 'lucide-svelte';
	import { ArrowUpRight } from 'lucide-svelte';
</script>

<section class="w-screen min-h-screen bg-[#E1F1F5] flex items-center justify-center py-8 md:py-16">
	<div class="w-[90%] md:w-[85%] items-center justify-items-center">
		<!-- Header -->
		<div class="w-full mb-8 md:mb-12 flex flex-col items-center justify-center text-center">
			<h1 class="text-sm md:text-lg font-sans font-medium text-[#176684]">KELEBIHAN KAMI</h1>
			<h1 class="text-2xl md:text-4xl font-sans font-normal text-[#0C0C0C] mt-2">
				Mengapa Kahasolusi
			</h1>
		</div>

		<!-- Cards Container -->
		<div
			class="w-full flex flex-col md:flex-row gap-4 md:gap-6 overflow-visible justify-center items-stretch"
		>
			<!-- Tim Profesional Card -->
			<div class="w-full md:w-[32%] bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col">
				<h2 class="text-xl md:text-2xl font-sans font-semibold text-[#176684] mb-3 md:mb-4">
					Tim Profesional
				</h2>
				<p
					class="text-[#0C0C0C] font-sans font-medium text-sm md:text-base leading-relaxed flex-grow mb-6"
				>
					Didukung oleh talenta yang ahli dan berkomitmen, kami memastikan setiap detail dikerjakan
					dengan standar tinggi.
				</p>
				<a
					class="w-full border-2 border-[#176684] text-[#176684] rounded-full py-2.5 md:py-3 px-6 font-sans font-medium hover:bg-[#176684] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
					href="/sdm"
				>
					Meet Our Team <ArrowRight class="w-4 h-4 md:w-5 md:h-5" />
				</a>
			</div>

			<!-- Berpengalaman Card -->
			<div class="w-full md:w-[32%] bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col">
				<h2 class="text-xl md:text-2xl font-sans font-semibold text-[#176684] mb-3 md:mb-4">
					Berpengalaman
				</h2>
				<p
					class="text-[#0C0C0C] font-sans font-medium text-sm md:text-base leading-relaxed flex-grow mb-6"
				>
					Lebih dari 10 proyek sukses bersama instansi pemerintah dan sektor swasta menjadi bukti
					kemampuan kami menghadirkan solusi tepat.
				</p>
				<a
					href='/portofolio'
					class="w-full border-2 border-[#176684] text-[#176684] rounded-full py-2.5 md:py-3 px-6 font-sans font-medium hover:bg-[#176684] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
				>
					Lihat Proyek <ArrowRight class="w-4 h-4 md:w-5 md:h-5" />
				</a>
			</div>

			<!-- Right Column with Inverted Border Radius Cards -->
			<div class="w-full md:w-[32%] flex flex-col gap-4 md:gap-5">
				<!-- Inovatif Card -->
				<div
					class="relative min-h-[240px] md:min-h-0 md:flex-1 rounded-2xl bg-white overflow-hidden"
				>
					<div class="relative z-10 p-6 md:p-7 h-full flex flex-col">
						<h2 class="text-xl md:text-xl font-sans font-semibold text-[#176684] mb-3">Inovatif</h2>
						<p
							class="text-[#0C0C0C] font-sans font-medium text-sm md:text-base leading-relaxed flex-grow pr-8 md:pr-12"
						>
							Kami selalu mengadopsi teknologi terbaru agar setiap produk yang kami bangun relevan
							dengan perkembangan zaman.
						</p>
					</div>
					<div class="icon-wrapper">
						<a href="/teknologi" class="icon-box">
							<ArrowUpRight class="w-6 h-6 md:w-7 md:h-7 text-white" />
						</a>
					</div>
				</div>

				<!-- Solusi yang Disesuaikan Card -->
				<div
					class="relative min-h-[240px] md:min-h-0 md:flex-1 rounded-2xl bg-white overflow-hidden"
				>
					<div class="relative z-10 p-6 md:p-7 h-full flex flex-col">
						<h2 class="text-xl md:text-xl font-sans font-semibold text-[#176684] mb-3">
							Solusi yang Disesuaikan
						</h2>
						<p
							class="text-[#0C0C0C] font-sans font-medium text-sm md:text-base leading-relaxed flex-grow pr-8 md:pr-12"
						>
							Setiap klien memiliki kebutuhan unik. Kami tidak menawarkan solusi generik, melainkan
							merancang sistem sesuai kebutuhan Anda.
						</p>
					</div>
					<div class="icon-wrapper">
						<a href="/layanan" class="icon-box">
							<ArrowUpRight class="w-6 h-6 md:w-7 md:h-7 text-white" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.icon-wrapper {
		position: absolute;
		bottom: -0.375rem;
		right: -0.375rem;
		width: 5rem;
		height: 5rem;
		background: #e1f1f5;
		border-top-left-radius: 50%;
		z-index: 20;
	}

	.icon-wrapper::before {
		position: absolute;
		content: '';
		bottom: 0.375rem;
		left: -1.25rem;
		background: transparent;
		width: 1.25rem;
		height: 1.25rem;
		border-bottom-right-radius: 1.25rem;
		box-shadow: 0.313rem 0.313rem 0 0.313rem #e1f1f5;
	}

	.icon-wrapper::after {
		position: absolute;
		content: '';
		top: -1.25rem;
		right: 0.375rem;
		background: transparent;
		width: 1.25rem;
		height: 1.25rem;
		border-bottom-right-radius: 1.25rem;
		box-shadow: 0.313rem 0.313rem 0 0.313rem #e1f1f5;
	}

	.icon-box {
		position: absolute;
		inset: 0.625rem;
		background: #176684;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: transform 0.3s;
		cursor: pointer;
		z-index: 10;
	}

	.icon-wrapper:hover .icon-box {
		transform: scale(1.1);
	}
</style>
