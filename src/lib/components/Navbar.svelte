<script>
	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-lg py-4">
	<div class="max-w-7xl mx-auto px-8">
		<div class="flex items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 text-white no-underline">
				<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center font-bold text-2xl">
					K
				</div>
				<div class="flex flex-col leading-tight">
					<span class="font-bold text-lg">KAHA</span>
					<span class="text-xs tracking-widest">SOLUSI</span>
				</div>
			</a>

			<!-- Desktop Menu -->
			<div class="hidden md:flex gap-8 items-center">
				<a href="/" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Home</a>
				<div class="flex items-center gap-1 text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">
					<span>Tentang Kami</span>
					<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
						<path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</div>
				<a href="/layanan" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Layanan</a>
				<a href="/portofolio" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Portofolio</a>
				<a href="/teknologi" class="text-white text-sm hover:text-orange-500 transition-colors cursor-pointer">Teknologi</a>
			</div>

			<!-- Action Buttons -->
			<div class="hidden md:flex gap-4 items-center">
				<button class="bg-transparent text-white border border-white px-6 py-2 rounded-full text-sm hover:bg-white hover:text-gray-800 transition-all">
					Sign In
				</button>
				<button class="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all">
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
				<a href="/" class="text-white py-2 hover:text-orange-500 transition-colors">Home</a>
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
