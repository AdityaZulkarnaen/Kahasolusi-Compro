<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Calendar, Tag, ExternalLink } from 'lucide-svelte';
	
	// Sample data - nanti akan diganti dengan fetch dari API
	let portfolios = [
		{
			portfolio_id: 1,
			project_name: "E-Commerce Platform KahaShop",
			project_description: "Platform e-commerce modern dengan fitur lengkap untuk UMKM",
			client_name: "PT. Digital Indonesia",
			project_start_date: "2024-01-15",
			project_end_date: "2024-06-30",
			image_url: "/portfolio/kahashop.jpg",
			project_url: "https://youtube.com",
			is_featured: true,
			is_active: true,
			categories: ["Web Development", "E-Commerce"],
			technologies: ["SvelteKit", "TailwindCSS", "Node.js"]
		},
		{
			portfolio_id: 2,
			project_name: "Mobile App KahaDelivery",
			project_description: "Aplikasi mobile untuk layanan delivery makanan",
			client_name: "KahaFood Corp",
			project_start_date: "2024-03-01",
			project_end_date: "2024-08-15",
			image_url: "/portfolio/kahadelivery.jpg",
			project_url: "https://youtube.com",
			is_featured: false,
			is_active: true,
			categories: ["Mobile Development"],
			technologies: ["React Native", "Firebase", "Express.js"]
		},
		{
			portfolio_id: 3,
			project_name: "Corporate Website Redesign",
			project_description: "Redesign website corporate dengan modern UI/UX",
			client_name: "PT. Maju Bersama",
			project_start_date: "2024-02-10",
			project_end_date: "2024-05-20",
			image_url: "/portfolio/corporate.jpg",
			project_url: "https://youtube.com",
			is_featured: true,
			is_active: false,
			categories: ["Web Development", "UI/UX Design"],
			technologies: ["Next.js", "TailwindCSS", "Framer Motion"]
		}
	];
	
	let searchQuery = '';
	let selectedCategory = '';
	let selectedStatus = '';
	let selectedFeatured = '';
	let filteredPortfolios = portfolios;
	
	// Filter function
	function filterPortfolios() {
		filteredPortfolios = portfolios.filter(portfolio => {
			// Text search filter
			const textMatch = !searchQuery.trim() || 
				portfolio.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.project_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
			
			// Category filter
			const categoryMatch = !selectedCategory || 
				portfolio.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()));
			
			// Status filter
			const statusMatch = !selectedStatus || 
				(selectedStatus === 'active' && portfolio.is_active) ||
				(selectedStatus === 'inactive' && !portfolio.is_active);
			
			// Featured filter
			const featuredMatch = !selectedFeatured || 
				(selectedFeatured === 'featured' && portfolio.is_featured) ||
				(selectedFeatured === 'not-featured' && !portfolio.is_featured);
			
			return textMatch && categoryMatch && statusMatch && featuredMatch;
		});
	}
	
	// Handle delete
	function handleDelete(portfolioId) {
		if (confirm('Apakah Anda yakin ingin menghapus portfolio ini?')) {
			portfolios = portfolios.filter(p => p.portfolio_id !== portfolioId);
			filterPortfolios();
		}
	}
	
	// Toggle featured status
	function toggleFeatured(portfolioId) {
		portfolios = portfolios.map(p => 
			p.portfolio_id === portfolioId 
				? { ...p, is_featured: !p.is_featured }
				: p
		);
		filterPortfolios();
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	onMount(() => {
		filterPortfolios();
	});
	
	// Reactive statement untuk semua filter
	$: if (searchQuery !== undefined || selectedCategory !== undefined || selectedStatus !== undefined || selectedFeatured !== undefined) {
		filterPortfolios();
	}
</script>

<svelte:head>
	<title>Portfolio Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header Section -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Portfolio Management</h1>
				<p class="text-gray-600 mt-1">Kelola dan tampilkan project portfolio perusahaan</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<a 
					href="/dashboard/portfolio/create"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Portfolio
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Portfolio</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{portfolios.length}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Eye class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Featured</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{portfolios.filter(p => p.is_featured).length}</p>
				</div>
				<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
					<Tag class="w-6 h-6 text-yellow-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active Projects</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{portfolios.filter(p => p.is_active).length}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<Calendar class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Completed</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{portfolios.filter(p => new Date(p.project_end_date) < new Date()).length}</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<ExternalLink class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
		<div class="flex flex-col xl:flex-row gap-4">
			<!-- Search Bar -->
			<div class="flex-1 min-w-0">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Cari portfolio berdasarkan nama project, client, kategori, atau deskripsi..."
						bind:value={searchQuery}
						class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
					/>
				</div>
			</div>
			
			<!-- Filter Buttons -->
			<div class="flex flex-wrap gap-2">
				<!-- Status Filter -->
				<div class="relative">
					<select 
						bind:value={selectedStatus}
						class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
					>
						<option value="">Semua Status</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
				
				<!-- Category Filter -->
				<div class="relative">
					<select 
						bind:value={selectedCategory}
						class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[160px]"
					>
						<option value="">Semua Kategori</option>
						<option value="web">Web Development</option>
						<option value="mobile">Mobile Development</option>
						<option value="ecommerce">E-Commerce</option>
						<option value="ui/ux">UI/UX Design</option>
					</select>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
				
				<!-- Featured Filter -->
				<div class="relative">
					<select 
						bind:value={selectedFeatured}
						class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[150px]"
					>
						<option value="">Semua Featured</option>
						<option value="featured">Featured</option>
						<option value="not-featured">Not Featured</option>
					</select>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Portfolio Table -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Daftar Portfolio</h3>
		</div>
		
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each filteredPortfolios as portfolio}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="flex items-start">
									<div class="flex-shrink-0 h-12 w-12 relative">
										<img 
											class="h-12 w-12 rounded-lg object-cover border border-gray-200" 
											src={portfolio.image_url} 
											alt={portfolio.project_name}
											onerror={(e) => e.target.src = '/placeholder-project.jpg'}
										/>
										{#if portfolio.is_featured}
											<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Featured Project">
												<div class="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
											</div>
										{/if}
									</div>
									<div class="ml-4 flex-1 min-w-0">
										<div class="text-sm font-medium text-gray-900 mb-1">{portfolio.project_name}</div>
										<div class="text-sm text-gray-500 line-clamp-2 mb-2">{portfolio.project_description}</div>
										{#if portfolio.project_url}
											<a 
												href={portfolio.project_url} 
												target="_blank" 
												rel="noopener noreferrer"
												class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
											>
												<ExternalLink class="w-3 h-3" />
												Lihat Project
											</a>
										{/if}
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">{portfolio.client_name}</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-col gap-2">
									{#each portfolio.categories as category}
										<span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border border-indigo-200 w-fit">
											{category}
										</span>
									{/each}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">{formatDate(portfolio.project_start_date)}</div>
								<div class="text-sm text-gray-500">s/d {formatDate(portfolio.project_end_date)}</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-wrap gap-1">
									{#each portfolio.technologies.slice(0, 2) as tech}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{tech}
										</span>
									{/each}
									{#if portfolio.technologies.length > 2}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											+{portfolio.technologies.length - 2}
										</span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {portfolio.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{portfolio.is_active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium">
								<div class="flex items-center justify-end gap-2">
									<a 
										href="/dashboard/portfolio/{portfolio.portfolio_id}"
										class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
										title="View Details"
									>
										<Eye class="w-4 h-4" />
									</a>
									<a 
										href="/dashboard/portfolio/{portfolio.portfolio_id}/edit"
										class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
										title="Edit"
									>
										<Edit class="w-4 h-4" />
									</a>
									<button 
										onclick={() => toggleFeatured(portfolio.portfolio_id)}
										class="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
										title={portfolio.is_featured ? 'Remove from Featured' : 'Add to Featured'}
									>
										<Tag class="w-4 h-4" />
									</button>
									<button 
										onclick={() => handleDelete(portfolio.portfolio_id)}
										class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete"
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		{#if filteredPortfolios.length === 0}
			<div class="text-center py-12">
				<Eye class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada portfolio</h3>
				<p class="mt-1 text-sm text-gray-500">Mulai dengan menambahkan portfolio pertama Anda.</p>
				<div class="mt-6">
					<a 
						href="/dashboard/portfolio/create"
						class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
					>
						<Plus class="w-4 h-4 mr-2" />
						Tambah Portfolio
					</a>
				</div>
			</div>
		{/if}
	</div>

	<!-- Pagination (for future implementation) -->
	<div class="mt-8 flex items-center justify-between">
		<div class="text-sm text-gray-700">
			Menampilkan <span class="font-medium">{filteredPortfolios.length}</span> dari <span class="font-medium">{portfolios.length}</span> portfolio
		</div>
		<div class="flex items-center gap-2">
			<!-- Pagination buttons will be here -->
		</div>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>