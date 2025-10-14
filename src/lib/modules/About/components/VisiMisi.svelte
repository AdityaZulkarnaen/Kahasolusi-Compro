<script>
	import img from '$lib/assets/images/Frame79.png';
</script>

<div class="max-w-5xl mx-auto relative bg-transparent">
	<!-- Blur Circle Effect - Kiri -->
	<div class="absolute -top-12 -left-96 w-120 h-120 bg-[#176684] overflow-hidden rounded-full blur-3xl opacity-60"></div>
	
	<div class="grid md:grid-cols-2 gap-12 items-center">
		<!-- Left Side - Visi & Misi Content -->
		<div class="space-y-8">
			<!-- Visi Kahasolusi -->
			<div class="space-y-4">
				<h3 class="text-[#0088AA] text-lg font-medium font-family-sans mb-3">
					Visi Kahasolusi
				</h3>
				<div class="border-t-2 border-[#0088AA] pt-4">
					<p class="text-[#1a1a1a] leading-relaxed font-family-sans font-semibold text-justify">
						Menjadi perusahaan software house terdepan yang memberdayakan inovasi teknologi untuk menghadirkan solusi digital terbaik bagi klien kami
					</p>
				</div>
			</div>

			<!-- Misi Kahasolusi -->
			<div class="space-y-4">
				<h3 class="text-[#0088AA] text-lg font-medium font-family-sans mb-3">
					Misi Kahasolusi
				</h3>
				<div class="border-t-2 border-[#0088AA] pt-4">
					<p class="text-[#1a1a1a] leading-relaxed font-family-sans font-semibold text-justify">
Memberikan solusi perangkat lunak berkualitas tinggi, berfokus pada inovasi teknologi, dan membangun tim berbakat untuk menciptakan solusi yang relevan dan berdaya saing tinggi bagi klien kami, sambil menjalin kemitraan strategis, berkontribusi pada pertumbuhan klien, dan beroperasi secara bertanggung jawab dengan dampak sosial yang positif.					</p>
				</div>
			</div>
		</div>

		<!-- Right Side - Image -->
		<div class="relative bg-transparent h-full">
			<div class="rounded-2xl overflow-hidden shadow-xl h-full">
				<img
					src={img}
					alt="Visi Misi Kahasolusi"
					class="w-full h-full object-cover"
					on:error={(e) => {
						e.target.style.display = 'none';
						e.target.parentElement.innerHTML =
							'<div class="bg-gradient-to-br from-[#004D66]/10 to-[#006B8F]/10 h-full flex items-center justify-center"><svg class="w-24 h-24 text-[#004D66]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>';
					}}
				/>
			</div>
		</div>
	</div>
</div>
