<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Upload, Image as ImageIcon, Video, FileText, Download, Calendar, Filter, Grid, List, FolderOpen } from 'lucide-svelte';
	
	// Sample multimedia data
	let multimedia = [
		{
			media_id: 1,
			media_name: 'hero-homepage.jpg',
			media_type: 'image',
			media_url: '/images/hero-homepage.jpg',
			media_size: 2450000, // bytes
			media_alt_text: 'Hero image for homepage showing modern office',
			media_description: 'Professional hero image for homepage banner',
			folder_path: '/images/homepage',
			uploaded_by: 'Admin',
			upload_date: '2024-01-20',
			last_modified: '2024-01-20',
			usage_count: 5,
			is_featured: true,
			tags: ['homepage', 'hero', 'office', 'professional'],
			dimensions: { width: 1920, height: 1080 }
		},
		{
			media_id: 2,
			media_name: 'company-video.mp4',
			media_type: 'video',
			media_url: '/videos/company-video.mp4',
			media_size: 15720000,
			media_alt_text: 'Company profile video showcasing services',
			media_description: 'Corporate video highlighting our services and team',
			folder_path: '/videos/company',
			uploaded_by: 'Marketing Team',
			upload_date: '2024-01-18',
			last_modified: '2024-01-19',
			usage_count: 3,
			is_featured: false,
			tags: ['company', 'video', 'marketing', 'services'],
			duration: 180 // seconds
		},
		{
			media_id: 3,
			media_name: 'portfolio-gallery-1.jpg',
			media_type: 'image',
			media_url: '/images/portfolio/project-1.jpg',
			media_size: 890000,
			media_alt_text: 'E-commerce website project screenshot',
			media_description: 'Screenshot of completed e-commerce project',
			folder_path: '/images/portfolio',
			uploaded_by: 'Developer',
			upload_date: '2024-01-15',
			last_modified: '2024-01-15',
			usage_count: 8,
			is_featured: true,
			tags: ['portfolio', 'ecommerce', 'project', 'screenshot'],
			dimensions: { width: 1366, height: 768 }
		},
		{
			media_id: 4,
			media_name: 'team-photo.jpg',
			media_type: 'image',
			media_url: '/images/team/team-photo.jpg',
			media_size: 1200000,
			media_alt_text: 'Company team photo',
			media_description: 'Professional team photo for about page',
			folder_path: '/images/team',
			uploaded_by: 'HR',
			upload_date: '2024-01-10',
			last_modified: '2024-01-10',
			usage_count: 2,
			is_featured: false,
			tags: ['team', 'about', 'professional', 'group'],
			dimensions: { width: 1500, height: 1000 }
		},
		{
			media_id: 5,
			media_name: 'company-brochure.pdf',
			media_type: 'document',
			media_url: '/documents/company-brochure.pdf',
			media_size: 3400000,
			media_alt_text: 'Company brochure PDF',
			media_description: 'Comprehensive company brochure with services and portfolio',
			folder_path: '/documents/marketing',
			uploaded_by: 'Marketing Team',
			upload_date: '2024-01-08',
			last_modified: '2024-01-12',
			usage_count: 12,
			is_featured: true,
			tags: ['brochure', 'marketing', 'services', 'pdf'],
			pages: 16
		},
		{
			media_id: 6,
			media_name: 'technology-icons.svg',
			media_type: 'image',
			media_url: '/images/icons/technology-icons.svg',
			media_size: 45000,
			media_alt_text: 'Technology stack icons',
			media_description: 'SVG icons for technology stack display',
			folder_path: '/images/icons',
			uploaded_by: 'Designer',
			upload_date: '2024-01-05',
			last_modified: '2024-01-05',
			usage_count: 15,
			is_featured: false,
			tags: ['icons', 'technology', 'svg', 'stack'],
			dimensions: { width: 500, height: 300 }
		}
	];
	
	// Filter and search state
	let searchQuery = '';
	let selectedType = 'all'; // all, image, video, document
	let selectedFolder = 'all';
	let sortBy = 'recent'; // recent, name, size, usage
	let viewMode = 'grid'; // grid, list
	let filteredMultimedia = multimedia;
	
	// Get unique folders
	$: folders = [...new Set(multimedia.map(m => m.folder_path))].sort();
	
	// Filter and sort functions
	function filterAndSortMultimedia() {
		let filtered = multimedia;
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(media => 
				media.media_name.toLowerCase().includes(query) ||
				media.media_description.toLowerCase().includes(query) ||
				media.tags.some(tag => tag.toLowerCase().includes(query)) ||
				media.media_alt_text.toLowerCase().includes(query)
			);
		}
		
		// Type filter
		if (selectedType !== 'all') {
			filtered = filtered.filter(media => media.media_type === selectedType);
		}
		
		// Folder filter
		if (selectedFolder !== 'all') {
			filtered = filtered.filter(media => media.folder_path === selectedFolder);
		}
		
		// Sorting
		switch (sortBy) {
			case 'name':
				filtered.sort((a, b) => a.media_name.localeCompare(b.media_name));
				break;
			case 'size':
				filtered.sort((a, b) => b.media_size - a.media_size);
				break;
			case 'usage':
				filtered.sort((a, b) => b.usage_count - a.usage_count);
				break;
			case 'recent':
			default:
				filtered.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
				break;
		}
		
		filteredMultimedia = filtered;
	}
	
	// Utility functions
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
	
	function formatDuration(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
	
	function getFileIcon(type) {
		switch (type) {
			case 'image': return ImageIcon;
			case 'video': return Video;
			case 'document': return FileText;
			default: return FileText;
		}
	}
	
	function getFileTypeColor(type) {
		switch (type) {
			case 'image': return 'bg-green-100 text-green-800';
			case 'video': return 'bg-blue-100 text-blue-800';
			case 'document': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	// Handle delete
	function handleDelete(mediaId) {
		const media = multimedia.find(m => m.media_id === mediaId);
		if (media && media.usage_count > 0) {
			alert(`File "${media.media_name}" sedang digunakan di ${media.usage_count} tempat. Hapus referensi terlebih dahulu.`);
			return;
		}
		
		if (confirm(`Apakah Anda yakin ingin menghapus "${media.media_name}"?`)) {
			multimedia = multimedia.filter(m => m.media_id !== mediaId);
			filterAndSortMultimedia();
		}
	}
	
	// Toggle featured
	function toggleFeatured(mediaId) {
		multimedia = multimedia.map(m => 
			m.media_id === mediaId 
				? { ...m, is_featured: !m.is_featured, last_modified: new Date().toISOString().split('T')[0] }
				: m
		);
		filterAndSortMultimedia();
	}
	
	// Download file
	function downloadFile(media) {
		// Simulate download
		const link = document.createElement('a');
		link.href = media.media_url;
		link.download = media.media_name;
		link.click();
	}
	
	// Get stats
	$: stats = {
		total: multimedia.length,
		images: multimedia.filter(m => m.media_type === 'image').length,
		videos: multimedia.filter(m => m.media_type === 'video').length,
		documents: multimedia.filter(m => m.media_type === 'document').length,
		totalSize: multimedia.reduce((sum, m) => sum + m.media_size, 0),
		featured: multimedia.filter(m => m.is_featured).length,
		totalUsage: multimedia.reduce((sum, m) => sum + m.usage_count, 0)
	};
	
	onMount(() => {
		filterAndSortMultimedia();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || selectedType !== undefined || selectedFolder !== undefined || sortBy !== undefined) {
		filterAndSortMultimedia();
	}
</script>

<svelte:head>
	<title>Multimedia Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<!-- Header Section -->
	<div class="mb-8">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Multimedia Management</h1>
				<p class="text-gray-600 mt-1">Kelola file gambar, video, dan dokumen untuk website</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<button 
					on:click={() => viewMode = viewMode === 'grid' ? 'list' : 'grid'}
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
					href="/dashboard/multimedia/upload"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Upload class="w-4 h-4" />
					Upload Files
				</a>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Files</p>
					<p class="text-xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
					<FolderOpen class="w-5 h-5 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Images</p>
					<p class="text-xl font-bold text-gray-900 mt-1">{stats.images}</p>
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
					<p class="text-xl font-bold text-gray-900 mt-1">{stats.videos}</p>
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
					<p class="text-xl font-bold text-gray-900 mt-1">{stats.documents}</p>
				</div>
				<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
					<FileText class="w-5 h-5 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Size</p>
					<p class="text-lg font-bold text-gray-900 mt-1">{formatFileSize(stats.totalSize)}</p>
				</div>
				<div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
					<Upload class="w-5 h-5 text-yellow-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Featured</p>
					<p class="text-xl font-bold text-gray-900 mt-1">{stats.featured}</p>
				</div>
				<div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
					<Eye class="w-5 h-5 text-orange-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Usage</p>
					<p class="text-xl font-bold text-gray-900 mt-1">{stats.totalUsage}</p>
				</div>
				<div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
					<Calendar class="w-5 h-5 text-red-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Filters and Search -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
		<div class="flex flex-col lg:flex-row gap-4">
			<!-- Search -->
			<div class="flex-1">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Cari berdasarkan nama file, deskripsi, atau tags..."
						bind:value={searchQuery}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
			</div>
			
			<!-- Filters -->
			<div class="flex gap-3 flex-wrap">
				<select 
					bind:value={selectedType}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
				>
					<option value="all">All Types</option>
					<option value="image">Images</option>
					<option value="video">Videos</option>
					<option value="document">Documents</option>
				</select>
				
				<select 
					bind:value={selectedFolder}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
				>
					<option value="all">All Folders</option>
					{#each folders as folder}
						<option value={folder}>{folder}</option>
					{/each}
				</select>
				
				<select 
					bind:value={sortBy}
					class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
				>
					<option value="recent">Most Recent</option>
					<option value="name">Name A-Z</option>
					<option value="size">Largest First</option>
					<option value="usage">Most Used</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Multimedia Grid/List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">
				File Media ({filteredMultimedia.length})
			</h3>
		</div>
		
		{#if viewMode === 'grid'}
			<!-- Grid View -->
			<div class="p-6">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each filteredMultimedia as media}
						<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
							<!-- Media Preview -->
							<div class="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
								{#if media.media_type === 'image'}
									<img 
										src={media.media_url} 
										alt={media.media_alt_text}
										class="w-full h-full object-cover"
										loading="lazy"
									/>
								{:else if media.media_type === 'video'}
									<div class="w-full h-full flex items-center justify-center bg-blue-50">
										<Video class="w-12 h-12 text-blue-400" />
									</div>
								{:else}
									<div class="w-full h-full flex items-center justify-center bg-purple-50">
										<FileText class="w-12 h-12 text-purple-400" />
									</div>
								{/if}
								
								{#if media.is_featured}
									<div class="absolute top-2 right-2">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
											Featured
										</span>
									</div>
								{/if}
							</div>
							
							<!-- Media Info -->
							<div class="space-y-3">
								<div>
									<h4 class="font-medium text-gray-900 truncate" title={media.media_name}>
										{media.media_name}
									</h4>
									<p class="text-sm text-gray-600 line-clamp-2">{media.media_description}</p>
								</div>
								
								<!-- Media Details -->
								<div class="space-y-2 text-sm text-gray-500">
									<div class="flex items-center justify-between">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getFileTypeColor(media.media_type)}">
											{media.media_type}
										</span>
										<span>{formatFileSize(media.media_size)}</span>
									</div>
									
									{#if media.dimensions}
										<div class="flex items-center justify-between">
											<span>Dimensions</span>
											<span>{media.dimensions.width}×{media.dimensions.height}</span>
										</div>
									{/if}
									
									{#if media.duration}
										<div class="flex items-center justify-between">
											<span>Duration</span>
											<span>{formatDuration(media.duration)}</span>
										</div>
									{/if}
									
									{#if media.pages}
										<div class="flex items-center justify-between">
											<span>Pages</span>
											<span>{media.pages}</span>
										</div>
									{/if}
									
									<div class="flex items-center justify-between">
										<span>Usage</span>
										<span>{media.usage_count}×</span>
									</div>
									
									<div class="flex items-center justify-between">
										<span>Upload</span>
										<span>{formatDate(media.upload_date)}</span>
									</div>
								</div>
								
								<!-- Tags -->
								<div class="flex flex-wrap gap-1">
									{#each media.tags.slice(0, 3) as tag}
										<span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
											{tag}
										</span>
									{/each}
									{#if media.tags.length > 3}
										<span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
											+{media.tags.length - 3}
										</span>
									{/if}
								</div>
								
								<!-- Actions -->
								<div class="flex items-center gap-2 pt-2 border-t border-gray-100">
									<button 
										on:click={() => window.location.href = `/dashboard/multimedia/${media.media_id}`}
										class="flex-1 text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
									>
										<Eye class="w-4 h-4 inline mr-1" />
										View
									</button>
									<button 
										on:click={() => downloadFile(media)}
										class="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
										title="Download"
									>
										<Download class="w-4 h-4" />
									</button>
									<button 
										on:click={() => window.location.href = `/dashboard/multimedia/${media.media_id}/edit`}
										class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
										title="Edit"
									>
										<Edit class="w-4 h-4" />
									</button>
									<button 
										on:click={() => toggleFeatured(media.media_id)}
										class="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
										title={media.is_featured ? 'Remove from Featured' : 'Add to Featured'}
									>
										<Eye class="w-4 h-4" />
									</button>
									<button 
										on:click={() => handleDelete(media.media_id)}
										class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete"
										disabled={media.usage_count > 0}
										class:opacity-50={media.usage_count > 0}
										class:cursor-not-allowed={media.usage_count > 0}
									>
										<Trash2 class="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<!-- List View -->
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folder</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
							<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredMultimedia as media}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
											{#if media.media_type === 'image'}
												<img 
													src={media.media_url} 
													alt={media.media_alt_text}
													class="w-full h-full object-cover"
													loading="lazy"
												/>
											{:else}
												<div class="w-full h-full flex items-center justify-center">
													<svelte:component this={getFileIcon(media.media_type)} class="w-6 h-6 text-gray-400" />
												</div>
											{/if}
										</div>
										<div class="min-w-0">
											<div class="text-sm font-medium text-gray-900 truncate">
												{media.media_name}
												{#if media.is_featured}
													<span class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
														Featured
													</span>
												{/if}
											</div>
											<div class="text-sm text-gray-500 truncate">{media.media_description}</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getFileTypeColor(media.media_type)}">
										{media.media_type}
									</span>
								</td>
								<td class="px-6 py-4 text-sm text-gray-900">{formatFileSize(media.media_size)}</td>
								<td class="px-6 py-4 text-sm text-gray-500">{media.folder_path}</td>
								<td class="px-6 py-4 text-sm text-gray-900">{media.usage_count}×</td>
								<td class="px-6 py-4 text-sm text-gray-500">{formatDate(media.upload_date)}</td>
								<td class="px-6 py-4 text-right text-sm font-medium">
									<div class="flex items-center justify-end gap-2">
										<button 
											on:click={() => window.location.href = `/dashboard/multimedia/${media.media_id}`}
											class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
											title="View Details"
										>
											<Eye class="w-4 h-4" />
										</button>
										<button 
											on:click={() => downloadFile(media)}
											class="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
											title="Download"
										>
											<Download class="w-4 h-4" />
										</button>
										<button 
											on:click={() => window.location.href = `/dashboard/multimedia/${media.media_id}/edit`}
											class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</button>
										<button 
											on:click={() => handleDelete(media.media_id)}
											class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
											title="Delete"
											disabled={media.usage_count > 0}
											class:opacity-50={media.usage_count > 0}
											class:cursor-not-allowed={media.usage_count > 0}
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
		
		{#if filteredMultimedia.length === 0}
			<div class="text-center py-12">
				<Upload class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada file</h3>
				<p class="mt-1 text-sm text-gray-500">
					{searchQuery ? 'Tidak ada file yang sesuai dengan pencarian.' : 'Mulai dengan mengupload file pertama.'}
				</p>
				{#if !searchQuery}
					<div class="mt-6">
						<a 
							href="/dashboard/multimedia/upload"
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Upload class="w-4 h-4 mr-2" />
							Upload Files
						</a>
					</div>
				{/if}
			</div>
		{/if}
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