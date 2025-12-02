<script>
	import { onMount, onDestroy } from 'svelte';
	let isMenuOpen = false;
	import { ChevronDown } from 'lucide-svelte';
	import Logo from '$lib/assets/svg/Logo.svg';
	import LogoBlue from '$lib/assets/svg/LogoBlue.svg';
	import LogoWhite from '$lib/assets/svg/LogoWhite.svg';
	import { page } from '$app/stores';
	import { companyAPI } from '$lib/api.js';

	let whatsappLink = '#';

	let isClientSectionVisible = false;
	let observer;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	onMount(async () => {
		// Load WhatsApp link
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

		// Observe the Client section for visibility
		const clientSection = document.querySelector('[data-section="client"]');

		if (clientSection) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						// Once client section is visible or passed, keep dark mode
						if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
							isClientSectionVisible = true;
						} else if (entry.boundingClientRect.top < 0) {
							// Section is above viewport (user scrolled past it)
							isClientSectionVisible = true;
						} else {
							// Section is below viewport (not reached yet)
							isClientSectionVisible = false;
						}
					});
				},
				{
					threshold: [0, 0.1, 0.5],
					rootMargin: '-80px 0px 0px 0px' // Offset for navbar height
				}
			);

			observer.observe(clientSection);
		}
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});

	$: isPortfolioPage = $page.url.pathname.includes('/portofolio');
	$: isAboutPage = $page.url.pathname.includes('/about');
	$: isTechPage = $page.url.pathname.includes('/teknologi');
	$: isLayananPage = $page.url.pathname.includes('/layanan');
	$: isSDMPage = $page.url.pathname.includes('/sdm');
	$: isHomePage = $page.url.pathname === '/';
	$: isDarkMode = isPortfolioPage || isClientSectionVisible;
	$: navbarBg = (isTechPage || isAboutPage || isLayananPage || isSDMPage || isPortfolioPage) ? 'bg-white' : (isDarkMode ? 'bg-gray-900/95' : 'bg-white/5');
	$: borderColor = (isTechPage || isAboutPage || isLayananPage || isSDMPage) ? 'border-gray-200' : (isDarkMode ? 'border-gray-200' : 'border-white');
	$: textColor = (isAboutPage || isTechPage || isLayananPage || isSDMPage || isPortfolioPage) ? 'text-[#0E2144]' : (isDarkMode ? 'text-white' : 'text-white');
	$: logoSrc = (isTechPage || isLayananPage || isSDMPage || isPortfolioPage) ? LogoBlue : (isAboutPage ? LogoBlue : Logo);
	$: Strip = (isHomePage) ? 'bg-white' : 'bg-[#176684]';
	
	// Helper function to get active link classes
	function getActiveLinkClass(isActive) {
		if (isActive) {
			return 'text-orange-500 font-semibold relative after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-orange-500';
		}
		return '';
	}
</script>

<nav
	class="fixed top-0 left-0 right-0 z-50 {navbarBg} backdrop-blur-sm py-3 md:py-4 border-b-[1px] {borderColor} transition-colors duration-300 ease-in-out"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 {textColor} no-underline flex-shrink-0">
				<img src={logoSrc} alt="Kahasolusi Logo" class="h-6 sm:h-8 w-auto" />
			</a>

			<!-- Desktop Menu -->
			<div class="hidden lg:flex gap-6 xl:gap-8 items-center font-family-sans">
				<a
					href="/"
					class="{textColor} {getActiveLinkClass(isHomePage)} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Home</a
				>
				<a
					href="/about"
					class="flex items-center gap-1 {textColor} {getActiveLinkClass(isAboutPage)} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
				>
					<span>Tentang Kami</span>
				</a>
				<a
					href="/layanan"
					class="{textColor} {getActiveLinkClass(isLayananPage)} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Layanan</a
				>
				<a
					href="/portofolio"
					class="{textColor} {getActiveLinkClass(isPortfolioPage)} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Portofolio</a
				>
				<a
					href="/teknologi"
					class="{textColor} {getActiveLinkClass(isTechPage)} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Teknologi</a
				>
				<a
					href="/sdm"
					class="{textColor} {getActiveLinkClass(isSDMPage)} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Tim Kami</a>
			</div>

			<!-- Action Buttons -->
			<div class="hidden lg:flex gap-3 xl:gap-4 items-center flex-shrink-0">
				<a
					href="/login"
					class="bg-[#D0E6F3] text-[#176684] px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-family-sans font-medium hover:bg-white hover:text-[#176684] transition-all whitespace-nowrap no-underline"
				>
					Sign In
				</a>
				<div class="w-[2px] h-6 {Strip} transition-colors duration-300"></div>
				<a
					href={whatsappLink}
					target="_blank"
					rel="noopener noreferrer"
					class="bg-[#176684] font-family-sans text-white px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all whitespace-nowrap no-underline inline-block"
				>
					Hubungi Kami
				</a>
			</div>

			<!-- Mobile Menu Toggle -->
			<button
				class="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 relative z-50"
				on:click={toggleMenu}
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
			>
				<span
					class="w-6 h-0.5 {isTechPage || isAboutPage || isLayananPage || isPortfolioPage ? 'bg-[#0E2144]' : 'bg-white'} transition-all duration-300 {isMenuOpen
						? 'rotate-45 translate-y-2'
						: ''}"
				></span>
				<span
					class="w-6 h-0.5 {isTechPage || isAboutPage || isLayananPage || isSDMPage || isPortfolioPage? 'bg-[#0E2144]' : 'bg-white'} transition-all duration-300 {isMenuOpen
						? 'opacity-0'
						: 'opacity-100'}"
				></span>
				<span
					class="w-6 h-0.5 {isTechPage || isAboutPage || isLayananPage || isSDMPage || isPortfolioPage ? 'bg-[#0E2144]' : 'bg-white'} transition-all duration-300 {isMenuOpen
						? '-rotate-45 -translate-y-2'
						: ''}"
				></span>
			</button>
		</div>

		<!-- Mobile Menu -->
		<div
			class="lg:hidden overflow-hidden transition-all duration-300 ease-in-out {isMenuOpen
				? 'max-h-[500px] opacity-100'
				: 'max-h-0 opacity-0'}"
		>
			<div
				class="flex flex-col gap-2 py-4 mt-4 border-t {isDarkMode
					? 'border-white/20'
					: 'border-white/10'} transition-colors duration-300"
			>
				<a
					href="/"
					class="{textColor} {isHomePage ? 'bg-orange-500/20 text-orange-500 font-semibold' : ''} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Home</a
				>
				<a
					href="/about"
					class="{textColor} {isAboutPage ? 'bg-orange-500/20 text-orange-500 font-semibold' : ''} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Tentang Kami</a
				>
				<a
					href="/layanan"
					class="{textColor} {isLayananPage ? 'bg-orange-500/20 text-orange-500 font-semibold' : ''} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Layanan</a
				>
				<a
					href="/portofolio"
					class="{textColor} {isPortfolioPage ? 'bg-orange-500/20 text-orange-500 font-semibold' : ''} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Portofolio</a
				>
				<a
					href="/teknologi"
					class="{textColor} {isTechPage ? 'bg-orange-500/20 text-orange-500 font-semibold' : ''} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Teknologi</a
				>
				<a
					href="/sdm"
					class="{textColor} {isSDMPage ? 'bg-orange-500/20 text-orange-500 font-semibold' : ''} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Tim Kami</a
				>
				
				<div class="flex flex-col gap-3 mt-4 px-2">
					<a
						href="/login"
						class="bg-[#D0E6F3] text-[#176684] font-family-sans font-medium px-6 py-2.5 rounded-full text-sm hover:bg-white hover:text-[#176684] transition-all w-full text-center no-underline"
					>
						Sign In
					</a>
					<a
						href={whatsappLink}
						target="_blank"
						rel="noopener noreferrer"
						class="bg-[#176684] font-family-sans text-white px-6 py-2.5 rounded-full text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all w-full no-underline inline-block text-center"
					>
						Hubungi Kami
					</a>
				</div>
			</div>
		</div>
	</div>
</nav>
