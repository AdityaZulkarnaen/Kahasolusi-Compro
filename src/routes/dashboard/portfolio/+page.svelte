<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Calendar, Tag, ExternalLink } from 'lucide-svelte';
	import { portfolioAPI, categoriesAPI, technologiesAPI } from '$lib/api.js';
	import { browser } from '$app/environment';
	
	// Get base URL for images
	const API_BASE_URL = browser ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api' : '';
	const BASE_URL = API_BASE_URL.replace('/api', ''); // Remove /api suffix for image URLs
	
	// Helper function to get full image URL
	function getImageUrl(imagePath) {
		if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVMMTI1IDEyNUw4NyA4N0w3NSAxMDBMMTI1IDE1MEwxNzUgMTAwVjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSI4NyIgY3k9Ijc1IiByPSIxMiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
		if (imagePath.startsWith('http')) return imagePath;
		return `${BASE_URL}${imagePath}`;
	}
	
	// Data state
	let portfolios = [];
	let categories = [];
	let technologies = [];
	let loading = false;
	let error = null;
	
	let searchQuery = '';
	let selectedCategory = '';
	let selectedStatus = '';
	let selectedFeatured = '';
	let filteredPortfolios = [];

	// Delete modal state
	let showDeleteModal = false;
	let portfolioToDelete = null;
	let deleting = false;

	// Load data on component mount
	onMount(async () => {
		await loadInitialData();
	});

	// Load all required data
	async function loadInitialData() {
		loading = true;
		error = null;
		
		try {
			// Load portfolios, categories, and technologies in parallel
			const [portfoliosData, categoriesData, technologiesData] = await Promise.all([
				portfolioAPI.getAll(),
				categoriesAPI.getAll(),
				technologiesAPI.getAll()
			]);
			
			portfolios = portfoliosData;
			categories = categoriesData;
			technologies = technologiesData;
			
			filterPortfolios();
		} catch (err) {
			error = err.message;
			console.error('Failed to load data:', err);
		} finally {
			loading = false;
		}
	}

	// Reload portfolios data
	async function loadPortfolios() {
		try {
			portfolios = await portfolioAPI.getAll();
			filterPortfolios();
		} catch (err) {
			error = err.message;
			console.error('Failed to load portfolios:', err);
		}
	}
	
	// Filter function
	function filterPortfolios() {
		if (!portfolios || portfolios.length === 0) {
			filteredPortfolios = [];
			return;
		}

		filteredPortfolios = portfolios.filter(portfolio => {
			// Text search filter
			const textMatch = !searchQuery.trim() || 
				portfolio.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.project_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.categories?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				portfolio.technologies?.toLowerCase().includes(searchQuery.toLowerCase());
			
			// Category filter
			const categoryMatch = !selectedCategory || 
				portfolio.categories?.toLowerCase().includes(selectedCategory.toLowerCase());
			
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

	// Handle delete confirmation
	function confirmDelete(portfolio) {
		portfolioToDelete = portfolio;
		showDeleteModal = true;
	}

	// Execute delete
	async function executeDelete() {
		if (!portfolioToDelete) return;
		
		deleting = true;
		try {
			await portfolioAPI.delete(portfolioToDelete.portfolio_id);
			await loadPortfolios();
			showDeleteModal = false;
			portfolioToDelete = null;
		} catch (err) {
			error = err.message;
			console.error('Failed to delete portfolio:', err);
		} finally {
			deleting = false;
		}
	}

	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		portfolioToDelete = null;
	}

	// Handle ESC key to close modal
	function handleKeydown(event) {
		if (event.key === 'Escape' && showDeleteModal) {
			cancelDelete();
		}
	}

	// Handle click outside modal
	function handleModalClick(event) {
		if (event.target === event.currentTarget) {
			cancelDelete();
		}
	}

	// Format date function
	function formatDate(dateString) {
		if (!dateString) return 'N/A';
		
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('id-ID', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				timeZone: 'Asia/Jakarta'
			});
		} catch (error) {
			return 'Invalid Date';
		}
	}

	// Reactive statement to update filters
	$: if (searchQuery || selectedCategory || selectedStatus || selectedFeatured) {
		filterPortfolios();
	}
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
						{#each categories as category}
							<option value={category.category_name}>{category.category_name}</option>
						{/each}
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
					{#if loading}
						<tr>
							<td colspan="7" class="px-6 py-12 text-center">
								<div class="flex items-center justify-center">
									<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
									<span class="ml-2 text-gray-600">Memuat portfolio...</span>
								</div>
							</td>
						</tr>
					{:else if error}
						<tr>
							<td colspan="7" class="px-6 py-12 text-center">
								<div class="text-red-600">
									<p class="font-medium">Error memuat data:</p>
									<p class="text-sm mt-1">{error}</p>
									<button 
										onclick={loadInitialData}
										class="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
									>
										Coba Lagi
									</button>
								</div>
							</td>
						</tr>
					{:else}
						{#each filteredPortfolios as portfolio}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<div class="flex items-start">
										<div class="flex-shrink-0 h-12 w-12 relative">
											<img 
												class="h-12 w-12 rounded-lg object-cover border border-gray-200" 
												src={getImageUrl(portfolio.image_url)} 
												alt={portfolio.project_name}
												onerror={(e) => e.target.src = getImageUrl(null)}
											/>
											{#if portfolio.is_featured}
												<div class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Featured Project">
													<div class="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
												</div>
											{/if}
										</div>
										<div class="ml-4 flex-1 min-w-0">
											<div class="text-sm font-medium text-gray-900 mb-1">{portfolio.project_name}</div>
											<div class="text-sm text-gray-500 line-clamp-2 mb-2">{portfolio.project_description || 'Tidak ada deskripsi'}</div>
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
								<div class="text-sm text-gray-900">{portfolio.client_name || 'N/A'}</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-wrap gap-1">
									{#if portfolio.categories}
										{#each portfolio.categories.split(',') as category}
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
												{category.trim()}
											</span>
										{/each}
									{:else}
										<span class="text-xs text-gray-400">No categories</span>
									{/if}
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">{formatDate(portfolio.project_start_date)}</div>
								<div class="text-sm text-gray-500">s/d {formatDate(portfolio.project_end_date)}</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex flex-wrap gap-1">
									{#if portfolio.technologies}
										{#each portfolio.technologies.split(',').slice(0, 3) as tech}
											<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												{tech.trim()}
											</span>
										{/each}
										{#if portfolio.technologies.split(',').length > 3}
											<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
												+{portfolio.technologies.split(',').length - 3}
											</span>
										{/if}
									{:else}
										<span class="text-xs text-gray-400">No technologies</span>
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
											href="/dashboard/portfolio/{portfolio.portfolio_id}/edit"
											class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</a>
										<button 
											onclick={() => confirmDelete(portfolio)}
											class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
											title="Delete"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		
		{#if !loading && !error && filteredPortfolios.length === 0}
			<div class="text-center py-12">
				<Eye class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">
					{portfolios.length === 0 ? 'Tidak ada portfolio' : 'Tidak ada portfolio yang sesuai filter'}
				</h3>
				<p class="mt-1 text-sm text-gray-500">
					{portfolios.length === 0 
						? 'Mulai dengan menambahkan portfolio pertama Anda.' 
						: 'Coba ubah filter pencarian atau reset filter.'
					}
				</p>
				<div class="mt-6">
					{#if portfolios.length === 0}
						<a 
							href="/dashboard/portfolio/create"
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Plus class="w-4 h-4 mr-2" />
							Tambah Portfolio
						</a>
					{:else}
						<button
							onclick={() => {
								searchQuery = '';
								selectedCategory = '';
								selectedStatus = '';
								selectedFeatured = '';
							}}
							class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
						>
							Reset Filter
						</button>
					{/if}
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

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && portfolioToDelete}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
		onclick={handleModalClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
						<Trash2 class="w-5 h-5 text-red-600" />
					</div>
					<div>
						<h3 id="modal-title" class="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
						<p class="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
					</div>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6">
				<div class="mb-4">
					<p class="text-gray-700 mb-3">
						Apakah Anda yakin ingin menghapus portfolio ini?
					</p>
					<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
						<div class="flex items-center gap-3">
							{#if portfolioToDelete.image_url}
								<img 
									src={getImageUrl(portfolioToDelete.image_url)} 
									alt={portfolioToDelete.project_name}
									class="w-12 h-12 object-cover rounded-lg"
									onerror={(e) => e.target.src = getImageUrl(null)}
								/>
							{:else}
								<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
									<Eye class="w-6 h-6 text-gray-400" />
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-gray-900 truncate">
									{portfolioToDelete.project_name}
								</h4>
								<p class="text-sm text-gray-500 truncate">
									{portfolioToDelete.client_name}
								</p>
							</div>
						</div>
					</div>
				</div>
				
				<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
					<div class="flex items-start gap-2">
						<svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
						</svg>
						<div>
							<p class="text-sm font-medium text-yellow-800">Peringatan!</p>
							<p class="text-sm text-yellow-700">
								Data portfolio dan file gambar yang terkait akan dihapus secara permanen.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
				<button
					type="button"
					onclick={cancelDelete}
					class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
					disabled={deleting}
				>
					Batal
				</button>
				<button
					type="button"
					onclick={executeDelete}
					disabled={deleting}
					class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if deleting}
						<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
						Menghapus...
					{:else}
						<Trash2 class="w-4 h-4" />
						Hapus Portfolio
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>