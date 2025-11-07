<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Plus, Search, Eye, Edit, Trash2, Image as ImageIcon, Video, FileText, Globe, Code, Play, Calendar, Filter, Grid, List, X, Loader2 } from 'lucide-svelte';
	import { multimediaAPI } from '$lib/api.js';
	
	// Data and state management
	let multimedia = [];
	let isLoading = true;
	let error = null;
	
	// Filter and search state
	let searchQuery = '';
	let selectedType = 'all'; // all, image, video, document
	let selectedStatus = 'all'; // all, active, inactive
	let sortBy = 'sort_order'; // sort_order, recent, title, type
	let viewMode = 'grid'; // grid, list
	let filteredMultimedia = multimedia;
	
	// Form state for create
	let showCreateForm = false;
	let isSubmitting = false;
	let errors = {};
	
	// New media form data
	let newMediaData = {
		media_type: 'image',
		media_title: '',
		media_description: '',
		media_url: '',
		embed_code: '',
		thumbnail_url: '',
		is_active: true,
		sort_order: 1
	};
	
	// UI State
	let showPreviewModal = false;
	let selectedMedia = null;
	let showSuccessModal = false;
	
	// Delete modal state
	let showDeleteModal = false;
	let mediaToDelete = null;
	let deleting = false;
	
	// Load multimedia data on mount
	onMount(async () => {
		await loadMultimediaData();
	});
	
	async function loadMultimediaData() {
		// Only run in browser, not during SSR
		if (!browser) return;
		
		try {
			console.log('Loading multimedia data...');
			isLoading = true;
			error = null;
			
			const data = await multimediaAPI.get();
			console.log('Received multimedia data:', data);
			
			multimedia = data || [];
			filteredMultimedia = multimedia;
		} catch (err) {
			console.error('Error loading multimedia data:', err);
			error = 'Gagal memuat data multimedia';
		} finally {
			isLoading = false;
		}
	}
	
	// Handle delete confirmation
	function confirmDelete(media) {
		mediaToDelete = media;
		showDeleteModal = true;
	}

	// Execute delete
	async function executeDelete() {
		if (!mediaToDelete) return;
		
		deleting = true;
		try {
			await multimediaAPI.delete(mediaToDelete.media_id);
			await loadMultimediaData();
			showDeleteModal = false;
			mediaToDelete = null;
			showSuccessModal = true;
		} catch (error) {
			console.error('Error deleting multimedia:', error);
			alert('Gagal menghapus media');
		} finally {
			deleting = false;
		}
	}

	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		mediaToDelete = null;
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
	function filterAndSortMultimedia() {
		let filtered = multimedia;
		console.log('Filtering multimedia - total items:', multimedia.length);
		console.log('Selected status:', selectedStatus);
		console.log('Sample multimedia items:', multimedia.slice(0, 2));
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(media => 
				media.media_title.toLowerCase().includes(query) ||
				media.media_description.toLowerCase().includes(query) ||
				media.media_type.toLowerCase().includes(query)
			);
		}
		
		// Type filter
		if (selectedType !== 'all') {
			filtered = filtered.filter(media => media.media_type === selectedType);
		}
		
		// Status filter
		if (selectedStatus !== 'all') {
			const isActive = selectedStatus === 'active';
			console.log('Filtering by status:', isActive);
			const beforeFilter = filtered.length;
			filtered = filtered.filter(media => {
				console.log(`Media ${media.media_title}: is_active = ${media.is_active} (type: ${typeof media.is_active}), comparing with ${isActive}`);
				return media.is_active === isActive;
			});
			console.log(`Status filter: ${beforeFilter} items -> ${filtered.length} items`);
		}
		
		// Sorting
		switch (sortBy) {
			case 'title':
				filtered.sort((a, b) => a.media_title.localeCompare(b.media_title));
				break;
			case 'type':
				filtered.sort((a, b) => a.media_type.localeCompare(b.media_type));
				break;
			case 'recent':
				filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				break;
			case 'sort_order':
			default:
				filtered.sort((a, b) => a.sort_order - b.sort_order);
				break;
		}
		
		filteredMultimedia = filtered;
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
	
	function getTypeIcon(type) {
		switch (type) {
			case 'image': return ImageIcon;
			case 'video': return Video;
			case 'document': return FileText;
			default: return FileText;
		}
	}
	
	function getTypeColor(type) {
		switch (type) {
			case 'image': return 'bg-green-100 text-green-800';
			case 'video': return 'bg-blue-100 text-blue-800';
			case 'document': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	// CRUD operations
	function openCreateForm() {
		newMediaData = {
			media_type: 'image',
			media_title: '',
			media_description: '',
			media_url: '',
			embed_code: '',
			thumbnail_url: '',
			is_active: true,
			sort_order: multimedia.length + 1
		};
		errors = {};
		showCreateForm = true;
	}
	
	function closeCreateForm() {
		showCreateForm = false;
		newMediaData = {
			media_type: 'image',
			media_title: '',
			media_description: '',
			media_url: '',
			embed_code: '',
			thumbnail_url: '',
			is_active: true,
			sort_order: multimedia.length + 1
		};
		errors = {};
	}
	
	function validateMediaData(data) {
		const newErrors = {};
		
		if (!data.media_title.trim()) {
			newErrors.media_title = 'Judul media wajib diisi';
		}
		
		if (!data.media_description.trim()) {
			newErrors.media_description = 'Deskripsi media wajib diisi';
		}
		
		if (data.media_type !== 'video' && !data.media_url.trim()) {
			newErrors.media_url = 'URL media wajib diisi untuk tipe selain video';
		}
		
		if (data.media_type === 'video' && !data.media_url.trim() && !data.embed_code.trim()) {
			newErrors.embed_code = 'URL media atau embed code wajib diisi untuk video';
		}
		
		if (data.media_url && !/^https?:\/\/.+/.test(data.media_url)) {
			newErrors.media_url = 'Format URL tidak valid';
		}
		
		if (data.thumbnail_url && !/^https?:\/\/.+/.test(data.thumbnail_url)) {
			newErrors.thumbnail_url = 'Format URL thumbnail tidak valid';
		}
		
		return newErrors;
	}
	
	async function handleCreateSubmit() {
		const validationErrors = validateMediaData(newMediaData);
		if (Object.keys(validationErrors).length > 0) {
			errors = validationErrors;
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			const newMedia = {
				...newMediaData,
				media_id: Math.max(...multimedia.map(m => m.media_id)) + 1,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				created_by: 1,
				updated_by: 1
			};
			
			multimedia = [...multimedia, newMedia];
			filterAndSortMultimedia();
			closeCreateForm();
			
			alert('Media berhasil ditambahkan!');
			
		} catch (error) {
			console.error('Error creating media:', error);
			alert('Terjadi kesalahan saat menambahkan media');
		} finally {
			isSubmitting = false;
		}
	}
	
	// Reactive statements
	$: if (searchQuery || selectedType || selectedStatus || sortBy) {
		filterAndSortMultimedia();
	}
	
	// Statistics
	$: stats = {
		total: multimedia.length,
		active: multimedia.filter(m => m.is_active).length,
		images: multimedia.filter(m => m.media_type === 'image').length,
		videos: multimedia.filter(m => m.media_type === 'video').length,
		documents: multimedia.filter(m => m.media_type === 'document').length
	};
	
	onMount(() => {
		filterAndSortMultimedia();
	});
</script>
<svelte:head>
	<title>Multimedia Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header Section -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Multimedia Management</h1>
				<p class="text-gray-600 mt-1">Kelola konten multimedia untuk website dan platform digital</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<button 
					onclick={() => viewMode = viewMode === 'grid' ? 'list' : 'grid'}
					class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors gap-2"
				>
					{#if viewMode === 'grid'}
						<List class="w-4 h-4" />
						List View
					{:else}
						<Grid class="w-4 h-4" />
						Grid View
					{/if}
				</button>
				<a 
					href="/dashboard/multimedia/create"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Media
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Media</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
					<Globe class="w-5 h-5 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Aktif</p>
					<p class="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
				</div>
				<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
					<Eye class="w-5 h-5 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Images</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.images}</p>
				</div>
				<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
					<ImageIcon class="w-5 h-5 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Videos</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.videos}</p>
				</div>
				<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
					<Video class="w-5 h-5 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Documents</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.documents}</p>
				</div>
				<div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
					<FileText class="w-5 h-5 text-orange-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Filters and Search (styled to match portfolio/teknologi) -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
		<div class="flex flex-col xl:flex-row gap-4">
			<!-- Search Bar -->
			<div class="flex-1 min-w-0">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Cari multimedia berdasarkan judul, deskripsi, tipe, atau kata kunci..."
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
						<option value="image">Image</option>
						<option value="video">Video</option>
						<option value="document">Document</option>
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

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex items-center justify-center min-h-64">
			<div class="text-center">
				<Loader2 class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
				<p class="text-gray-600">Memuat data multimedia...</p>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<svg class="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<p class="text-sm text-red-700 mt-1">{error}</p>
				</div>
			</div>
		</div>
		<div class="text-center">
			<button
				onclick={() => loadMultimediaData()}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Muat Ulang
			</button>
		</div>
	{:else}

	<!-- Multimedia Grid/List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">
				Media Content ({filteredMultimedia.length})
			</h3>
		</div>
		
		{#if viewMode === 'grid'}
			<!-- Grid View -->
			<div class="p-6">
				{#if filteredMultimedia.length === 0}
					<div class="text-center py-12">
						<Globe class="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p class="text-gray-500 text-lg mb-2">Tidak ada media ditemukan</p>
						<p class="text-gray-400 text-sm">Tambahkan media baru atau ubah filter pencarian</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{#each filteredMultimedia as media}
							<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<!-- Media Preview -->
								<div class="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
									{#if media.media_type === 'image' && media.thumbnail_url}
										<img 
											src={media.thumbnail_url} 
											alt={media.media_title}
											class="w-full h-full object-cover"
											loading="lazy"
										/>
									{:else if media.media_type === 'video'}
										{#if media.thumbnail_url}
											<div class="relative w-full h-full">
												<img 
													src={media.thumbnail_url} 
													alt={media.media_title}
													class="w-full h-full object-cover"
													loading="lazy"
												/>
												<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
													<Play class="w-12 h-12 text-white" />
												</div>
											</div>
										{:else}
											<div class="w-full h-full flex items-center justify-center bg-blue-50">
												<Video class="w-12 h-12 text-blue-400" />
											</div>
										{/if}
									{:else}
										<div class="w-full h-full flex items-center justify-center bg-orange-50">
											<FileText class="w-12 h-12 text-orange-400" />
										</div>
									{/if}
									
									<!-- Status Badge -->
									<div class="absolute top-2 right-2">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {media.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
											{media.is_active ? 'Aktif' : 'Tidak Aktif'}
										</span>
									</div>
									
									<!-- Sort Order -->
									<div class="absolute top-2 left-2">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
											#{media.sort_order}
										</span>
									</div>
								</div>
								
								<!-- Media Info -->
								<div class="space-y-3">
									<div>
										<h4 class="font-medium text-gray-900 truncate" title={media.media_title}>
											{media.media_title}
										</h4>
										<p class="text-sm text-gray-600 line-clamp-2">{media.media_description}</p>
									</div>
									
									<!-- Media Details -->
									<div class="space-y-2 text-sm text-gray-500">
										<div class="flex items-center justify-between">
											<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(media.media_type)}">
												<svelte:component this={getTypeIcon(media.media_type)} class="w-3 h-3 mr-1" />
												{media.media_type}
											</span>
											<span>ID: {media.media_id}</span>
										</div>
										
										<div class="flex items-center justify-between">
											<span>Dibuat</span>
											<span>{formatDate(media.created_at)}</span>
										</div>
									</div>
									
									<!-- Actions -->
									<div class="flex items-center gap-2 pt-2 border-t border-gray-200">
										{#if media.media_url}
											<a 
												href={media.media_url} 
												target="_blank"
												class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors gap-1"
											>
												<Eye class="w-4 h-4" />
												View
											</a>
										{/if}
										<a 
											href="/dashboard/multimedia/{media.media_id}/edit"
											class="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors gap-1"
										>
											<Edit class="w-4 h-4" />
											Edit
										</a>
										<button 
											onclick={() => confirmDelete(media)}
											class="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
											title="Hapus"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<!-- List View -->
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredMultimedia as media}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-12 w-12">
											{#if media.thumbnail_url}
												<img class="h-12 w-12 rounded-lg object-cover" src={media.thumbnail_url} alt={media.media_title} />
											{:else}
												<div class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
													<svelte:component this={getTypeIcon(media.media_type)} class="w-6 h-6 text-gray-400" />
												</div>
											{/if}
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900 truncate max-w-xs" title={media.media_title}>
												{media.media_title}
											</div>
											<div class="text-sm text-gray-500 truncate max-w-xs" title={media.media_description}>
												{media.media_description}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(media.media_type)}">
										<svelte:component this={getTypeIcon(media.media_type)} class="w-3 h-3 mr-1" />
										{media.media_type}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {media.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
										{media.is_active ? 'Aktif' : 'Tidak Aktif'}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									#{media.sort_order}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{formatDate(media.created_at)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div class="flex items-center gap-2">
										{#if media.media_url}
											<a 
												href={media.media_url} 
												target="_blank"
												class="text-gray-600 hover:text-gray-900"
												title="View"
											>
												<Eye class="w-4 h-4" />
											</a>
										{/if}
										<a 
											href="/dashboard/multimedia/{media.media_id}/edit"
											class="text-blue-600 hover:text-blue-900"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</a>
										<button 
											onclick={() => confirmDelete(media)}
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
				
				{#if filteredMultimedia.length === 0}
					<div class="text-center py-12">
						<Globe class="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p class="text-gray-500 text-lg mb-2">Tidak ada media ditemukan</p>
						<p class="text-gray-400 text-sm">Tambahkan media baru atau ubah filter pencarian</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
</div>

<!-- Create Media Modal -->
{#if showCreateForm}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-semibold text-gray-900">Tambah Media Baru</h3>
					<button onclick={closeCreateForm} class="text-gray-400 hover:text-gray-600">
						<X class="w-6 h-6" />
					</button>
				</div>
				
				<form onsubmit={handleCreateSubmit} class="space-y-6">
					<!-- Media Type -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Tipe Media <span class="text-red-500">*</span>
						</label>
						<select 
							bind:value={newMediaData.media_type}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						>
							<option value="image">Image</option>
							<option value="video">Video</option>
							<option value="document">Document</option>
						</select>
					</div>
					
					<!-- Media Title -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Judul Media <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={newMediaData.media_title}
							placeholder="Masukkan judul media"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.media_title}
						/>
						{#if errors.media_title}
							<p class="text-red-500 text-sm mt-1">{errors.media_title}</p>
						{/if}
					</div>
					
					<!-- Media Description -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Deskripsi <span class="text-red-500">*</span>
						</label>
						<textarea
							bind:value={newMediaData.media_description}
							rows="3"
							placeholder="Deskripsi media"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							class:border-red-500={errors.media_description}
						></textarea>
						{#if errors.media_description}
							<p class="text-red-500 text-sm mt-1">{errors.media_description}</p>
						{/if}
					</div>
					
					<!-- Media URL -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Media URL {newMediaData.media_type !== 'video' ? '*' : ''}
						</label>
						<input
							type="url"
							bind:value={newMediaData.media_url}
							placeholder="https://example.com/media-file"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.media_url}
						/>
						{#if errors.media_url}
							<p class="text-red-500 text-sm mt-1">{errors.media_url}</p>
						{/if}
					</div>
					
					<!-- Embed Code (for videos) -->
					{#if newMediaData.media_type === 'video'}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Embed Code {!newMediaData.media_url ? '*' : ''}
							</label>
							<textarea
								bind:value={newMediaData.embed_code}
								rows="4"
								placeholder="<iframe src='...' width='560' height='315'></iframe>"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
								class:border-red-500={errors.embed_code}
							></textarea>
							{#if errors.embed_code}
								<p class="text-red-500 text-sm mt-1">{errors.embed_code}</p>
							{/if}
						</div>
					{/if}
					
					<!-- Thumbnail URL -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Thumbnail URL
						</label>
						<input
							type="url"
							bind:value={newMediaData.thumbnail_url}
							placeholder="https://example.com/thumbnail.jpg"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.thumbnail_url}
						/>
						{#if errors.thumbnail_url}
							<p class="text-red-500 text-sm mt-1">{errors.thumbnail_url}</p>
						{/if}
					</div>
					
					<!-- Settings -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Urutan Tampil
							</label>
							<input
								type="number"
								bind:value={newMediaData.sort_order}
								min="1"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							/>
						</div>
						
						<div class="flex items-center">
							<label class="flex items-center cursor-pointer">
								<input
									type="checkbox"
									bind:checked={newMediaData.is_active}
									class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								/>
								<span class="ml-2 text-sm font-medium text-gray-700">Media Aktif</span>
							</label>
						</div>
					</div>
					
					<!-- Submit Buttons -->
					<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
						<button
							type="button"
							onclick={closeCreateForm}
							class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{#if isSubmitting}
								<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								Menyimpan...
							{:else}
								Simpan Media
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && mediaToDelete}
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
						Apakah Anda yakin ingin menghapus media ini?
					</p>
					<div class="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
						<div class="flex items-center gap-3">
							{#if mediaToDelete.thumbnail_url}
								<img 
									src={mediaToDelete.thumbnail_url} 
									alt={mediaToDelete.media_title}
									class="w-12 h-12 object-cover rounded-lg"
									loading="lazy"
								/>
							{:else}
								<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
									<svelte:component this={getTypeIcon(mediaToDelete.media_type)} class="w-6 h-6 text-gray-400" />
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<h4 class="font-medium text-gray-900 truncate">
									{mediaToDelete.media_title}
								</h4>
								<p class="text-sm text-gray-500 truncate">
									{mediaToDelete.media_type} • ID: {mediaToDelete.media_id}
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
								Data media dan file yang terkait akan dihapus secara permanen.
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
						Hapus Media
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Success Modal -->
{#if showSuccessModal}
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
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
					<p class="text-gray-600">Operasi multimedia berhasil dilakukan.</p>
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

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>