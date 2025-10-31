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
			project_url: "https://kahashop.com",
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
			project_url: "https://play.google.com/store/apps/kahadelivery",
			is_featured: false,
			is_active: true,
			categories: ["Mobile Development"],
			technologies: ["React Native", "Firebase", "Express.js"]
		}
	];
	
	let searchQuery = '';
	let filteredPortfolios = portfolios;
	
	// Filter function
	function filterPortfolios() {
		if (!searchQuery.trim()) {
			filteredPortfolios = portfolios;
		} else {
			filteredPortfolios = portfolios.filter(portfolio => 
				portfolio.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.project_description.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
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
	
	// Reactive statement untuk search
	$: if (searchQuery !== undefined) filterPortfolios();
</script>

<svelte:head>
	<title>Portfolio Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<!-- Header Section -->
	<div class="mb-8">
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
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-1">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Cari portfolio berdasarkan nama project, client, atau deskripsi..."
						bind:value={searchQuery}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
			</div>
			<div class="flex gap-3">
				<select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
					<option value="">Semua Status</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
				<select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
					<option value="">Semua Kategori</option>
					<option value="web">Web Development</option>
					<option value="mobile">Mobile Development</option>
					<option value="ecommerce">E-Commerce</option>
				</select>
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
								<div class="flex items-center">
									<div class="flex-shrink-0 h-12 w-12">
										<img 
											class="h-12 w-12 rounded-lg object-cover border border-gray-200" 
											src={portfolio.image_url} 
											alt={portfolio.project_name}
											on:error={(e) => e.target.src = '/placeholder-project.jpg'}
										/>
									</div>
									<div class="ml-4">
										<div class="flex items-center gap-2">
											<div class="text-sm font-medium text-gray-900">{portfolio.project_name}</div>
											{#if portfolio.is_featured}
												<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
													Featured
												</span>
											{/if}
										</div>
										<div class="text-sm text-gray-500 line-clamp-2 max-w-xs">{portfolio.project_description}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">{portfolio.client_name}</div>
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
										on:click={() => toggleFeatured(portfolio.portfolio_id)}
										class="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
										title={portfolio.is_featured ? 'Remove from Featured' : 'Add to Featured'}
									>
										<Tag class="w-4 h-4" />
									</button>
									<button 
										on:click={() => handleDelete(portfolio.portfolio_id)}
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