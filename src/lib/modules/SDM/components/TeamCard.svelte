<script>
	// Team Card Component
	import { createEventDispatcher } from 'svelte';
	import PersonIcon from '$lib/assets/svg/People.svg';
	
	export let name = 'Steve';
	export let position = 'Fullstack';
	export let image = PersonIcon;
	export let member = null;

	const dispatch = createEventDispatcher();

	function handleClick() {
		console.log('TeamCard clicked!', member);
		dispatch('click', member);
	}

	// Handle image error - fallback to default
	function handleImageError(event) {
		event.target.src = PersonIcon;
	}

</script>

<button
	class="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 bg-transparent border-none p-0 w-full"
	on:click={handleClick}
	type="button"
>
	<!-- Profile Image Container -->
	<div class="relative w-72 h-80">
		<!-- Background Circle -->
		<div class="absolute inset-0 bg-[#D7EDF5] rounded-3xl"></div>

		<!-- Profile Image -->
		<div class="relative w-full h-full flex justify-center mt-12">
			{#if image}
				<img 
					src={image} 
					alt={name} 
					class="w-1/2 h-1/2 object-cover rounded-2xl"
					on:error={handleImageError}
				/>
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
</button>

<style>
	/* Add any additional styling here */
</style>
