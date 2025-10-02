<script>
	let isMenuOpen = false;
    import { ChevronDown } from 'lucide-svelte';
	import Logo from '$lib/assets/svg/Logo.svg';

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm py-4 border-b-[1px] border-white">
	<div class="w-[88%] mx-auto px-8">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 text-white no-underline">
				<img src={Logo} alt="Kahasolusi Logo" class="h-8 w-auto" />
			</a>

			<!-- Desktop Menu -->
			<div class="hidden md:flex gap-8 items-center font-family-sans">
				<a href="/" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Home</a>
				<div class="flex items-center gap-1 text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">
					<span>Tentang Kami</span>
					<ChevronDown class="w-4 h-4 flex mt-1" />
				</div>
				<a href="/layanan" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Layanan</a>
				<a href="/portofolio" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Portofolio</a>
				<a href="/teknologi" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Teknologi</a>
			</div>

			<!-- Action Buttons -->
			<div class="hidden md:flex gap-4 items-center">
				<button class="bg-[#D0E6F3] text-[#176684]  px-6 py-2 rounded-full text-sm font-family-sans font-medium hover:bg-white hover:text-[#176684] transition-all">
					Sign In
				</button>
                <div class="w-[1px] h-6 bg-white"></div>
				<button class="bg-[#176684] font-family-sans text-white px-6 py-2 rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all">
					Hubungi Kami
				</button>
			</div>

			<!-- Mobile Menu Toggle -->
			<button class="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2" on:click={toggleMenu}>
				<span class="w-6 h-0.5 bg-white transition-all"></span>
				<span class="w-6 h-0.5 bg-white transition-all"></span>
				<span class="w-6 h-0.5 bg-white transition-all"></span>
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if isMenuOpen}
			<div class="md:hidden flex flex-col gap-4 py-4 mt-4 border-t border-white/10">
				<a href="/" class="text-white py-2 hover:text-orange-500 transition-colors ">Home</a>
				<a href="/tentang-kami" class="text-white py-2 hover:text-orange-500 transition-colors">Tentang Kami</a>
				<a href="/layanan" class="text-white py-2 hover:text-orange-500 transition-colors">Layanan</a>
				<a href="/portofolio" class="text-white py-2 hover:text-orange-500 transition-colors">Portofolio</a>
				<a href="/teknologi" class="text-white py-2 hover:text-orange-500 transition-colors">Teknologi</a>
				<div class="flex flex-col gap-3 mt-4">
					<button class="bg-transparent text-white border border-white px-6 py-2 rounded-full text-sm hover:bg-white hover:text-gray-800 transition-all w-full">
						Sign In
					</button>
					<button class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all w-full">
						Hubungi Kami
					</button>
				</div>
			</div>
		{/if}
	</div>
</nav>
