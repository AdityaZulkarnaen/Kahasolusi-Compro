<script>
	import { fade, scale } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	let {
		isOpen = false,
		project = {
			title: '',
			description: '',
			problems: [],
			results: [],
			images: [],
			technologies: [],
			url_youtube: ''
		},
		onClose = () => {}
	} = $props();

	function handleClose() {
		onClose();
	}

	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	// Extract YouTube video ID from URL
	function getYouTubeEmbedId(url) {
		if (!url) return null;
		
		try {
			const urlObj = new URL(url);
			
			// Handle youtube.com/watch?v=VIDEO_ID
			if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
				return urlObj.searchParams.get('v');
			}
			
			// Handle youtu.be/VIDEO_ID
			if (urlObj.hostname.includes('youtu.be')) {
				return urlObj.pathname.slice(1);
			}
			
			// Handle youtube.com/embed/VIDEO_ID
			if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.includes('/embed/')) {
				return urlObj.pathname.split('/embed/')[1];
			}
		} catch (e) {
			return null;
		}
		
		return null;
	}

	// Prevent body scroll when modal is open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		role="button"
		tabindex="-1"
	>
		<!-- Modal Container -->
		<div
			class="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
			transition:scale={{ duration: 200, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
		>
			<!-- Modal Header -->
			<div class="relative bg-white px-6 pt-6 pb-2">
				<button
					onclick={handleClose}
					class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
					aria-label="Close modal"
				>
					<X class="w-6 h-6 text-gray-600" />
				</button>
				<h2 class="text-2xl font-bold text-gray-900 pr-12">{project.title}</h2>
			</div>

			<!-- Modal Content - 2 Column Layout -->
			<div class="overflow-y-auto max-h-[calc(90vh-100px)]">
				<!-- Description -->
				<div class="px-6 pt-6 pb-4">
					<p class="text-black font-family-sans font-medium leading-relaxed">
						{project.description}
					</p>
				</div>

				<!-- YouTube Video Preview -->
				{#if project.url_youtube && getYouTubeEmbedId(project.url_youtube)}
					<div class="px-6 pb-6">
						<h3 class="text-lg font-bold text-gray-900 mb-4">Video Proyek</h3>
						<div class="w-full h-[2px] bg-[#176684] mx-auto mb-6"></div>
						<div class="rounded-lg overflow-hidden border border-gray-200 shadow-md">
							<div class="relative" style="padding-bottom: 56.25%; height: 0;">
								<iframe
									src="https://www.youtube.com/embed/{getYouTubeEmbedId(project.url_youtube)}"
									title="Video {project.title}"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
									class="absolute top-0 left-0 w-full h-full"
								></iframe>
							</div>
						</div>
					</div>
				{/if}

				<!-- Two Column: Permasalahan & Hasil -->
				<div class="flex flex-col lg:flex-row justify-evenly align-middle">
					<!-- Left Section (50%) - Permasalahan -->
					<div class="lg:w-[60%] p-6 rounded-xl bg-[#D7EDF5] flex flex-col">
						<h3 class="text-lg font-bold text-[#176684] mb-4 flex-shrink-0">Permasalahan</h3>
                        <div class="w-full h-[2px] bg-[#176684] mx-auto mb-6"></div>
						<div class="overflow-y-auto flex-1">
							<ul class="space-y-3">
								{#each project.problems || [] as problem}
									<li class="flex items-start gap-3">
										<span class="text-black font-family-sans leading-relaxed text-sm">{problem}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>

					<!-- Right Section (50%) - Hasil -->
					<div class="lg:w-[35%] p-6 flex flex-col rounded-xl bg-[#D7EDF5]">
						<h3 class="text-lg font-bold text-[#176684] mb-4 flex-shrink-0">Hasil</h3>
                        <div class="w-full h-[2px] bg-[#176684] mx-auto mb-6"></div>
						<div class="rounded-lg overflow-y-auto flex-1">
							<ul>
								{#each project.results || [] as result}
									<li class="flex items-center gap-3">
										<span class="text-black font-bold text-lg mt-0.5 flex-shrink-0">•</span>
										<span class="text-black leading-relaxed text-sm">{result}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>

				<!-- Project Images -->
				{#if project.images && project.images.length > 0}
					<div class="px-6 py-8">
						<h3 class="text-lg font-bold text-gray-900 mb-4">Galeri Proyek</h3>
						<div class="overflow-x-auto">
							<div class="flex gap-4 pb-2">
								{#each project.images as image, index}
									<div class="flex-shrink-0 w-48 md:w-64 lg:w-96 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
										<img
											src={image.url}
											alt={image.alt || `Project screenshot ${index + 1}`}
											class="w-full h-32 md:h-48 lg:h-64 object-cover"
										/>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Technologies -->
				{#if project.technologies && project.technologies.length > 0}
					<div class="px-6 pb-6">
						<h3 class="text-lg font-bold text-gray-900 mb-4">Teknologi</h3>
                        <div class="w-full h-[2px] bg-[#176684] mx-auto mb-6"></div>
						<div class="flex flex-wrap gap-3">
							{#each project.technologies as tech}
								<div
									class="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
								>
									{#if tech.icon}
										<div class="w-10 h-10 flex items-center justify-center">
											{@html tech.icon}
										</div>
									{:else if tech.image}
										<img src={tech.image} alt={tech.name} class="w-10 h-10 object-contain" />
									{/if}
									<span class="text-xs font-medium text-gray-700">{tech.name}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body.modal-open) {
		overflow: hidden;
	}
</style>
