<script>
	// You can add any interactive logic here if needed
</script>

<div class="max-w-7xl mx-auto">
	<div class="grid md:grid-cols-2 gap-12 items-start">
		<!-- Left Side - Image -->
		<div class="relative">
			<div class="rounded-2xl overflow-hidden shadow-xl">
				<img
					src="/images/about-background.jpg"
					alt="Kahasolusi Team"
					class="w-full h-auto object-cover"
					on:error={(e) => {
						e.target.style.display = 'none';
						e.target.parentElement.innerHTML =
							'<div class="bg-gradient-to-br from-[#004D66] to-[#006B8F] aspect-video flex items-center justify-center"><svg class="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
					}}
				/>
			</div>
			<!-- Decorative elements -->
			<div
				class="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -z-10"
			></div>
		</div>

		<!-- Right Side - Content -->
		<div class="space-y-6">
			<div>
				<h2 class="text-[#0088AA] uppercase tracking-wider text-sm font-semibold mb-3">
					Latar Belakang
				</h2>
				<p class="text-gray-700 leading-relaxed">
					Kahasolusi merupakan perusahaan software house yang berdiri pada tanggal 03 Januari
					2022. Berfokus pada di berbagai sektor pemerintah.
				</p>
			</div>

			<div>
				<p class="text-gray-700 leading-relaxed">
					Kahasolusi mengembangkan produk dan layanan yang berbasis teknologi informasi terbaru
					sebagai wadah yang ulung dalam menyajikan berbagai teknologi terbaru dan sudah menjadi
					lebih dari 10 proyek pemerintah pusat maupun daerah untuk memberikan solusi terbaik.
				</p>
			</div>
		</div>
	</div>
</div>
