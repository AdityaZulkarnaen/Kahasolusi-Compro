<script>
	// Array untuk logo-logo client
	const clients = [
		{ name: 'Client 1', logo: '/images/clients/client1.png' },
		{ name: 'Client 2', logo: '/images/clients/client2.png' },
		{ name: 'Client 3', logo: '/images/clients/client3.png' },
		{ name: 'Client 4', logo: '/images/clients/client4.png' },
		{ name: 'Client 5', logo: '/images/clients/client5.png' },
		{ name: 'Client 6', logo: '/images/clients/client6.png' },
		{ name: 'Client 7', logo: '/images/clients/client7.png' },
		{ name: 'Client 8', logo: '/images/clients/client8.png' }
	];

	let isHovered = false;
</script>

<div class="pb-16 px-4 sm:px-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
				Telah dipercaya lebih dari 20+ klien di seluruh Indonesia
			</h2>
		</div>

		<!-- Clients Logo Grid -->
		<div class="relative overflow-hidden">
			<!-- Gradient Overlays -->
			<div
				class="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"
			></div>
			<div
				class="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"
			></div>

			<!-- Scrolling Container -->
			<div
				class="scroll-container py-8"
				on:mouseenter={() => (isHovered = true)}
				on:mouseleave={() => (isHovered = false)}
				role="region"
				aria-label="Client logos"
			>
				<div class="scroll-content {isHovered ? 'paused' : ''}">
					<!-- First set of logos -->
					{#each clients as client}
						<div class="client-logo">
							<img
								src={client.logo}
								alt={client.name}
								class="max-w-full max-h-full object-contain"
								on:error={(e) => {
									// Fallback jika gambar tidak ditemukan
									e.target.style.display = 'none';
									e.target.parentElement.innerHTML = `
										<div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
											<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
											</svg>
										</div>
									`;
								}}
							/>
						</div>
					{/each}
					<!-- Duplicate set for seamless loop -->
					{#each clients as client}
						<div class="client-logo">
							<img
								src={client.logo}
								alt={client.name}
								class="max-w-full max-h-full object-contain"
								on:error={(e) => {
									e.target.style.display = 'none';
									e.target.parentElement.innerHTML = `
										<div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
											<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
											</svg>
										</div>
									`;
								}}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
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

	.client-logo {
		flex-shrink: 0;
		width: 6rem;
		height: 6rem;
		display: flex;
		align-items: center;
		justify-content: center;
		filter: grayscale(100%);
		opacity: 0.6;
		transition: all 0.3s ease;
	}

	.client-logo:hover {
		filter: grayscale(0%);
		opacity: 1;
		transform: scale(1.1);
	}

	@media (min-width: 768px) {
		.scroll-content {
			gap: 4rem;
		}

		.client-logo {
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
