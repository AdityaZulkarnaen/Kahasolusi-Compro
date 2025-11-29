<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Upload, ExternalLink, Code2, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { technologiesAPI, uploadAPI } from '$lib/api.js';
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
	let technologies = [];
	let loading = false;
	let error = null;
	
	let searchQuery = '';
	let selectedType = '';
	let selectedStatus = '';
	let filteredTechnologies = [];
	let viewMode = 'grid'; // 'table' or 'grid'
	
	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 6; 
	let totalPages = 1;
	let paginatedTechnologies = [];

	// Delete modal state
	let showDeleteModal = false;
	let technologyToDelete = null;
	let deleting = false;

	// Create/Edit modal state
	let showModal = false;
	let editingTechnology = null;
	let modalTitle = '';
	let submitting = false;
	let redirecting = false;
	let success = false;
	let successMessage = '';

	// Form data
	let formData = {
		tech_name: '',
		tech_type: '',
		tech_description: '',
		logo_url: '',
		official_url: '',
		is_active: 1,
		sort_order: 0
	};

	// Image upload
	let logoFile = null;
	let logoPreview = '';

	// Load data on component mount
	onMount(async () => {
		await loadTechnologies();
	});

	// Load technologies data
	async function loadTechnologies() {
		loading = true;
		error = null;
		
		try {
			technologies = await technologiesAPI.getAll();
			filterTechnologies();
		} catch (err) {
			error = err.message;
			console.error('Failed to load technologies:', err);
		} finally {
			loading = false;
		}
	}
	
	// Filter function
	function filterTechnologies() {
		if (!technologies || technologies.length === 0) {
			filteredTechnologies = [];
			return;
		}

		filteredTechnologies = technologies.filter(tech => {
			// Text search filter
			const textMatch = !searchQuery.trim() || 
				tech.tech_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tech.tech_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tech.tech_description?.toLowerCase().includes(searchQuery.toLowerCase());
			
			// Type filter
			const typeMatch = !selectedType || 
				tech.tech_type?.toLowerCase().includes(selectedType.toLowerCase());
			
			// Status filter
			const statusMatch = !selectedStatus || 
				(selectedStatus === 'active' && tech.is_active) ||
				(selectedStatus === 'inactive' && !tech.is_active);
			
			return textMatch && typeMatch && statusMatch;
		});
		
		// Update pagination
		totalPages = Math.ceil(filteredTechnologies.length / itemsPerPage);
		currentPage = Math.min(currentPage, Math.max(1, totalPages));
		updatePaginatedTechnologies();
	}
	
	// Update paginated technologies
	function updatePaginatedTechnologies() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		paginatedTechnologies = filteredTechnologies.slice(startIndex, endIndex);
	}
	
	// Pagination functions
	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			updatePaginatedTechnologies();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			updatePaginatedTechnologies();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			updatePaginatedTechnologies();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// Handle delete confirmation
	function confirmDelete(technology) {
		technologyToDelete = technology;
		showDeleteModal = true;
	}

	// Execute delete
	async function executeDelete() {
		if (!technologyToDelete) return;
		
		deleting = true;
		try {
			await technologiesAPI.delete(technologyToDelete.tech_id);
			await loadTechnologies();
			showDeleteModal = false;
			technologyToDelete = null;
		} catch (err) {
			error = err.message;
			console.error('Failed to delete technology:', err);
		} finally {
			deleting = false;
		}
	}

	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		technologyToDelete = null;
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

	// Open edit modal
	function openEditModal(tech) {
		editingTechnology = tech;
		modalTitle = 'Edit Teknologi';
		formData = {
			tech_name: tech.tech_name || '',
			tech_type: tech.tech_type || '',
			tech_description: tech.tech_description || '',
			logo_url: tech.logo_url || '',
			official_url: tech.official_url || '',
			is_active: tech.is_active ? 1 : 0,
			sort_order: tech.sort_order || 0
		};
		logoFile = null;
		logoPreview = '';
		showModal = true;
	}

	// Close modal
	function closeModal() {
		showModal = false;
		editingTechnology = null;
		error = null;
		success = false;
	}

	// Handle file selection for logo
	function handleLogoFile(event) {
		const file = event.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) { // 5MB limit
				error = 'Ukuran file logo maksimal 5MB';
				return;
			}

			if (!file.type.startsWith('image/')) {
				error = 'File harus berupa gambar';
				return;
			}

			logoFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				logoPreview = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}

	// Upload image
	async function uploadImage(file) {
		if (!file) return null;

		try {
			const uploadResult = await uploadAPI.uploadTechnologyImage(file);
			return uploadResult.path;
		} catch (err) {
			throw new Error(`Upload logo gagal: ${err.message}`);
		}
	}

	// Handle form submission
	async function handleSubmit(event) {
		event.preventDefault();
		
		// Prevent multiple submissions
		if (submitting || redirecting) {
			return;
		}
		
		if (!formData.tech_name.trim()) {
			error = 'Nama teknologi harus diisi';
			return;
		}

		if (!formData.tech_type.trim()) {
			error = 'Tipe teknologi harus diisi';
			return;
		}

		submitting = true;
		error = null;

		try {
			// Upload logo if selected
			let logoUrl = formData.logo_url;

			if (logoFile) {
				logoUrl = await uploadImage(logoFile);
			}

			// Prepare submission data
			const submissionData = {
				...formData,
				logo_url: logoUrl
			};

			if (editingTechnology) {
				await technologiesAPI.update(editingTechnology.tech_id, submissionData);
				successMessage = 'Teknologi berhasil diperbarui!';
			} else {
				await technologiesAPI.create(submissionData);
				successMessage = 'Teknologi berhasil dibuat!';
			}
			
			success = true;
			redirecting = true;
			
			// Hide success message after 3 seconds and close modal
			setTimeout(() => {
				success = false;
				closeModal();
				loadTechnologies();
			}, 2000);
		} catch (err) {
			error = err.message;
			console.error('Failed to save technology:', err);
		} finally {
			submitting = false;
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
	$: if (searchQuery || selectedType || selectedStatus) {
		filterTechnologies();
	}
	$: if (searchQuery !== undefined || selectedType !== undefined || selectedStatus !== undefined) {
		filterTechnologies();
	}
</script>

<svelte:head>
	<title>Technology Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header Section -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Technology Management</h1>
				<p class="text-gray-600 mt-1">Kelola teknologi dan tools yang digunakan dalam project</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<!-- View Mode Toggle -->
				<div class="flex rounded-lg border border-gray-300 p-1 bg-gray-50">
					<button
						onclick={() => viewMode = 'table'}
						class={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
							viewMode === 'table' 
							? 'bg-white text-gray-900 shadow-sm' 
							: 'text-gray-600 hover:text-gray-900'
						}`}
						aria-label="Tampilan Tabel"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
						</svg>
					</button>
					<button
						onclick={() => viewMode = 'grid'}
						class={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
							viewMode === 'grid' 
							? 'bg-white text-gray-900 shadow-sm' 
							: 'text-gray-600 hover:text-gray-900'
						}`}
						aria-label="Tampilan Grid"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
					</button>
				</div>
				
				<a
					href="/dashboard/teknologi/create"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Teknologi
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Teknologi</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{technologies.length}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Code2 class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{technologies.filter(t => t.is_active).length}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<Eye class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Frontend</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{technologies.filter(t => t.tech_type?.includes('Frontend')).length}</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Upload class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Backend</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{technologies.filter(t => t.tech_type?.includes('Backend')).length}</p>
				</div>
				<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
					<ExternalLink class="w-6 h-6 text-yellow-600" />
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
						placeholder="Cari teknologi berdasarkan nama, tipe, atau deskripsi..."
						bind:value={searchQuery}
						class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
					/>
				</div>
			</div>
			
			<!-- Filter Buttons -->
			<div class="flex flex-wrap gap-2">
				<!-- Technology Type Filter -->
				<div class="relative">
					<select 
						bind:value={selectedType}
						class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[180px]"
					>
						<option value="">Semua Tipe</option>
						<option value="Frontend Framework">Frontend Framework</option>
						<option value="Backend Framework">Backend Framework</option>
						<option value="Backend Runtime">Backend Runtime</option>
						<option value="Database">Database</option>
						<option value="CSS Framework">CSS Framework</option>
						<option value="Programming Language">Programming Language</option>
						<option value="Mobile Framework">Mobile Framework</option>
						<option value="Cloud Service">Cloud Service</option>
						<option value="DevOps Tool">DevOps Tool</option>
						<option value="Design Tool">Design Tool</option>
					</select>
					<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</div>
				</div>
				
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
			</div>
		</div>
	</div>

	<!-- Technology Table View -->
	{#if viewMode === 'table'}
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Daftar Teknologi</h3>
		</div>
		
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teknologi</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if loading}
						<tr>
							<td colspan="6" class="px-6 py-12 text-center">
								<div class="flex items-center justify-center">
									<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
									<span class="ml-2 text-gray-600">Memuat teknologi...</span>
								</div>
							</td>
						</tr>
					{:else if error}
						<tr>
							<td colspan="6" class="px-6 py-12 text-center">
								<div class="text-red-600">
									<p class="font-medium">Error memuat data:</p>
									<p class="text-sm mt-1">{error}</p>
									<button 
										onclick={loadTechnologies}
										class="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
									>
										Coba Lagi
									</button>
								</div>
							</td>
						</tr>
					{:else}
						{#each filteredTechnologies as tech}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10 relative">
											<img 
												class="h-10 w-10 rounded-lg object-contain border border-gray-200" 
												src={getImageUrl(tech.logo_url)} 
												alt={tech.tech_name}
												onerror={(e) => e.target.src = getImageUrl(null)}
											/>
										</div>
										<div class="ml-4 flex-1 min-w-0">
											<div class="text-sm font-medium text-gray-900">{tech.tech_name}</div>
											{#if tech.official_url}
												<a 
													href={tech.official_url} 
													target="_blank" 
													rel="noopener noreferrer"
													class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
												>
													<ExternalLink class="w-3 h-3" />
													Official Site
												</a>
											{/if}
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
										{tech.tech_type || 'N/A'}
									</span>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-900 line-clamp-2">{tech.tech_description || 'Tidak ada deskripsi'}</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {tech.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
										{tech.is_active ? 'Active' : 'Inactive'}
									</span>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm text-gray-900">{tech.sort_order || 0}</div>
								</td>
								<td class="px-6 py-4 text-right text-sm font-medium">
									<div class="flex items-center justify-end gap-2">
										<button 
											onclick={() => openEditModal(tech)}
											class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</button>
										<button 
											onclick={() => confirmDelete(tech)}
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
		
		{#if !loading && !error && filteredTechnologies.length === 0}
			<div class="text-center py-12">
				<Code2 class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">
					{technologies.length === 0 ? 'Tidak ada teknologi' : 'Tidak ada teknologi yang sesuai filter'}
				</h3>
				<p class="mt-1 text-sm text-gray-500">
					{technologies.length === 0 
						? 'Mulai dengan menambahkan teknologi pertama Anda.' 
						: 'Coba ubah filter pencarian atau reset filter.'
					}
				</p>
				<div class="mt-6">
					{#if technologies.length === 0}
							<a
								href="/dashboard/teknologi/create"
								class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
							>
								<Plus class="w-4 h-4 mr-2" />
								Tambah Teknologi
							</a>
					{:else}
						<button
							onclick={() => {
								searchQuery = '';
								selectedType = '';
								selectedStatus = '';
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
	{/if}

	<!-- Pagination (for future implementation) -->
	<div class="mt-8 flex items-center justify-between">
		<div class="text-sm text-gray-700">
			Menampilkan <span class="font-medium">{filteredTechnologies.length}</span> dari <span class="font-medium">{technologies.length}</span> teknologi
		</div>
		<div class="flex items-center gap-2">
			<!-- Pagination buttons will be here -->
		</div>
	</div>
</div>

<!-- Create/Edit Modal -->
{#if showModal}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.5);"
		onclick={handleModalClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto transform transition-all max-h-[90vh] overflow-y-auto">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">{modalTitle}</h3>
				<button 
					onclick={closeModal}
					class="text-gray-400 hover:text-gray-600 p-1"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Success Toast Notification -->
			{#if success}
				<div class="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
					<svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<span class="font-medium">{successMessage}</span>
				</div>
			{/if}

			<!-- Loading Overlay -->
			{#if submitting}
				<div 
					class="fixed inset-0 flex items-center justify-center z-50"
					style="background-color: rgba(0, 0, 0, 0.5);"
				>
					<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
						<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<div>
							<p class="text-lg font-medium text-gray-900">{editingTechnology ? 'Memperbarui' : 'Menyimpan'} Teknologi...</p>
							<p class="text-sm text-gray-500">Mohon tunggu, sedang memproses data</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Redirecting Overlay -->
			{#if redirecting}
				<div 
					class="fixed inset-0 flex items-center justify-center z-50"
					style="background-color: rgba(0, 0, 0, 0.3);"
				>
					<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
						<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
						<div>
							<p class="text-lg font-medium text-gray-900">Teknologi Berhasil {editingTechnology ? 'Diperbarui' : 'Dibuat'}!</p>
							<p class="text-sm text-gray-500">Memuat ulang data...</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="space-y-6 p-6 {submitting || redirecting ? 'pointer-events-none opacity-75' : ''}">
				<!-- Error Message -->
				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<div class="flex">
							<div class="flex-shrink-0">
								<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
								</svg>
							</div>
							<div class="ml-3">
								<p class="text-sm font-medium text-red-800">{error}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Basic Information -->
				<div class="space-y-4">
					<h4 class="text-lg font-medium text-gray-900">Informasi Dasar</h4>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="tech_name" class="block text-sm font-medium text-gray-700 mb-2">
								Nama Teknologi <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="tech_name"
								bind:value={formData.tech_name}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="Contoh: React, Node.js, MySQL"
								required
							/>
						</div>
						
						<div>
							<label for="tech_type" class="block text-sm font-medium text-gray-700 mb-2">
								Tipe Teknologi <span class="text-red-500">*</span>
							</label>
							<select
								id="tech_type"
								bind:value={formData.tech_type}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								required
							>
								<option value="">Pilih tipe...</option>
								<option value="Frontend Framework">Frontend Framework</option>
								<option value="Backend Framework">Backend Framework</option>
								<option value="Backend Runtime">Backend Runtime</option>
								<option value="Database">Database</option>
								<option value="CSS Framework">CSS Framework</option>
								<option value="Programming Language">Programming Language</option>
								<option value="Mobile Framework">Mobile Framework</option>
								<option value="Cloud Service">Cloud Service</option>
								<option value="DevOps Tool">DevOps Tool</option>
								<option value="Design Tool">Design Tool</option>
							</select>
						</div>
					</div>

					<div>
						<label for="tech_description" class="block text-sm font-medium text-gray-700 mb-2">
							Deskripsi
						</label>
						<textarea
							id="tech_description"
							bind:value={formData.tech_description}
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							placeholder="Deskripsi singkat tentang teknologi ini..."
						></textarea>
					</div>

					<div>
						<label for="official_url" class="block text-sm font-medium text-gray-700 mb-2">
							URL Official Website
						</label>
						<input
							type="url"
							id="official_url"
							bind:value={formData.official_url}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							placeholder="https://..."
						/>
					</div>
				</div>

				<!-- Image Upload -->
				<div class="space-y-4">
					<h4 class="text-lg font-medium text-gray-900">Logo Teknologi</h4>
					
					<!-- Logo Upload -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-3">Logo</label>
						<div class="space-y-3">
							<div class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
								{#if logoPreview}
									<img src={logoPreview} alt="Logo Preview" class="w-full h-full object-contain rounded-lg p-4" />
								{:else if formData.logo_url}
									<img src={getImageUrl(formData.logo_url)} alt="Current Logo" class="w-full h-full object-contain rounded-lg p-4" />
								{:else}
									<div class="text-center">
										<Upload class="mx-auto h-8 w-8 text-gray-400" />
										<p class="mt-2 text-sm text-gray-500">Upload logo teknologi</p>
										<p class="mt-1 text-xs text-gray-400">PNG, JPG, SVG (Max 5MB)</p>
									</div>
								{/if}
							</div>
							<input
								type="file"
								accept="image/*"
								onchange={handleLogoFile}
								class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
							/>
							{#if logoPreview || formData.logo_url}
								<button
									type="button"
									onclick={() => {
										logoPreview = '';
										logoFile = null;
										formData.logo_url = '';
									}}
									class="text-sm text-red-600 hover:text-red-800"
								>
									Hapus Logo
								</button>
							{/if}
						</div>
					</div>
				</div>

				<!-- Settings -->
				<div class="space-y-4">
					<h4 class="text-lg font-medium text-gray-900">Pengaturan</h4>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label for="sort_order" class="block text-sm font-medium text-gray-700 mb-2">
								Sort Order
							</label>
							<input
								type="number"
								id="sort_order"
								bind:value={formData.sort_order}
								min="0"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="0"
							/>
						</div>
						
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-3">Status</label>
							<div class="flex items-center gap-4">
								<label class="flex items-center">
									<input
										type="radio"
										bind:group={formData.is_active}
										value={1}
										class="mr-2"
									/>
									<span class="text-sm text-gray-700">Active</span>
								</label>
								<label class="flex items-center">
									<input
										type="radio"
										bind:group={formData.is_active}
										value={0}
										class="mr-2"
									/>
									<span class="text-sm text-gray-700">Inactive</span>
								</label>
							</div>
						</div>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="flex gap-3 pt-6 border-t border-gray-200">
					<button
						type="button"
						onclick={closeModal}
						class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
						disabled={submitting || redirecting}
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={submitting || redirecting || !formData.tech_name.trim() || !formData.tech_type.trim()}
						class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if submitting}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							{editingTechnology ? 'Memperbarui...' : 'Menyimpan...'}
						{:else if redirecting}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							Berhasil...
						{:else}
							{editingTechnology ? 'Perbarui Teknologi' : 'Simpan Teknologi'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && technologyToDelete}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
		onclick={handleModalClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
						<Trash2 class="w-5 h-5 text-red-600" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
						<p class="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
					</div>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6">
				<div class="mb-4">
					<p class="text-gray-700 mb-3">
						Apakah Anda yakin ingin menghapus teknologi ini?
					</p>
					<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
						<div class="flex items-center gap-3">
							{#if technologyToDelete.logo_url}
								<img 
									src={getImageUrl(technologyToDelete.logo_url)} 
									alt={technologyToDelete.tech_name}
									class="w-12 h-12 object-contain rounded-lg"
								/>
							{:else}
								<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
									<Code2 class="w-6 h-6 text-gray-400" />
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-gray-900 truncate">
									{technologyToDelete.tech_name}
								</h4>
								<p class="text-sm text-gray-500 truncate">
									{technologyToDelete.tech_type}
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
								Data teknologi dan file gambar yang terkait akan dihapus secara permanen.
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
						Hapus Teknologi
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Technology Grid View -->
{#if viewMode === 'grid'}
	<div class="px-4 lg:px-6">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
		{#each paginatedTechnologies as tech}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
				<!-- Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
							{#if tech.logo_url}
								<img 
									src={getImageUrl(tech.logo_url)} 
									alt={tech.tech_name}
									class="w-8 h-8 object-contain"
									onerror={(e) => e.target.style.display = 'none'}
								/>
							{:else}
								<Code2 class="w-6 h-6 text-gray-500" />
							{/if}
						</div>
						<div>
							<h3 class="font-semibold text-gray-900">{tech.tech_name}</h3>
							<p class="text-sm text-gray-500">{tech.tech_type}</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {tech.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
							{tech.is_active ? 'Active' : 'Inactive'}
						</span>
					</div>
				</div>
				
				<!-- Overview Info (moved to top) -->
				<div class="flex items-center justify-between mb-3 text-sm text-gray-500">
					<span>Used in {tech.usage_count} projects</span>
					<span>Added {formatDate(tech.created_at)}</span>
				</div>
				
				<!-- Description -->
				<p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{tech.tech_description}</p>
				
				<!-- Official Link -->
				<div class="mb-4 min-h-[20px] flex items-center">
					{#if tech.official_url}
						<a 
							href={tech.official_url}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
						>
							<ExternalLink class="w-3 h-3" />
							Official Website
						</a>
					{/if}
				</div>
				
				<!-- Actions -->
				<div class="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
					<div class="flex items-center gap-2">
						<button 
							onclick={() => window.location.href = `/dashboard/teknologi/${tech.tech_id}`}
							class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
							title="View Details"
						>
							<Eye class="w-4 h-4" />
						</button>
						<button 
							onclick={() => window.location.href = `/dashboard/teknologi/${tech.tech_id}/edit`}
							class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
							title="Edit"
						>
							<Edit class="w-4 h-4" />
						</button>
					</div>
					<div class="flex items-center gap-2">
						<button 
							onclick={() => toggleActive(tech.tech_id)}
							class="text-sm px-3 py-1 rounded-md border {tech.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'} transition-colors"
						>
							{tech.is_active ? 'Deactivate' : 'Activate'}
						</button>
						<button 
							onclick={() => confirmDelete(tech)}
							class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
							title="Delete"
							disabled={tech.usage_count > 0}
							class:opacity-50={tech.usage_count > 0}
							class:cursor-not-allowed={tech.usage_count > 0}
						>
							<Trash2 class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
	
	<!-- Pagination Controls -->
	{#if !loading && filteredTechnologies.length > itemsPerPage}
		<div class="flex justify-center items-center gap-2 mb-6">
			<!-- Previous Button -->
			<button
				onclick={prevPage}
				disabled={currentPage === 1}
				class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
			>
				<ChevronLeft class="w-5 h-5" />
			</button>
			
			<!-- Page Numbers -->
			{#each Array(totalPages) as _, index}
				{@const pageNumber = index + 1}
				<button
					onclick={() => goToPage(pageNumber)}
					class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200
						   {currentPage === pageNumber 
							 ? 'bg-[#0D4E6D] text-white' 
							 : 'border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white'}"
				>
					{pageNumber}
				</button>
			{/each}
			
			<!-- Next Button -->
			<button
				onclick={nextPage}
				disabled={currentPage === totalPages}
				class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
			>
				<ChevronRight class="w-5 h-5" />
			</button>
		</div>
		
		<!-- Page Info -->
		<div class="text-center mb-6 text-gray-600 text-sm">
			Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTechnologies.length)} dari {filteredTechnologies.length} teknologi
		</div>
	{/if}

	<!-- Empty State -->
	{#if paginatedTechnologies.length === 0}
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
			<div class="text-center">
				<Code2 class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada teknologi</h3>
				<p class="mt-1 text-sm text-gray-500">
					{searchQuery || selectedType ? 'Tidak ada teknologi yang sesuai dengan filter.' : 'Mulai dengan menambahkan teknologi pertama.'}
				</p>
				{#if !searchQuery && !selectedType}
					<div class="mt-6">
						<a 
							href="/dashboard/teknologi/create"
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Plus class="w-4 h-4 mr-2" />
							Tambah Teknologi
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && technologyToDelete}
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
						Apakah Anda yakin ingin menghapus teknologi ini?
					</p>
					<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
						<div class="flex items-center gap-3">
							{#if technologyToDelete.logo_url}
								<img 
									src={getImageUrl(technologyToDelete.logo_url)} 
									alt={technologyToDelete.tech_name}
									class="w-12 h-12 object-contain rounded-lg"
									onerror={(e) => e.target.src = getImageUrl(null)}
								/>
							{:else}
								<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
									<Code2 class="w-6 h-6 text-gray-400" />
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-gray-900 truncate">
									{technologyToDelete.tech_name}
								</h4>
								<p class="text-sm text-gray-500 truncate">
									{technologyToDelete.tech_type}
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
								Data teknologi dan file gambar yang terkait akan dihapus secara permanen.
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
						Hapus Teknologi
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