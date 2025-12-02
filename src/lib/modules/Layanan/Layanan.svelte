<script>
	import ServiceDetail from './components/ServiceDetail.svelte';
	import WebsiteImg from '$lib/assets/images/Website.png';
	import MobileImg from '$lib/assets/images/Mobile.png';
	import SoftwareImg from '$lib/assets/images/Custom.png';
	import ConsultationImg from '$lib/assets/images/Consult.png';
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

<main class="min-h-screen bg-white overflow-hidden">
	<!-- Hero Header -->
	<section class="pt-32 pb-6 px-4">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-4xl md:text-5xl font-medium font-family-sans text-gray-900 mb-4">
				Layanan.
			</h1>
			<div class="w-64 h-1 bg-[#176684] mx-auto mb-6"></div>
            <p class="text-lg md:text-xl text-[#176684] max-w-6xl font-semibold mx-auto leading-relaxed">
				Kami menghadirkan layanan teknologi yang dirancang untuk mendukung kebutuhan bisnis
				dengan solusi digital yang efektif, aman, dan berkelanjutan.
			</p>
		</div>
	</section>

	<!-- Services Details Section -->
	<section class="py-8 md:py-16">
		<!-- Website Development -->
		<ServiceDetail
			title="Website Development"
			description="Website yang kami kembangkan membantu bisnis tampil lebih profesional, memperkuat kehadiran digital, dan mempermudah komunikasi dengan pelanggan. Dengan desain responsif dan performa yang optimal, website Anda akan berfungsi sempurna di berbagai perangkat dan mudah dikelola."
			image={WebsiteImg}
			fullWidth={true}
		/>

		<!-- Mobile Application Development -->
		<ServiceDetail
			title="Mobile Application Development"
			description="Website yang kami kembangkan membantu bisnis tampil lebih profesional, memperkuat kehadiran digital, dan mempermudah komunikasi dengan pelanggan. Dengan desain responsif dan performa yang optimal, website Anda akan berfungsi sempurna di berbagai perangkat dan mudah dikelola."
			image={MobileImg}
			fullWidth={false}
		/>

		<!-- Custom Software Solution -->
		<ServiceDetail
			title="Custom Software Solution"
			description="Website yang kami kembangkan membantu bisnis tampil lebih profesional, memperkuat kehadiran digital, dan mempermudah komunikasi dengan pelanggan. Dengan desain responsif dan performa yang optimal, website Anda akan berfungsi sempurna di berbagai perangkat dan mudah dikelola."
			image={SoftwareImg}
			fullWidth={true}
		/>

		<!-- IT Consultation -->
		<ServiceDetail
			title="IT Consultation"
			description="Website yang kami kembangkan membantu bisnis tampil lebih profesional, memperkuat kehadiran digital, dan mempermudah komunikasi dengan pelanggan. Dengan desain responsif dan performa yang optimal, website Anda akan berfungsi sempurna di berbagai perangkat dan mudah dikelola."
			image={ConsultationImg}
			fullWidth={false}
		/>
	</section>

	<!-- CTA Section -->
	<section class="w-full bg-white py-16 md:py-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- CTA Card with Gradient Masking -->
			<div class="relative bg-[#D7EDF5] rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden">
				<!-- Blur Circle Effect - Top Left -->
				<div class="absolute -top-36 -left-36 w-100 h-100 bg-[#176684] rounded-full blur-3xl opacity-60"></div>
				
				<!-- Blur Circle Effect - Bottom Right -->
				<div class="absolute -bottom-36 -right-36 w-100 h-100 bg-[#176684] rounded-full blur-3xl opacity-60"></div>
				
				<!-- Content -->
				<div class="relative z-10 text-center max-w-5xl mx-auto">
					<h2 class="text-2xl md:text-3xl lg:text-4xl font-regular font-family-sans text-[#176684] mb-6">
						Mulai Transformasi Digital<br />Anda dengan Kahasolusi
					</h2>
					
					<p class="text-black text-base font-family-sans font-medium md:text-lg leading-relaxed mb-8">
						Melalui inovasi digital yang tepat guna, Kahasolusi membantu bisnis dan organisasi menemukan jawaban atas setiap tantangan digital. Mulai dari website, aplikasi mobile, hingga solusi perangkat lunak custom, kami hadir sebagai mitra strategis yang benar-benar memahami kebutuhan Anda. Konsultasikan bersama kami sekarang, dan temukan bagaimana teknologi dapat mendorong pertumbuhan bisnis serta tim Anda.
					</p>
					
					<!-- CTA Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<a 
							href={whatsappLink}
							target="_blank"
							rel="noopener noreferrer"
							class="bg-[#176684] text-white px-24 py-3 rounded-full font-medium hover:bg-[#0d4d5f] transition-colors no-underline inline-block text-center">
							Hubungi Kami
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
