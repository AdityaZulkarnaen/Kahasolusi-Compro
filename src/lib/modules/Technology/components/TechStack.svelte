<script>
	import { onMount } from 'svelte';
	import { technologiesAPI } from '$lib/api.js';
    import Default from '$lib/assets/svg/TechDefault.svg';
	
	let technologies = [];
	let loading = true;
	let error = null;

	// Fetch technologies from database
	onMount(async () => {
		try {
			loading = true;
			const response = await technologiesAPI.getAll();
			technologies = response.data || response;
			error = null;
		} catch (err) {
			console.error('Failed to fetch technologies:', err);
			error = 'Failed to load technologies';
		} finally {
			loading = false;
		}
	});

	// Get image URL with fallback to default
	function getImageUrl(tech) {
		const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
		const imageUrl = tech.logo_url;
		
		if (imageUrl && imageUrl.trim() !== '') {
			// Check if it's already a full URL
			if (imageUrl.startsWith('http')) {
				return imageUrl;
			}
			// Otherwise, construct the full URL
			return `${baseUrl}${imageUrl}`;
		}
		return Default;
	}

	// Handle image error - fallback to default
	function handleImageError(event) {
		event.target.src = Default;
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-red-500">{error}</p>
		</div>
	{:else if technologies.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">No technologies found</p>
		</div>
	{:else}
		<div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
			{#each technologies as tech}
				<div class="tech-item relative flex items-center justify-center p-6 bg-[#D7EDF5] rounded-2xl hover:bg-blue-100 transition-colors group">
					<!-- Technology icon/image -->
					<div class="w-12 h-12 flex items-center justify-center rounded-xl overflow-clip">
						<img 
							src={getImageUrl(tech)} 
							alt={tech.tech_name} 
							class="w-full h-full object-contain"
							on:error={handleImageError}
						>
					</div>
					
					<!-- Bubble Chat Tooltip -->
					<div class="tooltip absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out pointer-events-none">
						<div class="bg-[#747474] text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
							{tech.tech_name}
							<!-- Triangle pointer -->
							<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#747474]"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tech-item {
		cursor: pointer;
		position: relative;
	}

	.tooltip {
		z-index: 50;
		pointer-events: none;
	}

	/* Smooth animation for tooltip */
	.group:hover .tooltip {
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translate(0, 50%);
		}
		to {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
</style>
