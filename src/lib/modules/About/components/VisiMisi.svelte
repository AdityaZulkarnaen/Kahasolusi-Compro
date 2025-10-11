<script>
	// You can add any interactive logic here if needed
</script>

<div class="max-w-7xl mx-auto">
	<div class="grid md:grid-cols-2 gap-12">
		<!-- Visi Kahasolusi -->
		<div class="space-y-4">
			<div>
				<h3 class="text-[#0088AA] uppercase tracking-wider text-sm font-semibold mb-3">
					Visi Kahasolusi
				</h3>
				<p class="text-gray-700 leading-relaxed">
					Menjadi perusahaan software house terbaik yang membangun inovasi teknologi untuk
					menghadirkan solusi digital terbaik bagi klien kami.
				</p>
			</div>

			<!-- Image for Visi -->
			<div class="relative mt-6">
				<div class="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
					<img
						src="/images/visi-team.jpg"
						alt="Visi Kahasolusi"
						class="w-full h-64 object-cover"
						on:error={(e) => {
							e.target.style.display = 'none';
							e.target.parentElement.innerHTML =
								'<div class="bg-gradient-to-br from-[#004D66]/10 to-[#006B8F]/10 h-64 flex items-center justify-center"><svg class="w-16 h-16 text-[#004D66]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
						}}
					/>
				</div>
			</div>
		</div>

		<!-- Misi Kahasolusi -->
		<div class="space-y-4">
			<div>
				<h3 class="text-[#0088AA] uppercase tracking-wider text-sm font-semibold mb-3">
					Misi Kahasolusi
				</h3>
				<p class="text-gray-700 leading-relaxed">
					Memberikan solusi perangkat lunak berkualitas tinggi, inovatif, dan handal teknologi
					dan membangun dan membangun hubungan strategis berkesinambungan klien sembari
					menjunjung tinggi integritas, inovasi, serta tanggung jawab dengan skala keluar.
				</p>
			</div>

			<!-- Image for Misi -->
			<div class="relative mt-6">
				<div class="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
					<img
						src="/images/misi-team.jpg"
						alt="Misi Kahasolusi"
						class="w-full h-64 object-cover"
						on:error={(e) => {
							e.target.style.display = 'none';
							e.target.parentElement.innerHTML =
								'<div class="bg-gradient-to-br from-[#004D66]/10 to-[#006B8F]/10 h-64 flex items-center justify-center"><svg class="w-16 h-16 text-[#004D66]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
						}}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
