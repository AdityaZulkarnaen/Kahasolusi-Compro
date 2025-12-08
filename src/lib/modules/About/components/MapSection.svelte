<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
    import { MapPinned, Phone, Mail } from 'lucide-svelte';
	import { companyAPI } from '$lib/api.js';

	let mapContainer;
	let map;
	let companyInfo = null;
	let loading = true;
	let error = null;
	let mapError = null;

	// Default coordinates (Yogyakarta) - will be updated from database if available
	let coordinates = [-7.766353531689975, 110.40146712219224];

	// Function to validate coordinates
	function isValidCoordinate(lat, lng) {
		const latitude = parseFloat(lat);
		const longitude = parseFloat(lng);
		
		// Check if they are valid numbers
		if (isNaN(latitude) || isNaN(longitude)) {
			return false;
		}
		
		// Check if they are within valid ranges
		// Latitude must be between -90 and 90
		// Longitude must be between -180 and 180
		if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
			return false;
		}
		
		return true;
	}

	async function loadCompanyData() {
		try {
			loading = true;
			mapError = null;
			const response = await companyAPI.get();
			
			if (response && response.length > 0) {
				const company = response[0]; // Get first company profile
				
				// Use coordinates from database (latitude & longitude fields)
				if (company.latitude && company.longitude) {
					const lat = parseFloat(company.latitude);
					const lng = parseFloat(company.longitude);
					
					// Validate coordinates
					if (isValidCoordinate(lat, lng)) {
						coordinates = [lat, lng];
						console.log('Using coordinates from database:', coordinates);
					} else {
						console.error('Invalid coordinates in database:', { lat, lng });
						mapError = 'Format koordinat tidak valid';
						// Keep default coordinates
					}
				} else {
					console.log('No coordinates in database, using default');
				}
				
				// Parse phone numbers
				let phoneData = { telepon: '', whatsapp: '' };
				if (company.phone) {
					try {
						// If phone is JSON string with telepon and whatsapp
						const parsedPhone = typeof company.phone === 'string' ? JSON.parse(company.phone) : company.phone;
						phoneData = {
							telepon: parsedPhone.telepon || parsedPhone.phone || company.phone,
							whatsapp: parsedPhone.whatsapp || parsedPhone.telepon || ''
						};
					} catch (e) {
						// If phone is just a simple string
						phoneData = { telepon: company.phone, whatsapp: company.phone };
					}
				}
				
				companyInfo = {
					name: company.company_name || 'PT Kaha Solusi Indonesia',
					address: company.company_address || 'Yogyakarta',
					phone: phoneData,
					email: company.email || 'info@kahasolusi.co.id',
					coordinates: coordinates
				};
				
				// Split address into two lines for better display
				const addressParts = companyInfo.address.split(',');
				if (addressParts.length >= 2) {
					companyInfo.address1 = addressParts.slice(0, Math.ceil(addressParts.length / 2)).join(',').trim();
					companyInfo.address2 = addressParts.slice(Math.ceil(addressParts.length / 2)).join(',').trim();
				} else {
					companyInfo.address1 = companyInfo.address;
					companyInfo.address2 = '';
				}
			} else {
				// Fallback to default data if no company profile exists
				companyInfo = {
					name: 'PT Kaha Solusi Indonesia',
					address1: 'Grha Persatuan Yogya, Lantai 3, Blok A',
					address2: 'Jl. Persatuan No. 56, Sleman, DI Yogyakarta',
					phone: {
						telepon: '021 123-456-789',
						whatsapp: '0812-3456-7891'
					},
					email: 'halokaha@kahasolusi.co.id',
					coordinates: coordinates
				};
			}
			
			loading = false;
		} catch (err) {
			console.error('Failed to load company data:', err);
			error = 'Gagal memuat data perusahaan';
			loading = false;
			
			// Use fallback data
			companyInfo = {
				name: 'PT Kaha Solusi Indonesia',
				address1: 'Grha Persatuan Yogya, Lantai 3, Blok A',
				address2: 'Jl. Persatuan No. 56, Sleman, DI Yogyakarta',
				phone: {
					telepon: '021 123-456-789',
					whatsapp: '0812-3456-7891'
				},
				email: 'halokaha@kahasolusi.co.id',
				coordinates: coordinates
			};
		}
	}

	onMount(async () => {
		// Load company data first
		await loadCompanyData();

		if (browser && companyInfo && !mapError) {
			try {
				const L = (await import('leaflet')).default;
				await import('leaflet/dist/leaflet.css');

				// Initialize map with company coordinates
				map = L.map(mapContainer).setView(companyInfo.coordinates, 15);

				// Add tile layer
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '© OpenStreetMap contributors',
					maxZoom: 19
				}).addTo(map);

				// Custom marker icon
				const customIcon = L.divIcon({
					className: 'custom-marker',
					html: `
					<div style="position: relative;">
						<div style="width: 40px; height: 40px; background: #004D66; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); position: relative; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
							<div style="background: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); width: 20px; height: 20px; border-radius: 50%;">
							</div>
						</div>
					</div>
				`,
					iconSize: [40, 40],
					iconAnchor: [20, 40],
					popupAnchor: [0, -40]
				});

				// Add marker with company info
				const popupContent = `
				<div style="font-family: sans-serif;">
					<strong style="color: #004D66; font-size: 16px;">${companyInfo.name}</strong><br/>
					<p style="margin: 8px 0; font-size: 14px;">${companyInfo.address1}${companyInfo.address2 ? '<br/>' + companyInfo.address2 : ''}</p>
				</div>
			`;

				L.marker(companyInfo.coordinates, { icon: customIcon })
					.addTo(map)
					.bindPopup(popupContent)
					.openPopup();
			} catch (err) {
				console.error('Failed to initialize map:', err);
				mapError = 'Gagal memuat peta. Silakan coba lagi nanti.';
			}
		}

		return () => {
			if (map) {
				map.remove();
			}
		};
	});
</script>

<section class="w-full bg-[#023F53] py-16 md:py-20 lg:py-24 px-6 sm:px-12">
	<div class="max-w-7xl mx-auto">
		{#if loading}
			<!-- Loading State -->
			<div class="flex items-center justify-center py-24">
				<div class="text-center">
					<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
					<p class="text-white font-family-sans">Memuat data perusahaan...</p>
				</div>
			</div>
		{:else if companyInfo}
		<div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
			<!-- Map Container Wrapper -->
			<div class="relative">
				<!-- Map Container -->
				<div class="h-[300px] md:h-[400px] w-[100%] lg:w-[110%] rounded-2xl overflow-hidden">
					{#if mapError}
						<!-- Map Error Display -->
						<div class="w-full h-full bg-red-900/20 backdrop-blur-sm flex items-center justify-center p-6">
							<div class="text-center max-w-md">
								<div class="mb-4">
									<svg class="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<h3 class="text-xl font-semibold text-white mb-2">Error Peta</h3>
								<p class="text-white/90 text-sm font-family-sans">{mapError}</p>
							</div>
						</div>
					{:else}
						<div bind:this={mapContainer} class="w-full h-full z-10"></div>
					{/if}
				</div>
				<!-- Overlay Label -->
				<div
					class="absolute -bottom-1 -left-1 right-0 w-[110%] lg:w-[120%] h-32 map-overlay px-6 pb-3 flex items-end justify-center z-20 rounded-b-2xl pointer-events-none"
				>
					<p class="text-white font-regular text-2xl text-center mb-4 font-family-sans">Kantor Kami</p>
				</div>
			</div>

			<!-- Company Info -->
			<div class="text-white max-w-sm ml-[8%] lg:ml-[20%] flex flex-col justify-end space-y-8">
				<h2 class="text-xl md:text-2xl lg:text-3xl font-semibold font-family-sans mb-8">
					{companyInfo.name}
				</h2>

				<!-- Alamat -->
				<div class="flex gap-6">
					<MapPinned />
					<div>
						<h3 class="text-xl font-semibold mb-2">Alamat</h3>
						<p class="text-white/90 leading-relaxed font-family-sans">
							{companyInfo.address1}
						</p>
						{#if companyInfo.address2}
						<p class="text-white/90 leading-relaxed font-family-sans">
							{companyInfo.address2}
						</p>
						{/if}
					</div>
				</div>

				<!-- Kontak -->
				<div class="flex gap-6">
					<Phone />
					<div>
						<h3 class="text-xl font-semibold mb-2">Kontak</h3>
						{#if companyInfo.phone.telepon}
						<p class="text-white/90 font-family-sans">Telepon: {companyInfo.phone.telepon}</p>
						{/if}
						{#if companyInfo.phone.whatsapp}
						<p class="text-white/90 font-family-sans">WhatsApp: {companyInfo.phone.whatsapp}</p>
						{/if}
					</div>
				</div>

				<!-- Email -->
				<div class="flex gap-6">
					<Mail />
					<div>
						<h3 class="text-xl font-semibold mb-2">Email</h3>
						<a 
							href="mailto:{companyInfo.email}" 
							class="text-white/90 font-family-sans hover:text-white hover:underline transition-all"
						>
							{companyInfo.email}
						</a>
					</div>
				</div>
			</div>
		</div>
		{/if}
	</div>
</section>

<style>
	.map-overlay {
		background: linear-gradient(
			to top,
			#023F53 0%,
			#023F53 5%,
			rgba(2, 63, 83, 0.9) 20%,
			rgba(2, 63, 83, 0.6) 50%,
			rgba(2, 63, 83, 0.3) 70%,
			transparent 100%
		);
	}

	:global(.leaflet-container) {
		font-family: inherit;
	}

	:global(.custom-marker) {
		background: transparent !important;
		border: none !important;
	}

	:global(.leaflet-popup-content-wrapper) {
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(.leaflet-popup-tip) {
		background: white;
	}
</style>
