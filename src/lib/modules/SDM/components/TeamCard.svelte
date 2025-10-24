<script>
	// Team Card Component
	import PersonIcon from '$lib/assets/images/Person.png';
	export let name = 'Steve';
	export let position = 'Co-founder';
	export let image = PersonIcon;
</script>

<div class="flex flex-col items-center">
	<!-- Profile Image Container -->
	<div class="relative w-72 h-80">
		<!-- Background Circle -->
		<div class="absolute inset-0 bg-[#D7EDF5] rounded-3xl"></div>

		<!-- Profile Image -->
		<div class="relative w-full h-full flex items-end justify-center pt-6">
			{#if image}
				<img src={image} alt={name} class="w=-full h-full object-cover rounded-2xl" />
			{:else}
				<!-- Placeholder untuk gambar -->
				<div class="w-56 h-56 bg-gray-200 rounded-2xl flex items-center justify-center">
					<span class="text-gray-400 text-sm">No Image</span>
				</div>
			{/if}
		</div>

		<!-- Name Badge -->
		<div
			class="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#176684] text-white px-20 py-2 rounded-full"
		>
			<p class="font-normal text-xl font-family-sans text-center">{name}</p>
			<p class="text-sm text-center">{position}</p>
		</div>
	</div>
</div>

<style>
	/* Add any additional styling here */
</style>
