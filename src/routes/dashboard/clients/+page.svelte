<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Upload, ExternalLink, Briefcase, ChevronLeft, ChevronRight, X } from 'lucide-svelte';
	import { clientsAPI, uploadAPI } from '$lib/api.js';
	import { browser } from '$app/environment';
	
	// Get base URL for images
	const API_BASE_URL = browser ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api' : '';
	const BASE_URL = API_BASE_URL.replace('/api', '');
	
	// Helper function to get full image URL
	function getImageUrl(imagePath) {
		if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVMMTI1IDEyNUw4NyA4N0w3NSAxMDBMMTI1IDE1MEwxNzUgMTAwVjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSI4NyIgY3k9Ijc1IiByPSIxMiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
		if (imagePath.startsWith('http')) return imagePath;
		return `${BASE_URL}${imagePath}`;
	}
	
	// Data state
	let clients = [];
	let loading = false;
	let error = null;
	
	let searchQuery = '';
	let filteredClients = [];
	
	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 8;
	let totalPages = 1;
	let paginatedClients = [];

	// Delete modal state
	let showDeleteModal = false;
	let clientToDelete = null;
	let deleting = false;

	// Create/Edit modal state
	let showModal = false;
	let editingClient = null;
	let modalTitle = '';
	let submitting = false;
	let success = false;
	let successMessage = '';

	// Form data
	let formData = {
		client_name: '',
		client_logo: ''
	};

	// Image upload
	let logoFile = null;
	let logoPreview = '';

	// Load data on component mount
	onMount(async () => {
		await loadClients();
	});

	// Load clients data
	async function loadClients() {
		loading = true;
		error = null;
		
		try {
			const data = await clientsAPI.getAll();
			clients = data.data || data;
			filterClients();
		} catch (err) {
			error = err.message;
			console.error('Failed to load clients:', err);
		} finally {
			loading = false;
		}
	}
	
	// Filter function
	function filterClients() {
		if (!clients || clients.length === 0) {
			filteredClients = [];
			return;
		}

		filteredClients = clients.filter(client => {
			// Text search filter
			const textMatch = !searchQuery.trim() || 
				client.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
			
			return textMatch;
		});
		
		// Update pagination
		totalPages = Math.ceil(filteredClients.length / itemsPerPage);
		currentPage = Math.min(currentPage, Math.max(1, totalPages));
		updatePaginatedClients();
	}
	
	// Update paginated clients
	function updatePaginatedClients() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		paginatedClients = filteredClients.slice(startIndex, endIndex);
	}
	
	// Pagination functions
	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			updatePaginatedClients();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			updatePaginatedClients();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			updatePaginatedClients();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// Handle delete confirmation
	function confirmDelete(client) {
		clientToDelete = client;
		showDeleteModal = true;
	}

	// Execute delete
	async function executeDelete() {
		if (!clientToDelete) return;
		
		deleting = true;
		try {
			await clientsAPI.delete(clientToDelete.client_id);
			await loadClients();
			showDeleteModal = false;
			clientToDelete = null;
		} catch (err) {
			error = err.message;
			console.error('Failed to delete client:', err);
		} finally {
			deleting = false;
		}
	}

	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		clientToDelete = null;
	}

	// Open create modal
	function openCreateModal() {
		editingClient = null;
		modalTitle = 'Tambah Client Baru';
		formData = {
			client_name: '',
			client_logo: ''
		};
		logoPreview = '';
		logoFile = null;
		showModal = true;
	}

	// Open edit modal
	function openEditModal(client) {
		editingClient = client;
		modalTitle = 'Edit Client';
		formData = {
			client_name: client.client_name || '',
			client_logo: client.client_logo || ''
		};
		logoPreview = client.client_logo ? getImageUrl(client.client_logo) : '';
		logoFile = null;
		showModal = true;
	}

	// Close modal
	function closeModal() {
		showModal = false;
		editingClient = null;
		formData = {
			client_name: '',
			client_logo: ''
		};
		logoPreview = '';
		logoFile = null;
	}

	// Handle logo upload
	async function handleLogoUpload(event) {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
			if (!allowedTypes.includes(file.type)) {
				error = 'Tipe file tidak valid. Hanya JPEG, PNG, GIF, WebP, dan SVG yang diperbolehkan.';
				return;
			}

			// Validate file size (max 2MB)
			const maxSize = 2 * 1024 * 1024;
			if (file.size > maxSize) {
				error = 'Ukuran file terlalu besar. Maksimal 2MB.';
				return;
			}

			try {
				// Show preview immediately
				logoFile = file;
				const reader = new FileReader();
				reader.onload = (e) => {
					logoPreview = e.target.result;
				};
				reader.readAsDataURL(file);

				// Upload to server
				submitting = true;
				const uploadResult = await uploadAPI.uploadClientLogo(file);
				
				// Store the server path in form data
				formData.client_logo = uploadResult.path;
				
				submitting = false;
			} catch (err) {
				submitting = false;
				error = `Upload gagal: ${err.message}`;
				logoPreview = '';
				logoFile = null;
				formData.client_logo = '';
			}
		}
	}

	// Remove logo
	function removeLogo() {
		logoFile = null;
		logoPreview = '';
		formData.client_logo = '';
	}

	// Handle form submit
	async function handleSubmit(event) {
		event.preventDefault();
		
		if (!formData.client_name.trim()) {
			error = 'Nama client harus diisi';
			return;
		}

		submitting = true;
		error = null;

		try {
			if (editingClient) {
				await clientsAPI.update(editingClient.client_id, formData);
				successMessage = 'Client berhasil diperbarui!';
			} else {
				await clientsAPI.create(formData);
				successMessage = 'Client berhasil ditambahkan!';
			}
			
			success = true;
			await loadClients();
			
			setTimeout(() => {
				success = false;
				closeModal();
			}, 2000);
		} catch (err) {
			error = err.message;
			console.error('Failed to save client:', err);
		} finally {
			submitting = false;
		}
	}

	// Reactive statement to update filters
	$: if (searchQuery) {
		filterClients();
	}
</script>

<svelte:head>
	<title>Client Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header Section -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Client Management</h1>
				<p class="text-gray-600 mt-1">Kelola daftar client perusahaan</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<button 
					onclick={openCreateModal}
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Client
				</button>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
		<div class="flex flex-col xl:flex-row gap-4">
			<!-- Search Bar -->
			<div class="w-full">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Cari client berdasarkan nama..."
						bind:value={searchQuery}
						class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
					/>
				</div>
			</div>
			

		</div>
	</div>

	<!-- Client Table -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Daftar Client</h3>
		</div>
		
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio Count</th>
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{#if loading}
						<tr>
							<td colspan="3" class="px-6 py-12 text-center">
								<div class="flex items-center justify-center">
									<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
									<span class="ml-2 text-gray-600">Memuat client...</span>
								</div>
							</td>
						</tr>
					{:else if error}
						<tr>
							<td colspan="3" class="px-6 py-12 text-center">
								<div class="text-red-600">
									<p class="font-medium">Error memuat data:</p>
									<p class="text-sm mt-1">{error}</p>
									<button 
										onclick={loadClients}
										class="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
									>
										Coba Lagi
									</button>
								</div>
							</td>
						</tr>
					{:else}
						{#each paginatedClients as client}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-12 w-12 relative">
											<img 
												class="h-12 w-12 rounded-lg object-contain border border-gray-200 bg-white p-1" 
												src={getImageUrl(client.client_logo)} 
												alt={client.client_name}
												onerror={(e) => e.target.src = getImageUrl(null)}
											/>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900">{client.client_name}</div>
										</div>
									</div>
								</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900">
									{client.portfolio_count || 0} Portfolio
								</div>
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium">
									<div class="flex items-center justify-end gap-2">
										<button 
											onclick={() => openEditModal(client)}
											class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</button>
										{#if !client.portfolio_count || client.portfolio_count === 0}
											<button 
												onclick={() => confirmDelete(client)}
												class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
												title="Delete"
											>
												<Trash2 class="w-4 h-4" />
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		
		{#if !loading && !error && filteredClients.length === 0}
			<div class="text-center py-12">
				<Briefcase class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">
					{clients.length === 0 ? 'Tidak ada client' : 'Tidak ada client yang sesuai filter'}
				</h3>
				<p class="mt-1 text-sm text-gray-500">
					{clients.length === 0 
						? 'Mulai dengan menambahkan client pertama Anda.' 
						: 'Coba ubah filter pencarian atau reset filter.'
					}
				</p>
				<div class="mt-6">
					{#if clients.length === 0}
						<button
							onclick={openCreateModal}
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Plus class="w-4 h-4 mr-2" />
							Tambah Client
						</button>
					{:else}
						<button
							onclick={() => {
								searchQuery = '';
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

	<!-- Pagination -->
	{#if !loading && filteredClients.length > itemsPerPage}
		<div class="mt-8 flex flex-col items-center justify-center gap-4">
			<div class="flex items-center gap-2">
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
			<div class="text-sm text-gray-700">
				Menampilkan <span class="font-medium">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredClients.length)}</span> dari <span class="font-medium">{filteredClients.length}</span> client
			</div>
		</div>
	{/if}
</div>

<!-- Create/Edit Modal -->
{#if showModal}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.5);"
		onclick={(e) => e.target === e.currentTarget && closeModal()}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">{modalTitle}</h3>
				<button 
					onclick={closeModal}
					class="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Modal Body -->
			<form onsubmit={handleSubmit} class="p-6 space-y-4">
				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<p class="text-sm text-red-800">{error}</p>
					</div>
				{/if}

				{#if success}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4">
						<p class="text-sm text-green-800">{successMessage}</p>
					</div>
				{/if}

				<div>
					<label for="client_name" class="block text-sm font-medium text-gray-700 mb-2">
						Nama Client <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="client_name"
						bind:value={formData.client_name}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						placeholder="Masukkan nama client"
						disabled={submitting}
						required
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Logo Client
					</label>
					
					{#if logoPreview}
						<div class="mb-3">
							<div class="relative inline-block">
								<img 
									src={logoPreview} 
									alt="Logo preview" 
									class="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-white p-2"
								/>
								<button
									type="button"
									onclick={removeLogo}
									class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
									disabled={submitting}
								>
									<X class="w-4 h-4" />
								</button>
							</div>
						</div>
					{/if}

					<div class="flex items-center gap-3">
						<label class="cursor-pointer">
							<input
								type="file"
								accept="image/*"
								onchange={handleLogoUpload}
								class="hidden"
								disabled={submitting}
							/>
							<span class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
								<Upload class="w-4 h-4 mr-2" />
								{logoPreview ? 'Ganti Logo' : 'Upload Logo'}
							</span>
						</label>
						<span class="text-xs text-gray-500">Max 2MB (PNG, JPG, SVG)</span>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={closeModal}
						class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
						disabled={submitting}
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={submitting}
						class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if submitting}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							Menyimpan...
						{:else}
							Simpan
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && clientToDelete}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
		onclick={(e) => e.target === e.currentTarget && cancelDelete()}
		onkeydown={(e) => e.key === 'Escape' && cancelDelete()}
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
				<p class="text-gray-700 mb-3">
					Apakah Anda yakin ingin menghapus client ini?
				</p>
				<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
					<div class="flex items-center gap-3">
						{#if clientToDelete.client_logo}
							<img 
								src={getImageUrl(clientToDelete.client_logo)} 
								alt={clientToDelete.client_name}
								class="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-gray-200"
								onerror={(e) => e.target.src = getImageUrl(null)}
							/>
						{:else}
							<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
								<Briefcase class="w-6 h-6 text-gray-400" />
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<h4 class="font-medium text-gray-900 truncate">
								{clientToDelete.client_name}
							</h4>
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
						Hapus Client
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
