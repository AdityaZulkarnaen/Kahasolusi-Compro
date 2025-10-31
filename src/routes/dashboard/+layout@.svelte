<script>
	import "../../app.css";
	import { page } from '$app/stores';
	import kahaLogo from '$lib/assets/images/kaha-solution-logo.png';
	import { 
		Users, 
		FolderOpen, 
		Code, 
		LayoutDashboard, 
		Building, 
		LogOut,
		Menu,
		X,
		Image,
		MessageSquare,
		Phone
	} from 'lucide-svelte';

	let { children } = $props();
	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	// Function to check if a menu item is active
	function isActive(path) {
		return $page.url.pathname === path || 
			   ($page.url.pathname.startsWith(path + '/') && path !== '/dashboard');
	}
</script>

<svelte:head>
<title>Dashboard - Kahasolusi</title>
</svelte:head>

<div class="dashboard-container">
	{#if isMobileMenuOpen}
		<div 
			class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
			onclick={closeMobileMenu}
			onkeydown={(e) => e.key === 'Enter' && closeMobileMenu()}
			role="button"
			tabindex="0"
		></div>
	{/if}

	<aside class="sidebar fixed left-0 top-0 h-screen w-64 bg-gray-50 shadow-lg border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-50 lg:translate-x-0 {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}">
		<div class="p-6 border-b border-gray-200 bg-white">
			<img src={kahaLogo} alt="Kaha Solution Logo" class="h-7 w-auto object-contain" />
		</div>
		
		<nav class="p-4 bg-gray-50">
			<ul class="space-y-2">
				<li>
					<a 
						href="/dashboard" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard') && $page.url.pathname === '/dashboard' ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard') && $page.url.pathname === '/dashboard' ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<LayoutDashboard class="w-5 h-5" />
						<span class="font-medium">Dashboard</span>
					</a>
				</li>
				
				<li class="pt-4">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Projects</p>
				</li>
				<li>
					<a 
						href="/dashboard/portfolio" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/portfolio') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/portfolio') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<FolderOpen class="w-5 h-5" />
						<span class="font-medium">Portfolio</span>
					</a>
				</li>
				<li>
					<a 
						href="/dashboard/teknologi" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/teknologi') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/teknologi') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<Code class="w-5 h-5" />
						<span class="font-medium">Teknologi</span>
					</a>
				</li>
				<li>
					<a 
						href="/dashboard/sdm" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/sdm') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/sdm') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<Users class="w-5 h-5" />
						<span class="font-medium">SDM</span>
					</a>
				</li>

				<li class="pt-4">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Perusahaan</p>
				</li>
				<li>
					<a 
						href="/dashboard/company" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/company') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/company') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<Building class="w-5 h-5" />
						<span class="font-medium">Profil Perusahaan</span>
					</a>
				</li>
				
				<li class="pt-4">
					<p class="text-xs text-gray-500 font-semibold uppercase tracking-wider px-4 mb-2">Komunikasi</p>
				</li>
				<li>
					<a 
						href="/dashboard/multimedia" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/multimedia') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/multimedia') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<Image class="w-5 h-5" />
						<span class="font-medium">Multimedia</span>
					</a>
				</li>
				<li>
					<a 
						href="/dashboard/contact-cta" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/contact-cta') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/contact-cta') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<Phone class="w-5 h-5" />
						<span class="font-medium">Contact CTA</span>
					</a>
				</li>
				<li>
					<a 
						href="/dashboard/feedback" 
						class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors {isActive('/dashboard/feedback') ? 'text-[#176684] font-semibold' : 'text-gray-700 hover:bg-white'}"
						style={isActive('/dashboard/feedback') ? 'background-color: rgba(23, 102, 132, 0.25);' : ''}
					>
						<MessageSquare class="w-5 h-5" />
						<span class="font-medium">Feedback</span>
					</a>
				</li>
			</ul>
		</nav>
		
		<div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
			<button class="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
				<LogOut class="w-5 h-5" />
				<span class="font-medium">Logout</span>
			</button>
		</div>
	</aside>

	<main class="main-content ml-0 lg:ml-64 min-h-screen bg-gray-50">
		<header class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
			<h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
			<button 
				onclick={toggleMobileMenu} 
				class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
			>
				{#if isMobileMenuOpen}
					<X class="w-5 h-5" />
				{:else}
					<Menu class="w-5 h-5" />
				{/if}
			</button>
		</header>

		<div class="dashboard-content">
			{@render children?.()}
		</div>
	</main>
</div>

<style>
:global(html, body) {
margin: 0;
padding: 0;
height: 100%;
overflow-x: hidden;
}

.dashboard-container {
min-height: 100vh;
background-color: #f9fafb;
width: 100vw;
overflow-x: hidden;
position: relative;
}

	.sidebar {
		background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
	}
	
	/* Force sidebar navigation to be visible */
	.sidebar nav {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
	}
	
	.sidebar nav ul {
		display: block !important;
		list-style: none !important;
		margin: 0 !important;
		padding: 0 !important;
	}
	
	.sidebar nav li {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
	}
	
	.sidebar nav a {
		display: flex !important;
		visibility: visible !important;
		opacity: 1 !important;
	}
	
	.sidebar nav a svg {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
	}
	
	.sidebar nav a span {
		display: block !important;
		visibility: visible !important;
		opacity: 1 !important;
	}.main-content {
transition: margin-left 0.3s ease;
min-height: 100vh;
}

.dashboard-content {
width: 100%;
min-height: calc(100vh - 73px);
}

@media (min-width: 1024px) {
.dashboard-content {
min-height: 100vh;
}
}

:global(body nav),
:global(body footer) {
	display: none !important;
}

@media (max-width: 1023px) {
.sidebar {
transform: translateX(-100%);
}
.sidebar.translate-x-0 {
transform: translateX(0);
}
}
</style>
