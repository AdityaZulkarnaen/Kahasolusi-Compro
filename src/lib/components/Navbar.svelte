<script>
	import { onMount, onDestroy } from 'svelte';
	let isMenuOpen = false;
	import { ChevronDown } from 'lucide-svelte';
	import Logo from '$lib/assets/svg/Logo.svg';
	import LogoBlue from '$lib/assets/svg/LogoBlue.svg';
	import LogoWhite from '$lib/assets/svg/LogoWhite.svg';
	import { page } from '$app/stores';

	let isClientSectionVisible = false;
	let observer;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	onMount(() => {
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
	$: isHomePage = $page.url.pathname === '/';
	$: isDarkMode = isPortfolioPage || isClientSectionVisible;
	$: navbarBg = (isTechPage || isAboutPage) ? 'bg-white' : (isDarkMode ? 'bg-gray-900/95' : 'bg-white/5');
	$: borderColor = (isTechPage || isAboutPage) ? 'border-gray-200' : (isDarkMode ? 'border-gray-700' : 'border-white');
	$: textColor = (isAboutPage || isTechPage) ? 'text-[#0E2144]' : (isDarkMode ? 'text-white' : 'text-white');
	$: logoSrc = isTechPage ? LogoBlue : (isAboutPage ? LogoBlue : Logo);
	$: Strip = (isHomePage || isPortfolioPage) ? 'bg-white' : 'bg-[#176684]';
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
					class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Home</a
				>
				<a
					href="/about"
					class="flex items-center gap-1 {textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
				>
					<span>Tentang Kami</span>
					<ChevronDown class="w-4 h-4 flex mt-1" />
				</a>
				<a
					href="/layanan"
					class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Layanan</a
				>
				<a
					href="/portofolio"
					class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Portofolio</a
				>
				<a
					href="/teknologi"
					class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap"
					>Teknologi</a
				>
			</div>

			<!-- Action Buttons -->
			<div class="hidden lg:flex gap-3 xl:gap-4 items-center flex-shrink-0">
				<button
					class="bg-[#D0E6F3] text-[#176684] px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-family-sans font-medium hover:bg-white hover:text-[#176684] transition-all whitespace-nowrap"
				>
					Sign In
				</button>
				<div class="w-[2px] h-6 {Strip} transition-colors duration-300"></div>
				<button
					class="bg-[#176684] font-family-sans text-white px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all whitespace-nowrap"
				>
					Hubungi Kami
				</button>
			</div>

			<!-- Mobile Menu Toggle -->
			<button
				class="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 relative z-50"
				on:click={toggleMenu}
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
			>
				<span
					class="w-6 h-0.5 {isTechPage || isAboutPage ? 'bg-[#0E2144]' : 'bg-white'} transition-all duration-300 {isMenuOpen
						? 'rotate-45 translate-y-2'
						: ''}"
				></span>
				<span
					class="w-6 h-0.5 {isTechPage || isAboutPage ? 'bg-[#0E2144]' : 'bg-white'} transition-all duration-300 {isMenuOpen
						? 'opacity-0'
						: 'opacity-100'}"
				></span>
				<span
					class="w-6 h-0.5 {isTechPage || isAboutPage ? 'bg-[#0E2144]' : 'bg-white'} transition-all duration-300 {isMenuOpen
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
					class="{textColor} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Home</a
				>
				<a
					href="/tentang-kami"
					class="{textColor} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Tentang Kami</a
				>
				<a
					href="/layanan"
					class="{textColor} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Layanan</a
				>
				<a
					href="/portofolio"
					class="{textColor} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Portofolio</a
				>
				<a
					href="/teknologi"
					class="{textColor} py-2.5 px-2 hover:text-orange-500 {isDarkMode
						? 'hover:bg-white/10'
						: 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Teknologi</a
				>
				<div class="flex flex-col gap-3 mt-4 px-2">
					<button
						class="bg-[#D0E6F3] text-[#176684] font-family-sans font-medium px-6 py-2.5 rounded-full text-sm hover:bg-white hover:text-[#176684] transition-all w-full"
					>
						Sign In
					</button>
					<button
						class="bg-[#176684] font-family-sans text-white px-6 py-2.5 rounded-full text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all w-full"
					>
						Hubungi Kami
					</button>
				</div>
			</div>
		</div>
	</div>
</nav>
