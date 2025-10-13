<script>
    import Trust from '$lib/assets/svg/Trust.svg';
    import Sparkling from '$lib/assets/svg/Sparkling.svg';
    import People from '$lib/assets/svg/People.svg';
    import Guarantee from '$lib/assets/svg/Guarantee.svg';

	const foundations = [
		{
			icon: People,
			title: 'Komitmen tinggi, keahlian mendalam.',
			description: 'Setiap karya kami lahir dari tangan talenta yang berdedikasi. Dengan keahlian dan passion di bidang teknologi, tim Kahasolusi memastikan setiap detail dikerjakan dengan presisi dan standar terbaik.'
		},
		{
			icon: Guarantee,
			title: 'Kualitas sebagai prioritas utama.',
			description: 'Setiap detail adalah prioritas. Kami memastikan setiap solusi yang dirancang tidak hanya fungsional, tetapi juga memberi pengalaman yang optimal bagi pengguna.'
		},
		{
			icon: Sparkling,
			title: 'Teknologi terkini untuk solusi masa depan.',
			description: 'Kami tidak hanya mengikuti perkembangan teknologi, tetapi juga menghadirkan solusi yang visioner dan relevan untuk masa depan bisnis Anda.'
		},
		{
			icon: Trust,
			title: 'Bertumbuh bersama kepercayaan klien.',
			description: 'Dengan pengalaman di berbagai proyek, mulai dari instansi pemerintah hingga bisnis swasta, Kahasolusi tumbuh menjadi mitra teknologi yang andal dan dipercaya.'
		}
	];
</script>

<section class="w-full bg-[#176684] py-16 md:py-20 lg:py-24 px-4 sm:px-6">
	<div class="max-w-7xl mx-auto">
		<!-- Heading -->
		<h2 class="text-3xl sm:text-4xl md:text-5xl font-regular text-white text-center mb-12 md:mb-16">
			Fondasi yang Menjadi <span class="font-bold">Kekuatan</span> Kami.
		</h2>

		<!-- Grid Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
			{#each foundations as foundation}
				<div class="flex flex-col items-center text-center space-y-4 md:space-y-5">
					<!-- Icon -->
					<div class="w-12 h-12 md:w-16 md:h-16">
						<img src={foundation.icon} alt={foundation.title} class="w-full h-full" />
					</div>

					<!-- Title -->
					<h3 class="text-xl sm:text-2xl md:text-3xl font-semibold text-white max-w-md">
						{foundation.title}
					</h3>

					<!-- Description -->
					<p class="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-lg">
						{foundation.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
