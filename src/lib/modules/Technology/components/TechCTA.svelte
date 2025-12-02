<script>
	import { companyAPI } from '$lib/api.js';
	import { onMount } from 'svelte';

	let whatsappLink = '#';

	onMount(async () => {
		try {
			const companies = await companyAPI.get();
			if (companies && companies.length > 0) {
				let phone = companies[0].phone;
				// Bersihkan dari karakter non-digit
				let cleanPhone = phone.replace(/\D/g, '');
				// Ganti 0 di awal dengan 62
				if (cleanPhone.startsWith('0')) {
					cleanPhone = '62' + cleanPhone.substring(1);
				}
				whatsappLink = `https://wa.me/${cleanPhone}?text=Halo%20Kahasolusi%2C%20saya%20ingin%20berkonsultasi`;
			}
		} catch (error) {
			console.error('Failed to load company phone:', error);
		}
	});
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	<div class="relative bg-[#D7EDF5] rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
		<!-- Blur Circle Effect - Top Left -->
		<div class="absolute -bottom-72 -left-36 w-100 h-100 bg-[#176684] rounded-full blur-3xl opacity-50"></div>
		
		<!-- Blur Circle Effect - Bottom Right -->
		<div class="absolute -top-48 -right-52 w-100 h-100 bg-[#176684] rounded-full blur-3xl opacity-50"></div>
		
		<div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
			<div class="text-[#176684] text-left flex-1">
				<h2 class="text-3xl md:text-4xl font-regular font-family-sans mb-4">
					Mulai Transformasi Digital Anda<br />dengan Kahasolusi
				</h2>
			</div>
			<div class="flex gap-4">
				<a
					href={whatsappLink}
					target="_blank"
					rel="noopener noreferrer"
					class="px-6 md:px-18 py-3 bg-[#176684] text-white rounded-full font-semibold hover:bg-[#0d4d5f] transition-colors no-underline inline-block text-center">
					Hubungi Kami
				</a>
				<a 
					href="/layanan"
					class="px-6 py-3 bg-[#D0E6F3] text-[#176684] border-2 border-[#176684] rounded-full font-semibold hover:bg-[#9ACFDD] hover:border-[#9ACFDD] hover:text-white transition-colors no-underline inline-block text-center">
					Lihat Layanan
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	/* Add any additional styling here */
</style>
