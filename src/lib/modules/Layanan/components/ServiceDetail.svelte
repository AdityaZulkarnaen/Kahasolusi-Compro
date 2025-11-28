<script>
	export let title;
	export let description;
	export let image;
	export let fullWidth = false; // untuk gambar yang mepet ke tepi
</script>

<div class="mb-20">
	<div class="flex flex-col md:flex-row items-center gap-8 md:gap-12 {fullWidth ? '' : 'max-w-7xl mx-auto px-4'}">
		<!-- Image - Always on the left -->
		<div class="w-full md:w-1/2 flex-shrink-0 {fullWidth ? '' : 'px-0'}">
			<div class="rounded-br-3xl rounded-tr-3xl overflow-hidden ">
				<img src={image} alt={title} class="w-full h-auto object-cover" />
			</div>
		</div>

		<!-- Content -->
		<div class="w-full md:w-1/2 {fullWidth ? 'px-4 md:px-0 md:pr-4' : ''}">
			<h3 class="text-2xl md:text-3xl font-semibold text-[#0E2144] mb-4">
				{title}
			</h3>
			<p class="text-gray-700 text-base md:text-lg leading-relaxed font-family-sans">
				{description}
			</p>
		</div>
	</div>
</div>
