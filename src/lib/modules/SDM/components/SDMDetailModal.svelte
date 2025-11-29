<script>
	import { createEventDispatcher } from 'svelte';

	export let member = null;
	export let isOpen = false;

	const dispatch = createEventDispatcher();

	$: console.log('Modal state changed - isOpen:', isOpen, 'member:', member);

	// Prevent body scroll when modal is open
	$: if (typeof document !== 'undefined') {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function closeModal() {
		console.log('closeModal called');
		dispatch('close');
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

{#if isOpen && member}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="0"
	>
		<!-- Modal Content -->
		<div
			class="bg-white rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden relative shadow-2xl mt-[5%]"
		>
			<!-- Close Button -->
			<button
				on:click={closeModal}
				class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
				aria-label="Close modal"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

		<!-- Modal Body -->
		<div class="p-8 md:p-16">
			<div class="flex flex-col md:flex-row gap-8">
			<!-- Left Column - Image (30%) -->
			<div class="flex flex-col md:w-[30%] items-center justify-start">
				<div class="relative w-full">
					<!-- Background -->
					<div class="bg-[#D7EDF5] rounded-3xl p-6">
								{#if member.image}
									<img
										src={member.image}
										alt={member.name}
										class="w-full h-auto object-cover rounded-2xl"
									/>
								{:else}
									<div
										class="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center"
									>
										<span class="text-gray-400">No Image</span>
									</div>
								{/if}
						</div>
					</div>

					<!-- Name and Position -->
					<div class="mt-3 text-center w-full">
						<h2 class="text-2xl font-bold text-gray-800">{member.name}</h2>
						<p class="text-base text-gray-600 mt-1">{member.position}</p>
					</div>

				<!-- Social Links -->
				{#if member.github || member.linkedin}
					<div class="flex gap-3 mt-2 justify-center">
								{#if member.github}
								<a
									href={member.github}
									target="_blank"
									rel="noopener noreferrer"
									class="text-gray-700 hover:text-gray-900 transition-colors"
									aria-label="GitHub"
								>
									<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
											/>
										</svg>
									</a>
								{/if}
							{#if member.linkedin}
								<a
									href={member.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									class="text-gray-700 hover:text-gray-900 transition-colors"
									aria-label="LinkedIn"
								>
									<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
											<path
												d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
											/>
										</svg>
									</a>
								{/if}
							</div>
					{/if}
		</div>

		<!-- Right Column - Details (70%) -->
		<div class="space-y-6 md:w-[70%] md:max-h-[60vh] md:overflow-y-auto md:pr-4">
			<!-- Pengalaman -->
			{#if member.experience}
							<div>
								<h3 class="text-xl font-bold font-family-sans text-gray-800 mb-3">Pengalaman</h3>
                                <div class="h-[2px] w-full bg-[#176684] mb-2"></div>
								<p class="text-black font-family-sans font-medium leading-relaxed">{member.experience}</p>
							</div>
						{/if}

						<!-- Sertifikasi -->
						{#if member.certifications && member.certifications.length > 0}
							<div>
								<h3 class="text-xl font-bold font-family-sans text-gray-800 mb-3">Sertifikasi</h3>
                                <div class="h-[2px] w-[40%] bg-[#176684] mb-2"></div>
								<ul class="space-y-2">
									{#each member.certifications as cert}
										<li class="text-black font-family-sans font-medium flex items-start">
											<span class="text-[#176684] mr-2">•</span>
											<span>{cert}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<!-- Spesialisasi -->
						{#if member.specializations && member.specializations.length > 0}
							<div>
								<h3 class="text-xl font-bold font-family-sans text-gray-800 mb-3">Spesialisasi</h3>
                                <div class="h-[3px] w-[40%] bg-[#176684] mb-2"></div>
								<ul class="space-y-2">
									{#each member.specializations as spec}
										<li class="text-black font-family-sans font-medium flex items-start">
											<span class="text-[#176684] mr-2">•</span>
											<span>{spec}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom scrollbar for modal */
	div::-webkit-scrollbar {
		width: 8px;
	}

	div::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	div::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 10px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
