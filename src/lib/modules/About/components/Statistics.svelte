<script>
	const stats = [
		{
			value: '3+',
			label: 'Tahun Pengalaman',
			color: 'from-[#004D66] to-[#006B8F]'
		},
		{
			value: '10+',
			label: 'Proyek Sukses',
			color: 'from-[#0088AA] to-[#00AAD4]'
		},
		{
			value: '15+',
			label: 'Anggota Tim Berpengalaman',
			color: 'from-[#004D66] to-[#006B8F]'
		},
		{
			value: 'XX+',
			label: 'lorem Ipsum',
			color: 'from-[#0088AA] to-[#00AAD4]'
		}
	];
</script>

<div class="max-w-7xl mx-auto text-center">
	<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
		Kahasolusi menyediakan <span class="text-[#0088AA]">solusi digital terbaik</span> untuk Anda.
	</h2>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
		{#each stats as stat, index}
			<div
				class="bg-gradient-to-br {stat.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
			>
				<div class="text-4xl md:text-5xl font-bold mb-3">
					{stat.value}
				</div>
				<div class="text-sm md:text-base font-medium opacity-90">
					{stat.label}
				</div>
			</div>
		{/each}
	</div>
</div>
