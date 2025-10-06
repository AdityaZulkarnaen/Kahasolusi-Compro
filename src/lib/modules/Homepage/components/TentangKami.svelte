<script>
	import { ArrowUpRight } from 'lucide-svelte';
</script>

<div class="max-w-7xl mx-auto">
	<div class="bg-[#004D66] rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-500/20">
		<div class="grid md:grid-cols-2 gap-8 items-center">
			<!-- Content -->
			<div class="font-family-sans">
				<h2 class="text-white uppercase tracking-wider text-md font-regular mb-4">TENTANG KAMI</h2>
				<h3 class="text-3xl md:text-4xl font-regular text-white mb-6 leading-tight">
					Memberikan solusi digital yang andal dan sesuai
				</h3>
				<p class="text-white/80 leading-relaxed mb-8">
					Kahasolusi adalah software house yang berfokus pada pengembangan produk digital modern.
					Dengan pengalaman menjalankan lebih dari 10 proyek berskala pemerintah pusat dan daerah,
					kami membangun solusi digital yang andal, aman, dan sesuai kebutuhan klien.
				</p>
				<button
					class="inline-flex items-center gap-1 text-white hover:text-orange-400 font-regular underline transition-colors group"
				>
					Ketahui lebih banyak
					<ArrowUpRight class="w-5 h-5" />
				</button>
			</div>

			<!-- Image/Illustration -->
			<div class="relative hidden md:block">
				<div
					class="aspect-video bg-gradient-to-br from-teal-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-teal-500/30 overflow-hidden"
				>
					<!-- Placeholder for image - replace with actual image -->
					<img
						src="/images/tentang-kami.jpg"
						alt="Tentang Kami"
						class="w-full h-full object-cover"
						on:error={(e) => {
							e.target.style.display = 'none';
							e.target.parentElement.innerHTML =
								'<div class="flex items-center justify-center w-full h-full"><svg class="w-24 h-24 text-teal-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
						}}
					/>
				</div>
				<!-- Decorative elements -->
				<div
					class="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"
				></div>
				<div class="absolute -top-4 -left-4 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
			</div>
		</div>
	</div>
</div>
