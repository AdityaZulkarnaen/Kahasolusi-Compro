<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Tag, Hash, Calendar } from 'lucide-svelte';
	
	// Sample data for categories
	let categories = [
		{
			category_id: 1,
			category_name: 'Web Development',
			category_slug: 'web-development',
			category_description: 'Pengembangan aplikasi web modern menggunakan teknologi terkini',
			created_at: '2024-01-15',
			updated_at: '2024-01-15',
			portfolio_count: 8,
			is_active: true
		},
		{
			category_id: 2,
			category_name: 'Mobile Development',
			category_slug: 'mobile-development',
			category_description: 'Pembuatan aplikasi mobile untuk platform iOS dan Android',
			created_at: '2024-01-10',
			updated_at: '2024-01-20',
			portfolio_count: 5,
			is_active: true
		},
		{
			category_id: 3,
			category_name: 'E-Commerce',
			category_slug: 'e-commerce',
			category_description: 'Solusi perdagangan elektronik untuk berbagai skala bisnis',
			created_at: '2024-01-05',
			updated_at: '2024-01-25',
			portfolio_count: 12,
			is_active: true
		},
		{
			category_id: 4,
			category_name: 'UI/UX Design',
			category_slug: 'ui-ux-design',
			category_description: 'Desain antarmuka dan pengalaman pengguna yang menarik',
			created_at: '2023-12-20',
			updated_at: '2024-01-18',
			portfolio_count: 6,
			is_active: true
		},
		{
			category_id: 5,
			category_name: 'System Integration',
			category_slug: 'system-integration',
			category_description: 'Integrasi sistem dan API untuk solusi enterprise',
			created_at: '2023-12-15',
			updated_at: '2024-01-12',
			portfolio_count: 3,
			is_active: false
		}
	];
	
	let searchQuery = '';
	let filteredCategories = categories;
	let sortBy = 'name'; // name, usage, date
	
	// Filter and sort functions
	function filterAndSortCategories() {
		let filtered = categories;
		
		// Search filter
		if (searchQuery.trim()) {
			filtered = filtered.filter(category => 
				category.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				category.category_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				category.category_slug.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Sorting
		switch (sortBy) {
			case 'usage':
				filtered.sort((a, b) => b.portfolio_count - a.portfolio_count);
				break;
			case 'date':
				filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				break;
			case 'name':
			default:
				filtered.sort((a, b) => a.category_name.localeCompare(b.category_name));
				break;
		}
		
		filteredCategories = filtered;
	}
	
	// Generate slug from name
	function generateSlug(name) {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, '')
			.replace(/\s+/g, '-')
			.trim();
	}
	
	// Handle delete
	function handleDelete(categoryId) {
		const category = categories.find(c => c.category_id === categoryId);
		if (category && category.portfolio_count > 0) {
			alert(`Tidak dapat menghapus kategori "${category.category_name}" karena sedang digunakan di ${category.portfolio_count} portfolio.`);
			return;
		}
		
		if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
			categories = categories.filter(c => c.category_id !== categoryId);
			filterAndSortCategories();
		}
	}
	
	// Toggle active status
	function toggleActive(categoryId) {
		categories = categories.map(c => 
			c.category_id === categoryId 
				? { ...c, is_active: !c.is_active, updated_at: new Date().toISOString().split('T')[0] }
				: c
		);
		filterAndSortCategories();
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	// Get usage badge color
	function getUsageBadgeColor(count) {
		if (count >= 10) return 'bg-green-100 text-green-800';
		if (count >= 5) return 'bg-blue-100 text-blue-800';
		if (count >= 1) return 'bg-yellow-100 text-yellow-800';
		return 'bg-gray-100 text-gray-800';
	}
	
	// Get stats
	$: stats = {
		total: categories.length,
		active: categories.filter(c => c.is_active).length,
		totalUsage: categories.reduce((sum, c) => sum + c.portfolio_count, 0),
		mostUsed: categories.reduce((prev, current) => 
			(prev.portfolio_count > current.portfolio_count) ? prev : current
		),
		unused: categories.filter(c => c.portfolio_count === 0).length
	};
	
	onMount(() => {
		filterAndSortCategories();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || sortBy !== undefined) {
		filterAndSortCategories();
	}
</script>

<svelte:head>
	<title>Categories Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<!-- Header Section -->
	<div class="mb-8">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Categories Management</h1>
				<p class="text-gray-600 mt-1">Kelola kategori untuk mengorganisir portfolio project</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<a 
					href="/dashboard/categories/create"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Kategori
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Kategori</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Tag class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<Eye class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Most Used</p>
					<p class="text-lg font-bold text-gray-900 mt-1">{stats.mostUsed?.category_name?.substring(0, 10) || 'N/A'}</p>
					<p class="text-sm text-gray-500">{stats.mostUsed?.portfolio_count || 0} projects</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Hash class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Usage</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsage}</p>
				</div>
				<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
					<Calendar class="w-6 h-6 text-yellow-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Unused</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.unused}</p>
				</div>
				<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
					<Trash2 class="w-6 h-6 text-red-600" />
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
						placeholder="Cari kategori berdasarkan nama, slug, atau deskripsi..."
						bind:value={searchQuery}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
			</div>
			<div class="flex gap-3">
				<select 
					bind:value={sortBy}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
				>
					<option value="name">Sort by Name</option>
					<option value="usage">Sort by Usage</option>
					<option value="date">Sort by Date</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Categories Table -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Daftar Kategori</h3>
		</div>
		
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terakhir Update</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#each filteredCategories as category}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="flex items-center">
									<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
										<Tag class="w-5 h-5 text-blue-600" />
									</div>
									<div>
										<div class="text-sm font-medium text-gray-900">{category.category_name}</div>
										<div class="text-sm text-gray-500">ID: {category.category_id}</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<Hash class="w-4 h-4 text-gray-400" />
									<code class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{category.category_slug}</code>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900 max-w-xs">
									<p class="line-clamp-2">{category.category_description}</p>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getUsageBadgeColor(category.portfolio_count)}">
									{category.portfolio_count} portfolio
								</span>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{category.is_active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 text-sm text-gray-500">
								{formatDate(category.updated_at)}
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium">
								<div class="flex items-center justify-end gap-2">
									<button 
										on:click={() => window.location.href = `/dashboard/categories/${category.category_id}`}
										class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
										title="View Details"
									>
										<Eye class="w-4 h-4" />
									</button>
									<button 
										on:click={() => window.location.href = `/dashboard/categories/${category.category_id}/edit`}
										class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
										title="Edit"
									>
										<Edit class="w-4 h-4" />
									</button>
									<button 
										on:click={() => toggleActive(category.category_id)}
										class="text-sm px-2 py-1 rounded-md border {category.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'} transition-colors"
										title={category.is_active ? 'Deactivate' : 'Activate'}
									>
										{category.is_active ? 'Off' : 'On'}
									</button>
									<button 
										on:click={() => handleDelete(category.category_id)}
										class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete"
										disabled={category.portfolio_count > 0}
										class:opacity-50={category.portfolio_count > 0}
										class:cursor-not-allowed={category.portfolio_count > 0}
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
		
		{#if filteredCategories.length === 0}
			<div class="text-center py-12">
				<Tag class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada kategori</h3>
				<p class="mt-1 text-sm text-gray-500">
					{searchQuery ? 'Tidak ada kategori yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan kategori pertama.'}
				</p>
				{#if !searchQuery}
					<div class="mt-6">
						<a 
							href="/dashboard/categories/create"
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Plus class="w-4 h-4 mr-2" />
							Tambah Kategori
						</a>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Category Usage Chart -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Category Usage Distribution</h3>
		<div class="space-y-4">
			{#each categories.filter(c => c.portfolio_count > 0).sort((a, b) => b.portfolio_count - a.portfolio_count) as category}
				<div class="flex items-center gap-4">
					<div class="w-32 text-sm font-medium text-gray-700 truncate">{category.category_name}</div>
					<div class="flex-1 bg-gray-200 rounded-full h-2">
						<div 
							class="bg-blue-600 h-2 rounded-full" 
							style="width: {(category.portfolio_count / Math.max(...categories.map(c => c.portfolio_count))) * 100}%"
						></div>
					</div>
					<div class="w-12 text-sm text-gray-600 text-right">{category.portfolio_count}</div>
				</div>
			{/each}
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