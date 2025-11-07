<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Phone, Mail, MessageSquare, Edit, Trash2, Plus, Eye, ToggleLeft, ToggleRight, ExternalLink, Search, Calendar, Tag, Globe, Loader2, X } from 'lucide-svelte';
	import { contactCTAAPI } from '$lib/api.js';
	
	// Data and state management
	let contactCTAs = [];
	let isLoading = true;
	let error = null;
	
	// Filter and search state
	let searchQuery = '';
	let selectedType = 'all'; // all, WhatsApp, Email, Phone, Form
	let selectedStatus = 'all'; // all, active, inactive
	let sortBy = 'sort_order'; // sort_order, recent, title, type
	let filteredCTAs = contactCTAs;
	
	// UI State
	let showSuccessModal = false;
	
	// Delete modal state
	let showDeleteModal = false;
	let ctaToDelete = null;
	let deleting = false;
	
	// Load contact CTAs data on mount
	onMount(async () => {
		await loadContactCTAData();
	});
	
	async function loadContactCTAData() {
		// Only run in browser, not during SSR
		if (!browser) return;
		
		try {
			isLoading = true;
			error = null;
			
			const data = await contactCTAAPI.get();
			contactCTAs = data || [];
		} catch (err) {
			console.error('Error loading contact CTA data:', err);
			error = 'Gagal memuat data contact CTA';
		} finally {
			isLoading = false;
		}
	}
	
	// Handle delete confirmation
	function confirmDelete(cta) {
		ctaToDelete = cta;
		showDeleteModal = true;
	}

	// Execute delete
	async function executeDelete() {
		if (!ctaToDelete) return;
		
		deleting = true;
		try {
			await contactCTAAPI.delete(ctaToDelete.cta_id);
			await loadContactCTAData();
			showDeleteModal = false;
			ctaToDelete = null;
			showSuccessModal = true;
		} catch (error) {
			console.error('Error deleting contact CTA:', error);
			alert('Gagal menghapus contact CTA');
		} finally {
			deleting = false;
		}
	}

	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		ctaToDelete = null;
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

	// Close success modal
	function closeSuccessModal() {
		showSuccessModal = false;
	}

	// Filter and sort functions
	function filterAndSortCTAs() {
		let filtered = contactCTAs;
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(cta => 
				cta.cta_title.toLowerCase().includes(query) ||
				cta.cta_description.toLowerCase().includes(query) ||
				cta.cta_type.toLowerCase().includes(query) ||
				(cta.contact && cta.contact.toLowerCase().includes(query))
			);
		}
		
		// Type filter
		if (selectedType !== 'all') {
			filtered = filtered.filter(cta => cta.cta_type === selectedType);
		}
		
		// Status filter
		if (selectedStatus !== 'all') {
			const isActive = selectedStatus === 'active';
			filtered = filtered.filter(cta => cta.is_active === isActive);
		}
		
		// Sorting
		switch (sortBy) {
			case 'title':
				filtered.sort((a, b) => a.cta_title.localeCompare(b.cta_title));
				break;
			case 'type':
				filtered.sort((a, b) => a.cta_type.localeCompare(b.cta_type));
				break;
			case 'recent':
				filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				break;
			case 'sort_order':
			default:
				filtered.sort((a, b) => a.sort_order - b.sort_order);
				break;
		}
		
		filteredCTAs = filtered;
	}
	
	// Utility functions
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		});
	}
	
	function getTypeColor(type) {
		switch (type) {
			case 'WhatsApp': return 'bg-green-100 text-green-800';
			case 'Email': return 'bg-blue-100 text-blue-800';
			case 'Phone': return 'bg-purple-100 text-purple-800';
			case 'Form': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	function getTypeIcon(type) {
		switch (type) {
			case 'WhatsApp': return MessageSquare;
			case 'Email': return Mail;
			case 'Phone': return Phone;
			case 'Form': return ExternalLink;
			default: return ExternalLink;
		}
	}
	
	// Reactive statements
	$: if (searchQuery || selectedType || selectedStatus || sortBy || contactCTAs) {
		filterAndSortCTAs();
	}
	
	// Statistics
	$: stats = {
		total: contactCTAs.length,
		active: contactCTAs.filter(c => c.is_active).length,
		whatsapp: contactCTAs.filter(c => c.cta_type === 'WhatsApp').length,
		email: contactCTAs.filter(c => c.cta_type === 'Email').length,
		phone: contactCTAs.filter(c => c.cta_type === 'Phone').length,
		form: contactCTAs.filter(c => c.cta_type === 'Form').length
	};
	
	onMount(() => {
		filterAndSortCTAs();
	});
</script>

<svelte:head>
	<title>Contact CTA Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Contact CTA Management</h1>
				<p class="text-gray-600 mt-1">Kelola kontak dan call-to-action untuk komunikasi dengan klien</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<a 
					href="/dashboard/contact-cta/create"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Contact CTA
				</a>
			</div>
		</div>
	</div>

	{#if isLoading}
		<!-- Loading State -->
		<div class="flex items-center justify-center min-h-[400px]">
			<div class="text-center">
				<Loader2 class="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
				<p class="text-gray-600 text-lg font-medium">Memuat contact CTA...</p>
				<p class="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
			<div class="flex flex-col items-center">
				<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
					<X class="w-8 h-8 text-red-600" />
				</div>
				<h3 class="text-lg font-semibold text-red-900 mb-2">Gagal Memuat Data</h3>
				<p class="text-red-700 mb-4 max-w-md">{error}</p>
				<button
					onclick={loadContactCTAs}
					class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
				>
					Coba Lagi
				</button>
			</div>
		</div>
	{:else}
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Contact</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
					</div>
					<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
						<ExternalLink class="w-6 h-6 text-blue-600" />
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
						<p class="text-sm font-medium text-gray-600">WhatsApp</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{stats.whatsapp}</p>
					</div>
					<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
						<MessageSquare class="w-6 h-6 text-green-600" />
					</div>
				</div>
			</div>
			
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Email</p>
						<p class="text-2xl font-bold text-gray-900 mt-1">{stats.email}</p>
					</div>
					<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
						<Mail class="w-6 h-6 text-blue-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Filters and Search (styled to match portfolio/teknologi/multimedia) -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
			<div class="flex flex-col xl:flex-row gap-4">
				<!-- Search Bar -->
				<div class="flex-1 min-w-0">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Cari contact CTA berdasarkan judul, tipe, kontak, atau deskripsi..."
							bind:value={searchQuery}
							class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
						/>
					</div>
				</div>

				<!-- Filters -->
				<div class="flex flex-wrap gap-2 items-center">
					<!-- Type Filter -->
					<div class="relative">
						<select 
							bind:value={selectedType}
							class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[160px]"
						>
							<option value="all">Semua Tipe</option>
							<option value="WhatsApp">WhatsApp</option>
							<option value="Email">Email</option>
							<option value="Phone">Phone</option>
							<option value="Form">Form</option>
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
							<option value="all">Semua Status</option>
							<option value="active">Aktif</option>
							<option value="inactive">Tidak Aktif</option>
						</select>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>

					<!-- Sort Filter -->
					<div class="relative">
						<select 
							bind:value={sortBy}
							class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
						>
							<option value="sort_order">Urutan</option>
							<option value="recent">Terbaru</option>
							<option value="title">Judul A-Z</option>
							<option value="type">Tipe</option>
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

		<!-- Contact CTA List -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			<div class="px-6 py-4 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">
					Contact CTAs ({filteredCTAs.length})
				</h3>
			</div>
			
			{#if filteredCTAs.length === 0}
				<div class="text-center py-12">
					<ExternalLink class="w-16 h-16 text-gray-400 mx-auto mb-4" />
					<p class="text-gray-500 text-lg mb-2">Tidak ada contact CTA ditemukan</p>
					<p class="text-gray-400 text-sm">Tambahkan contact CTA baru atau ubah filter pencarian</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							{#each filteredCTAs as cta}
								<tr class="hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="flex items-center">
											<div class="flex-shrink-0 h-10 w-10">
												<div class="h-10 w-10 rounded-lg {getTypeColor(cta.cta_type)} flex items-center justify-center">
													<svelte:component this={getTypeIcon(cta.cta_type)} class="w-5 h-5" />
												</div>
											</div>
											<div class="ml-4">
												<div class="text-sm font-medium text-gray-900">{cta.cta_title}</div>
												<div class="text-sm text-gray-500">{cta.contact}</div>
												<div class="text-sm text-gray-500 truncate max-w-xs" title={cta.cta_description}>
													{cta.cta_description}
												</div>
											</div>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(cta.cta_type)}">
											<svelte:component this={getTypeIcon(cta.cta_type)} class="w-3 h-3 mr-1" />
											{cta.cta_type}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<div class="text-sm text-gray-900">
											<a 
												href={cta.cta_url} 
												target="_blank"
												class="text-blue-600 hover:text-blue-900 truncate max-w-xs inline-block"
												title={cta.cta_url}
											>
												{cta.cta_url}
											</a>
										</div>
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {cta.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
											{cta.is_active ? 'Aktif' : 'Tidak Aktif'}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(cta.created_at)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div class="flex items-center gap-2">
											<a 
												href={cta.cta_url} 
												target="_blank"
												class="text-gray-600 hover:text-gray-900"
												title="Open URL"
											>
												<ExternalLink class="w-4 h-4" />
											</a>

											<a 
												href="/dashboard/contact-cta/{cta.cta_id}/edit"
												class="text-blue-600 hover:text-blue-900"
												title="Edit"
											>
												<Edit class="w-4 h-4" />
											</a>

											<button 
												onclick={() => confirmDelete(cta)}
												class="text-red-600 hover:text-red-900"
												title="Hapus"
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
			{/if}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && ctaToDelete}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
		onclick={handleModalClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
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
						<h3 id="modal-title" class="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
						<p class="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
					</div>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="p-6">
				<div class="mb-4">
					<p class="text-gray-700 mb-3">
						Apakah Anda yakin ingin menghapus contact CTA ini?
					</p>
					<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
						<div class="flex items-center gap-3">
							<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
								<svelte:component this={getTypeIcon(ctaToDelete.cta_type)} class="w-6 h-6 text-gray-400" />
							</div>
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-gray-900 truncate">
									{ctaToDelete.cta_title}
								</h4>
								<p class="text-sm text-gray-500 truncate">
									{ctaToDelete.cta_type} • {ctaToDelete.contact}
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
								Data contact CTA ini akan dihapus secara permanen.
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
						Hapus Contact CTA
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Success Modal -->
{#if showSuccessModal}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
		role="dialog"
		aria-modal="true" 
		tabindex="-1"
	>
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto">
			<div class="p-6">
				<!-- Success Icon -->
				<div class="flex justify-center mb-4">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>
				
				<!-- Success Message -->
				<div class="text-center mb-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Berhasil!</h3>
					<p class="text-gray-600">Operasi contact CTA berhasil dilakukan.</p>
				</div>
				
				<!-- Close Button -->
				<div class="flex justify-center">
					<button
						onclick={closeSuccessModal}
						class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

