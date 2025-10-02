<section class="py-16 px-8 bg-gradient-to-br from-slate-800 to-slate-900">
	<div class="max-w-7xl mx-auto">
		<div class="bg-gradient-to-br from-teal-900/40 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-teal-500/20">
			<div class="grid md:grid-cols-2 gap-8 items-center">
				<!-- Content -->
				<div>
					<h2 class="text-orange-500 uppercase tracking-wider text-sm font-semibold mb-4">
						TENTANG KAMI
					</h2>
					<h3 class="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
						Memberikan solusi digital yang andal dan sesuai
					</h3>
					<p class="text-white/80 leading-relaxed mb-8">
						Kahasolusi adalah software house yang berfokus pada pengembangan produk digital modern. Dengan pengalaman menjalankan lebih dari 10 proyek berskala pemerintah pusat dan daerah, kami membangun solusi digital yang andal, aman, dan sesuai kebutuhan klien.
					</p>
					<button class="inline-flex items-center gap-2 text-white hover:text-orange-400 font-medium transition-colors group">
						Ketahui lebih banyak
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="group-hover:translate-x-1 transition-transform">
							<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>

				<!-- Image/Illustration -->
				<div class="relative hidden md:block">
					<div class="aspect-video bg-gradient-to-br from-teal-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-teal-500/30 overflow-hidden">
						<!-- Placeholder for image - replace with actual image -->
						<img 
							src="/images/tentang-kami.jpg" 
							alt="Tentang Kami" 
							class="w-full h-full object-cover"
							on:error={(e) => {
								e.target.style.display = 'none';
								e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-24 h-24 text-teal-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
							}}
						/>
					</div>
					<!-- Decorative elements -->
					<div class="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
					<div class="absolute -top-4 -left-4 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
				</div>
			</div>
		</div>
	</div>
</section>
