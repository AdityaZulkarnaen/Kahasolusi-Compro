<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
    import { MapPinned, Phone, Mail } from 'lucide-svelte';

	let mapContainer;
	let map;

	const companyInfo = {
		name: 'PT Kaha Solusi Indonesia',
		address1: 'Grha Persatuan Yogya, Lantai 3, Blok A',
        address2: 'Jl. Persatuan No. 56, Sleman, DI Yogyakarta',
		phone: {
			telepon: '021 123-456-789',
			whatsapp: '0812-3456-7891'
		},
		email: 'halokaha@kahasolusi.co.id',
		coordinates: [-7.7797, 110.3753] // Yogyakarta coordinates
	};

	onMount(async () => {
		if (browser) {
			const L = (await import('leaflet')).default;
			await import('leaflet/dist/leaflet.css');

			// Initialize map
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
							<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg); color: white; font-size: 20px;">📍</div>
						</div>
					</div>
				`,
				iconSize: [40, 40],
				iconAnchor: [20, 40],
				popupAnchor: [0, -40]
			});

			// Add marker
			L.marker(companyInfo.coordinates, { icon: customIcon })
				.addTo(map)
				.bindPopup(
					`<div style="font-family: sans-serif;">
						<strong style="color: #004D66; font-size: 16px;">${companyInfo.name}</strong><br/>
						<p style="margin: 8px 0; font-size: 14px;">${companyInfo.address}</p>
					</div>`
				)
				.openPopup();
		}

		return () => {
			if (map) {
				map.remove();
			}
		};
	});
</script>

<section class="w-full bg-[#004D66] py-16 md:py-20 lg:py-24 px-6 sm:px-12">
	<div class="max-w-7xl mx-auto">
		<div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
			<!-- Map Container Wrapper -->
			<div class="relative">
				<!-- Map Container -->
				<div class="h-[300px] md:h-[400px] w-[100%] lg:w-[110%] rounded-2xl overflow-hidden">
					<div bind:this={mapContainer} class="w-full h-full z-10"></div>
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
                        <p class="text-white/90 leading-relaxed font-family-sans">
							{companyInfo.address2}
						</p>
					</div>
				</div>

				<!-- Kontak -->
				<div class="flex gap-6">
					<Phone />
					<div>
						<h3 class="text-xl font-semibold mb-2">Kontak</h3>
						<p class="text-white/90 font-family-sans">Telepon: {companyInfo.phone.telepon}</p>
						<p class="text-white/90 font-family-sans">WhatsApp: {companyInfo.phone.whatsapp}</p>
					</div>
				</div>

				<!-- Email -->
				<div class="flex gap-6">
					<Mail />
					<div>
						<h3 class="text-xl font-semibold mb-2">Email</h3>
						<p class="text-white/90 font-family-sans">{companyInfo.email}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.map-overlay {
		background: linear-gradient(
			to top,
			#004D66 0%,
			#004D66 5%,
			rgba(0, 77, 102, 0.9) 20%,
			rgba(0, 77, 102, 0.6) 40%,
			rgba(0, 77, 102, 0.3) 60%,
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
