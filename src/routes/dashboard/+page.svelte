<script>
	import { onMount } from 'svelte';
	import kahaLogo from '$lib/assets/images/kaha-solution-logo.png';
	import { 
		Users, 
		FolderOpen, 
		Code, 
		FileText, 
		LayoutDashboard, 
		Search, 
		Building, 
		LogOut,
		ChevronDown,
		Menu,
		X,
		Image,
		MessageSquare,
		Settings,
		Phone,
		Layers
	} from 'lucide-svelte';
	
	// State untuk mobile menu
	let isMobileMenuOpen = false;
	
	// Function untuk toggle mobile menu
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	
	// Close mobile menu when clicking outside
	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
	
	// Data dummy untuk cards
	const statsCards = [
		{
			title: 'SDM',
			value: '12',
			icon: Users,
			bgColor: 'bg-purple-50',
			iconBg: 'bg-purple-500'
		},
		{
			title: 'Portofolio Proyek',
			value: '20',
			icon: FolderOpen,
			bgColor: 'bg-orange-50',
			iconBg: 'bg-orange-500'
		},
		{
			title: 'Tech Stack',
			value: '25',
			icon: Code, 
			bgColor: 'bg-green-50',
			iconBg: 'bg-green-500'
		},
		{
			title: 'File Media',
			value: '55',
			icon: FileText,
			bgColor: 'bg-red-50',
			iconBg: 'bg-red-500'
		}
	];
</script>

<svelte:head>
	<title>Dashboard - Kahasolusi</title>
</svelte:head>

<div class="dashboard-container">
	<!-- Mobile Menu Overlay -->
	{#if isMobileMenuOpen}
		<div 
			class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
			on:click={closeMobileMenu}
			on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<!-- Sidebar -->
	<aside 
		class="sidebar fixed left-0 top-0 h-screen w-64 bg-gray-50 shadow-lg border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-50 lg:translate-x-0 {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
	>
		<!-- Logo Section -->
		<div class="p-6 border-b border-gray-200 bg-white">
			<div class="flex items-center justify-start">
				<img src={kahaLogo} alt="Kaha Solution Logo" class="h-7 w-auto object-contain" />
			</div>
		</div>
		
		<!-- Navigation Menu -->
		<nav 
			class="p-4 bg-gray-50"
			style="display: block !important; visibility: visible !important; opacity: 1 !important; background-color: #f9fafb !important;"
		>
			<ul 
				class="space-y-2"
				style="display: block !important; visibility: visible !important; opacity: 1 !important; list-style: none !important; padding: 0 !important; margin: 0 !important;"
			>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard" 
						class="flex items-center gap-3 px-4 py-3 text-white bg-blue-500 rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; background-color: #3b82f6 !important; color: white !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<LayoutDashboard class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Dashboard</span>
					</a>
				</li>
				
				<!-- Content Management -->
				<li class="pt-2">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Konten</p>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/portfolio" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<FolderOpen class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Portfolio</span>
					</a>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/teknologi" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<Code class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Teknologi</span>
					</a>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/sdm" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<Users class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">SDM</span>
					</a>
				</li>

				<!-- Company Management -->
				<li class="pt-4">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Perusahaan</p>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/company" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<Building class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Profil Perusahaan</span>
					</a>
				</li>
				
				<!-- Communication -->
				<li class="pt-4">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Komunikasi</p>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/multimedia" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<Image class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Multimedia</span>
					</a>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/contact-cta" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<Phone class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Contact CTA</span>
					</a>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/feedback" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<MessageSquare class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Feedback</span>
					</a>
				</li>
				
				<!-- System -->
				<li class="pt-4">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Sistem</p>
				</li>
				<li style="display: block !important; visibility: visible !important; opacity: 1 !important;">
					<a 
						href="/dashboard/settings" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<Settings class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Pengaturan</span>
					</a>
				</li>
				
				<li class="pt-4 border-t border-gray-200" style="display: block !important; visibility: visible !important; opacity: 1 !important; padding-top: 1rem !important; border-top: 1px solid #e5e7eb !important;">
					<a 
						href="/logout" 
						class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-white hover:rounded-lg transition-colors"
						style="display: flex !important; visibility: visible !important; opacity: 1 !important; align-items: center !important; gap: 0.75rem !important; padding: 0.75rem 1rem !important; color: #374151 !important; text-decoration: none !important; border-radius: 0.5rem !important;"
					>
						<LogOut class="w-5 h-5" style="display: block !important; width: 1.25rem !important; height: 1.25rem !important;" />
						<span class="font-medium" style="display: block !important; color: inherit !important;">Sign Out</span>
					</a>
				</li>
			</ul>
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="min-h-screen bg-white transition-all duration-300 lg:ml-64">
		<!-- Top Header -->
		<header class="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
			<div class="flex items-center justify-between">
				<!-- Left side: Hamburger + Search -->
				<div class="flex items-center gap-4">
					<!-- Hamburger Menu Button (Mobile Only) -->
					<button 
						class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
						on:click={toggleMobileMenu}
						aria-label="Toggle menu"
					>
						{#if isMobileMenuOpen}
							<X class="w-6 h-6 text-gray-600" />
						{:else}
							<Menu class="w-6 h-6 text-gray-600" />
						{/if}
					</button>
					
					<!-- Search Bar -->
					<div class="relative hidden sm:block">
						<input
							type="text"
							placeholder="Search"
							class="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64 lg:w-80"
						/>
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					</div>
				</div>
				
				<!-- Right side: User Profile -->
				<div class="flex items-center gap-3">
					<!-- Mobile Search Button -->
					<button class="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
						<Search class="w-5 h-5 text-gray-600" />
					</button>
					
					<!-- User Profile -->
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
							<span class="text-white font-medium text-sm">LH</span>
						</div>
						<div class="text-right hidden sm:block">
							<p class="font-medium text-gray-800">Lilis Haria</p>
							<p class="text-sm text-gray-500">Admin</p>
						</div>
					</div>
				</div>
			</div>
		</header>

		<!-- Dashboard Content -->
		<div class="p-6">
			<!-- Page Title -->
			<h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
			
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{#each statsCards as card}
					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
								<p class="text-3xl font-bold text-gray-800">{card.value}</p>
							</div>
							<div class="w-12 h-12 {card.iconBg} rounded-xl flex items-center justify-center">
								<svelte:component this={card.icon} class="text-white w-6 h-6" />
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Charts Section -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<!-- Monthly Visitor Chart -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-4">Monthly Visitor</h3>
					<div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
						<p class="text-gray-500">Chart akan ditambahkan nanti</p>
					</div>
				</div>

				<!-- Visitor by Provinces -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 class="text-lg font-semibold text-gray-800 mb-4">Visitor by Provinces</h3>
					<div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
						<p class="text-gray-500">Map chart akan ditambahkan nanti</p>
					</div>
				</div>
			</div>

			<!-- Visitor Overview -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-lg font-semibold text-gray-800">Visitor Overview</h3>
					<select class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
						<option>October</option>
						<option>September</option>
						<option>August</option>
					</select>
				</div>
				<div class="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
					<p class="text-gray-500">Overview chart akan ditambahkan nanti</p>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	:global(.dashboard-container) {
		min-height: 100vh !important;
		background-color: #f9fafb !important;
		width: 100vw !important;
		overflow-x: hidden !important;
		position: relative !important;
	}
	
	/* Responsive layout - Gunakan Tailwind classes, bukan CSS global */
	.dashboard-container {
		min-height: 100vh;
		position: relative;
	}
	
	/* Hanya override yang benar-benar diperlukan untuk navigation visibility */
	:global(.dashboard-container nav ul) {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
		list-style: none !important;
		padding: 0 !important;
		margin: 0 !important;
		gap: 0.5rem !important;
	}
	
	:global(.dashboard-container nav li) {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
		margin-bottom: 0.5rem !important;
	}
	
	:global(.dashboard-container nav a) {
		display: flex !important;
		visibility: visible !important;
		opacity: 1 !important;
		align-items: center !important;
		gap: 0.75rem !important;
		padding: 0.75rem 1rem !important;
		color: #374151 !important;
		text-decoration: none !important;
		border-radius: 0.5rem !important;
		transition: all 0.2s ease !important;
		font-weight: 500 !important;
		width: 100% !important;
		box-sizing: border-box !important;
	}
	
	:global(.dashboard-container nav a:hover) {
		background-color: white !important;
		color: #1f2937 !important;
	}
	
	/* Force active link styling */
	:global(.dashboard-container nav a.bg-blue-500) {
		background-color: #3b82f6 !important;
		color: white !important;
	}
	
	:global(.dashboard-container nav a.bg-blue-500:hover) {
		background-color: #2563eb !important;
		color: white !important;
	}
	
	/* Scrollbar styling */
	:global(.dashboard-container aside::-webkit-scrollbar) {
		width: 6px !important;
	}
	
	:global(.dashboard-container aside::-webkit-scrollbar-track) {
		background: #f1f5f9 !important;
	}
	
	:global(.dashboard-container aside::-webkit-scrollbar-thumb) {
		background: #cbd5e1 !important;
		border-radius: 3px !important;
	}
	
	:global(.dashboard-container aside::-webkit-scrollbar-thumb:hover) {
		background: #94a3b8 !important;
	}
	
	/* Force icon visibility */
	:global(.dashboard-container nav a svg) {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
		width: 1.25rem !important;
		height: 1.25rem !important;
		flex-shrink: 0 !important;
	}
	
	/* Force text visibility */
	:global(.dashboard-container nav a span) {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
		color: inherit !important;
	}
</style>