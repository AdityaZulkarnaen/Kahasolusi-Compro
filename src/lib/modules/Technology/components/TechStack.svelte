<script>
	import { onMount } from 'svelte';
	import { technologiesAPI } from '$lib/api.js';
	import Default from '$lib/assets/svg/TechDefault.svg';
	
	let technologies = [];
	let technologiesWithLogo = [];
	let loading = true;
	let error = null;
	let isHovered = false;

	// Fetch technologies from database
	onMount(async () => {
		try {
			loading = true;
			const response = await technologiesAPI.getAll();
			technologies = response.data || response;
			
			// Filter only technologies with logo
			technologiesWithLogo = technologies.filter(tech => tech.logo_url && tech.logo_url.trim() !== '');
			
			// If technologies with logo less than 8, duplicate for smooth animation
			if (technologiesWithLogo.length > 0 && technologiesWithLogo.length < 8) {
				const originalLength = technologiesWithLogo.length;
				const multiplier = Math.ceil(8 / originalLength);
				technologiesWithLogo = Array(multiplier).fill(technologiesWithLogo).flat();
			}
			
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
	{:else if technologiesWithLogo.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">No technologies with logo found</p>
		</div>
	{:else}
		<!-- Infinite Scrolling Container -->
		<div class="relative overflow-hidden">
			<!-- Gradient Overlays -->
			<div class="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
			<div class="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

			<!-- Scrolling Container -->
			<div
				class="scroll-container py-8"
				on:mouseenter={() => (isHovered = true)}
				on:mouseleave={() => (isHovered = false)}
				role="region"
				aria-label="Technology logos"
			>
				<div class="scroll-content {isHovered ? 'paused' : ''}">
					<!-- First set of logos -->
					{#each technologiesWithLogo as tech}
						<div class="tech-logo">
							<img
								src={getImageUrl(tech)}
								alt={tech.tech_name}
								class="max-w-full max-h-full object-contain"
								on:error={handleImageError}
							/>
						</div>
					{/each}
					<!-- Duplicate set for seamless infinite loop -->
					{#each technologiesWithLogo as tech}
						<div class="tech-logo">
							<img
								src={getImageUrl(tech)}
								alt={tech.tech_name}
								class="max-w-full max-h-full object-contain"
								on:error={handleImageError}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.scroll-container {
		overflow: hidden;
		position: relative;
		width: 100%;
	}

	.scroll-content {
		display: flex;
		gap: 3rem;
		animation: scroll 30s linear infinite;
		width: fit-content;
	}

	.scroll-content.paused {
		animation-play-state: paused;
	}

	.tech-logo {
		flex-shrink: 0;
		width: 6rem;
		height: 6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.8;
		transition: all 0.3s ease;
	}

	.tech-logo:hover {
		opacity: 1;
		transform: scale(1.1);
	}

	@media (min-width: 768px) {
		.scroll-content {
			gap: 4rem;
		}

		.tech-logo {
			width: 7rem;
			height: 7rem;
		}
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
