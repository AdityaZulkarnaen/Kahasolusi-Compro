<script>
	let isMenuOpen = false;
    import { ChevronDown } from 'lucide-svelte';
	import Logo from '$lib/assets/svg/Logo.svg';
	import { page } from '$app/stores';

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Check if we're on portfolio page
	$: isPortfolioPage = $page.url.pathname.includes('/portofolio');
	$: navbarBg = isPortfolioPage ? 'bg-gray-900/95' : 'bg-white/5';
	$: borderColor = isPortfolioPage ? 'border-gray-700' : 'border-white';
	$: textColor = isPortfolioPage ? 'text-white' : 'text-white';
</script>

<nav class="fixed top-0 left-0 right-0 z-50 {navbarBg} backdrop-blur-sm py-3 md:py-4 border-b-[1px] {borderColor}">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 {textColor} no-underline flex-shrink-0">
				<img src={Logo} alt="Kahasolusi Logo" class="h-6 sm:h-8 w-auto" />
			</a>

			<!-- Desktop Menu -->
			<div class="hidden lg:flex gap-6 xl:gap-8 items-center font-family-sans">
				<a href="/" class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap">Home</a>
				<div class="flex items-center gap-1 {textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap">
					<span>Tentang Kami</span>
					<ChevronDown class="w-4 h-4 flex mt-1" />
				</div>
				<a href="/layanan" class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap">Layanan</a>
				<a href="/portofolio" class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap">Portofolio</a>
				<a href="/teknologi" class="{textColor} text-sm hover:text-orange-500 transition-colors cursor-pointer whitespace-nowrap">Teknologi</a>
			</div>

			<!-- Action Buttons -->
			<div class="hidden lg:flex gap-3 xl:gap-4 items-center flex-shrink-0">
				<button class="bg-[#D0E6F3] text-[#176684] px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-family-sans font-medium hover:bg-white hover:text-[#176684] transition-all whitespace-nowrap">
					Sign In
				</button>
                <div class="w-[1px] h-6 {isPortfolioPage ? 'bg-white' : 'bg-white'}"></div>
				<button class="bg-[#176684] font-family-sans text-white px-4 xl:px-6 py-2 rounded-full text-xs xl:text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all whitespace-nowrap">
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
				<span class="w-6 h-0.5 {isPortfolioPage ? 'bg-white' : 'bg-white'} transition-all duration-300 {isMenuOpen ? 'rotate-45 translate-y-2' : ''}"></span>
				<span class="w-6 h-0.5 {isPortfolioPage ? 'bg-white' : 'bg-white'} transition-all duration-300 {isMenuOpen ? 'opacity-0' : 'opacity-100'}"></span>
				<span class="w-6 h-0.5 {isPortfolioPage ? 'bg-white' : 'bg-white'} transition-all duration-300 {isMenuOpen ? '-rotate-45 -translate-y-2' : ''}"></span>
			</button>
		</div>

		<!-- Mobile Menu -->
		<div class="lg:hidden overflow-hidden transition-all duration-300 ease-in-out {isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}">
			<div class="flex flex-col gap-2 py-4 mt-4 border-t {isPortfolioPage ? 'border-white/20' : 'border-white/10'}">
				<a href="/" class="{textColor} py-2.5 px-2 hover:text-orange-500 {isPortfolioPage ? 'hover:bg-white/10' : 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Home</a>
				<a href="/tentang-kami" class="{textColor} py-2.5 px-2 hover:text-orange-500 {isPortfolioPage ? 'hover:bg-white/10' : 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Tentang Kami</a>
				<a href="/layanan" class="{textColor} py-2.5 px-2 hover:text-orange-500 {isPortfolioPage ? 'hover:bg-white/10' : 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Layanan</a>
				<a href="/portofolio" class="{textColor} py-2.5 px-2 hover:text-orange-500 {isPortfolioPage ? 'hover:bg-white/10' : 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Portofolio</a>
				<a href="/teknologi" class="{textColor} py-2.5 px-2 hover:text-orange-500 {isPortfolioPage ? 'hover:bg-white/10' : 'hover:bg-white/5'} rounded-lg transition-all font-family-sans">Teknologi</a>
				<div class="flex flex-col gap-3 mt-4 px-2">
					<button class="bg-[#D0E6F3] text-[#176684] font-family-sans font-medium px-6 py-2.5 rounded-full text-sm hover:bg-white hover:text-[#176684] transition-all w-full">
						Sign In
					</button>
					<button class="bg-[#176684] font-family-sans text-white px-6 py-2.5 rounded-full text-sm hover:shadow-lg hover:shadow-cyan-500/40 transition-all w-full">
						Hubungi Kami
					</button>
				</div>
			</div>
		</div>
	</div>
</nav>
