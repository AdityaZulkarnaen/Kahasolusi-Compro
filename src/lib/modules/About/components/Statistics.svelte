<script>
	const stats = [
		{
			value: '3+',
			label: 'Tahun Pengalaman',
			color: 'from-[#004D66] to-[#006B8F]',
			blurColor: 'from-[#004D66] to-[#006B8F]'
		},
		{
			value: '10+',
			label: 'Proyek Sukses',
			color: 'from-[#D7EDF5] to-[#D7EDF5]',
			blurColor: 'from-[#0088AA] to-[#00AAD4]'
		},
		{
			value: '15+',
			label: 'Anggota Tim Berpengalaman',
			color: 'from-[#004D66] to-[#006B8F]',
			blurColor: 'from-[#004D66] to-[#006B8F]'
		},
		{
			value: '10+',
			label: 'Klien Puas	',
			color: 'from-[#D7EDF5] to-[#D7EDF5]',
			blurColor: 'from-[#0088AA] to-[#00AAD4]'
		}
	];
</script>

<div class="max-w-7xl h-75vh md:h-screen mx-auto flex flex-col justify-start mt-[10%] text-start px-4 sm:px-6">
	<h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 max-w-3xl">
		Kahasolusi menyediakan <span class="text-[#0088AA]">solusi digital terbaik</span> untuk Anda.
	</h2>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-12 md:mt-[10%]">
		{#each stats as stat, index}
			<!-- Container  -->
			<div class="relative flex {index % 2 === 0 ? 'items-start' : 'items-center'} min-h-[280px] sm:min-h-[350px] md:min-h-[480px]">
				<div class="relative w-full">
					<!-- Radiating blur effect -->
					<div
						class="absolute inset-0 bg-gradient-to-br {stat.blurColor} rounded-xl md:rounded-2xl blur-2xl md:blur-3xl opacity-60"
						style="z-index: 0;"
					></div>
					
					<!-- Main card -->
					<div
						class="relative bg-gradient-to-br {stat.color} rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 {index % 2 === 0 ? ' text-white' : ' text-[#0D4E6D]'} shadow-lg transition-all duration-300 hover:scale-105 flex flex-col justify-between h-[180px] sm:h-[220px] md:h-[280px]"
						style="z-index: 1;"
					>
						<div class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
							{stat.value}
						</div>
						<div class="text-xs sm:text-sm md:text-base lg:text-xl font-medium opacity-90 mt-auto">
							{stat.label}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
