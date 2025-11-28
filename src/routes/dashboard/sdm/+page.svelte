<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, User, MapPin, Calendar, Award, Loader2, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { sdmAPI } from '$lib/api.js';
	
	// Data and state management
	let teamMembers = [];
	let isLoading = true;
	let error = null;
	
	// Positions for filtering
	let positions = [
		'Full Stack Developer',
		'Frontend Developer',
		'Backend Developer',
		'UI/UX Designer',
		'Project Manager',
		'DevOps Engineer',
		'QA Engineer',
		'Business Analyst'
	];
	
	let searchQuery = '';
	let selectedPosition = '';
	let sortBy = 'latest'; // latest, name, experience, projects
	let filteredMembers = [];
	
	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 9; // 3 rows x 3 columns
	let totalPages = 1;
	let paginatedMembers = [];
	
	// Modal states
	let showDeleteModal = false;
	let memberToDelete = null;
	let isDeleting = false;
	let showSuccessModal = false;
	let successMessage = '';
	
	// Load data on component mount
	onMount(async () => {
		await loadSDMData();
	});
	
	// Load SDM data from API
	async function loadSDMData() {
		try {
			isLoading = true;
			error = null;
			const response = await sdmAPI.getAll();
			teamMembers = response || [];
			filterAndSortMembers();
		} catch (err) {
			console.error('Error loading SDM data:', err);
			error = 'Gagal memuat data SDM. Silakan coba lagi.';
			teamMembers = [];
			filteredMembers = [];
		} finally {
			isLoading = false;
		}
	}
	
	// Filter and sort functions
	function filterAndSortMembers() {
		let filtered = teamMembers;
		
		// Search filter
		if (searchQuery.trim()) {
			filtered = filtered.filter(member => 
				member.member_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
				member.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
				member.specializations.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Position filter
		if (selectedPosition) {
			filtered = filtered.filter(member => member.position === selectedPosition);
		}
		
		// Sorting
		switch (sortBy) {
			case 'latest':
				filtered.sort((a, b) => {
					// Sort by created_at or member_id (descending - newest first)
					if (a.created_at && b.created_at) {
						return new Date(b.created_at) - new Date(a.created_at);
					}
					return b.member_id - a.member_id;
				});
				break;
			case 'experience':
				filtered.sort((a, b) => b.years_experience - a.years_experience);
				break;
			case 'projects':
				filtered.sort((a, b) => b.projects_count - a.projects_count);
				break;
			case 'name':
				filtered.sort((a, b) => a.member_name.localeCompare(b.member_name));
				break;
			default:
				// Default to latest
				filtered.sort((a, b) => {
					if (a.created_at && b.created_at) {
						return new Date(b.created_at) - new Date(a.created_at);
					}
					return b.member_id - a.member_id;
				});
				break;
		}
		
		filteredMembers = filtered;
		
		// Update pagination
		totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
		currentPage = Math.min(currentPage, Math.max(1, totalPages)); // Reset to valid page
		updatePaginatedMembers();
	}
	
	// Update paginated members
	function updatePaginatedMembers() {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		paginatedMembers = filteredMembers.slice(startIndex, endIndex);
	}
	
	// Pagination functions
	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			updatePaginatedMembers();
			// Scroll to top of grid
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			updatePaginatedMembers();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			updatePaginatedMembers();
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	// Handle delete - show confirmation modal
	function confirmDelete(memberId) {
		const member = teamMembers.find(m => m.member_id === memberId);
		if (!member) return;
		
		memberToDelete = member;
		showDeleteModal = true;
	}
	
	// Execute delete after confirmation
	async function executeDelete() {
		if (!memberToDelete) return;
		
		try {
			isDeleting = true;
			await sdmAPI.delete(memberToDelete.member_id);
			
			// Show success message
			successMessage = `${memberToDelete.member_name} berhasil dihapus dari tim.`;
			showSuccessModal = true;
			
			// Reload data
			await loadSDMData();
		} catch (error) {
			console.error('Error deleting SDM:', error);
			alert('Gagal menghapus anggota tim. Silakan coba lagi.');
		} finally {
			isDeleting = false;
			showDeleteModal = false;
			memberToDelete = null;
		}
	}
	
	// Cancel delete
	function cancelDelete() {
		showDeleteModal = false;
		memberToDelete = null;
	}
	
	// Close success modal
	function closeSuccessModal() {
		showSuccessModal = false;
		successMessage = '';
	}
	
	// Toggle active status
	async function toggleActive(memberId) {
		const member = teamMembers.find(m => m.member_id === memberId);
		if (!member) return;
		
		try {
			const updatedData = {
				...member,
				is_active: !member.is_active
			};
			
			await sdmAPI.update(memberId, updatedData);
			await loadSDMData(); // Reload data after update
		} catch (error) {
			console.error('Error updating SDM status:', error);
			alert('Gagal mengubah status anggota tim.');
		}
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'Asia/Jakarta'
		});
	}
	
	// Get experience badge color
	function getExperienceBadgeColor(years) {
		if (years >= 7) return 'bg-purple-100 text-purple-800';
		if (years >= 5) return 'bg-blue-100 text-blue-800';
		if (years >= 3) return 'bg-green-100 text-green-800';
		return 'bg-yellow-100 text-yellow-800';
	}
	
	// Get proper photo URL
	function getPhotoUrl(photoUrl) {
		if (!photoUrl) return null;
		// If it's already a full URL, return as is
		if (photoUrl.startsWith('http')) return photoUrl;
		
		// Get base URL from environment or default
		const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
		
		// If it starts with /uploads/, add the base URL
		if (photoUrl.startsWith('/uploads/')) {
			return `${baseUrl}${photoUrl}`;
		}
		// Otherwise, assume it's an old path and add the full uploads path
		return `${baseUrl}/uploads/sdm/${photoUrl}`;
	}
	
	// Get stats
	$: stats = {
		total: teamMembers.length,
		active: teamMembers.filter(m => m.is_active).length,
		totalExperience: teamMembers.reduce((sum, m) => sum + (m.years_experience || 0), 0),
		totalProjects: teamMembers.reduce((sum, m) => sum + (m.projects_count || 0), 0),
		avgExperience: teamMembers.length > 0 
			? Math.round(teamMembers.reduce((sum, m) => sum + (m.years_experience || 0), 0) / teamMembers.length * 10) / 10 
			: 0,
		byPosition: positions.reduce((acc, pos) => {
			acc[pos] = teamMembers.filter(m => m.position === pos).length;
			return acc;
		}, {})
	};
	
	// Remove the old onMount since we added it earlier
	// Reactive statements
	$: if (searchQuery !== undefined || selectedPosition !== undefined || sortBy !== undefined) {
		filterAndSortMembers();
	}
</script>

<svelte:head>
	<title>SDM Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Loading State -->
	{#if isLoading}
		<div class="flex items-center justify-center min-h-64">
			<div class="text-center">
				<Loader2 class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
				<p class="text-gray-600">Memuat data SDM...</p>
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
				<div class="ml-auto">
					<button
						onclick={() => loadSDMData()}
						class="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
					>
						Coba Lagi
					</button>
				</div>
			</div>
		</div>
	{:else}
	<!-- Header Section -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">SDM Management</h1>
				<p class="text-gray-600 mt-1">Kelola informasi anggota tim dan sumber daya manusia</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<a 
					href="/dashboard/sdm/create"
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Anggota Tim
				</a>
			</div>
		</div>
	</div>

	<!-- Team Overview by Position -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Team Overview by Position</h3>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			{#each Object.entries(stats.byPosition) as [position, count]}
				{#if count > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<p class="text-2xl font-bold text-gray-900">{count}</p>
						<p class="text-sm text-gray-600">{position}</p>
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Anggota</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<User class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active Members</p>
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
					<p class="text-sm font-medium text-gray-600">Avg Experience</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.avgExperience}</p>
					<p class="text-sm text-gray-500">years</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Award class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Projects</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
				</div>
				<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
					<Calendar class="w-6 h-6 text-yellow-600" />
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
						placeholder="Cari berdasarkan nama, posisi, skills, atau spesialisasi..."
						bind:value={searchQuery}
						class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
					/>
				</div>
			</div>
			
			<!-- Filter Buttons -->
			<div class="flex flex-wrap gap-2">
				<!-- Position Filter -->
				<div class="relative">
					<select 
						bind:value={selectedPosition}
						class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[180px]"
					>
						<option value="">Semua Posisi</option>
						{#each positions as position}
							<option value={position}>{position}</option>
						{/each}
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
						class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[160px]"
					>
						<option value="latest">Terbaru</option>
						<option value="name">Sort by Name</option>
						<option value="experience">Sort by Experience</option>
						<option value="projects">Sort by Projects</option>
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

	<!-- Team Members Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
		{#each paginatedMembers as member}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
				<!-- Header with Photo -->
				<div class="p-6 pb-4">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<div class="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
								{#if member.photo_url}
									<img 
										src={getPhotoUrl(member.photo_url)} 
										alt={member.member_name}
										class="w-full h-full object-cover"
										onerror={(e) => e.target.style.display = 'none'}
									/>
								{:else}
									<div class="w-full h-full flex items-center justify-center">
										<User class="w-8 h-8 text-gray-400" />
									</div>
								{/if}
							</div>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between">
								<div>
									<h3 class="font-semibold text-gray-900 truncate">{member.member_name}</h3>
									<p class="text-sm text-blue-600 font-medium">{member.position}</p>
								</div>
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{member.is_active ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Member Info (moved to top) -->
				<div class="px-6 pb-3">
					<div class="flex items-center justify-between text-sm text-gray-500">
						<span>{member.years_experience} years experience</span>
						<span>{member.projects_count} projects</span>
					</div>
				</div>
				
				<!-- Bio -->
				<div class="px-6 pb-4 flex-grow">
					<p class="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
				</div>
				
				<!-- Skills -->
				<div class="px-6 pb-4">
					<div class="flex flex-wrap gap-1">
						{#each member.skills.split(',').slice(0, 3) as skill}
							<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								{skill.trim()}
							</span>
						{/each}
						{#if member.skills.split(',').length > 3}
							<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
								+{member.skills.split(',').length - 3} more
							</span>
						{/if}
					</div>
				</div>
				
				<!-- Certifications (if any) -->
				{#if member.certifications}
					<div class="px-6 pb-4">
						<p class="text-xs text-gray-500 mb-1">Certifications:</p>
						<div class="flex flex-wrap gap-1">
							{#each member.certifications.split(',').slice(0, 2) as cert}
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									{cert.trim()}
								</span>
							{/each}
							{#if member.certifications.split(',').length > 2}
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
									+{member.certifications.split(',').length - 2} more
								</span>
							{/if}
						</div>
					</div>
				{/if}
				
				<!-- Social Links -->
				{#if member.linkedin_url || member.github_url}
					<div class="px-6 pb-4">
						<div class="flex items-center gap-3">
							{#if member.linkedin_url}
								<a 
									href={member.linkedin_url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-600 hover:text-blue-700 text-sm font-medium"
								>
									LinkedIn
								</a>
							{/if}
							{#if member.github_url}
								<a 
									href={member.github_url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-gray-600 hover:text-gray-700 text-sm font-medium"
								>
									GitHub
								</a>
							{/if}
						</div>
					</div>
				{/if}
				
				<!-- Actions -->
				<div class="px-6 py-4 border-t border-gray-200 mt-auto">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<button 
								onclick={() => window.location.href = `/dashboard/sdm/${member.member_id}/edit`}
								class="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
								title="Edit"
							>
								<Edit class="w-4 h-4" />
							</button>
						</div>
						<div class="flex items-center gap-2">
							<button 
								onclick={() => toggleActive(member.member_id)}
								class="text-sm px-3 py-1 rounded-md border {member.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'} transition-colors"
							>
								{member.is_active ? 'Deactivate' : 'Activate'}
							</button>
							<button 
								onclick={() => confirmDelete(member.member_id)}
								class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
								title="Delete"
								disabled={member.projects_count > 0}
								class:opacity-50={member.projects_count > 0}
								class:cursor-not-allowed={member.projects_count > 0}
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Pagination Controls -->
	{#if !isLoading && filteredMembers.length > itemsPerPage}
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
			Menampilkan {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredMembers.length)} dari {filteredMembers.length} anggota tim
		</div>
	{/if}

	<!-- Empty State -->
	{#if paginatedMembers.length === 0}
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
			<div class="text-center">
				<User class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada anggota tim</h3>
				<p class="mt-1 text-sm text-gray-500">
					{searchQuery || selectedPosition ? 'Tidak ada anggota yang sesuai dengan filter.' : 'Mulai dengan menambahkan anggota tim pertama.'}
				</p>
				{#if !searchQuery && !selectedPosition}
					<div class="mt-6">
						<a 
							href="/dashboard/sdm/create"
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Plus class="w-4 h-4 mr-2" />
							Tambah Anggota Tim
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && memberToDelete}
	<div 
		class="fixed inset-0 flex items-center justify-center p-4 z-50"
		style="background-color: rgba(0, 0, 0, 0.3);"
	>
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto">
			<div class="p-6">
				<!-- Header -->
				<div class="flex items-center gap-4 mb-4">
					<div class="flex-shrink-0">
						<div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
							<Trash2 class="w-6 h-6 text-red-600" />
						</div>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-900">Hapus Anggota Tim</h3>
						<p class="text-sm text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
					</div>
				</div>
				
				<!-- Member Info -->
				<div class="bg-gray-50 rounded-lg p-4 mb-6">
					<div class="flex items-center gap-3">
						{#if memberToDelete.photo_url}
							<img 
								src={getPhotoUrl(memberToDelete.photo_url)} 
								alt={memberToDelete.member_name}
								class="w-12 h-12 rounded-lg object-cover"
							/>
						{:else}
							<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
								<User class="w-6 h-6 text-gray-400" />
							</div>
						{/if}
						<div>
							<p class="font-medium text-gray-900">{memberToDelete.member_name}</p>
							<p class="text-sm text-gray-600">{memberToDelete.position}</p>
						</div>
					</div>
				</div>
				
				<!-- Warning Message -->
				<div class="mb-6">
					<p class="text-gray-700">
						Apakah Anda yakin ingin menghapus <strong>{memberToDelete.member_name}</strong> dari tim? 
						Data anggota tim ini akan dihapus secara permanen dan tidak dapat dikembalikan.
					</p>
				</div>
				
				<!-- Action Buttons -->
				<div class="flex gap-3">
					<button
						onclick={cancelDelete}
						class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						disabled={isDeleting}
					>
						Batal
					</button>
					<button
						onclick={executeDelete}
						disabled={isDeleting}
						class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if isDeleting}
							<Loader2 class="w-4 h-4 animate-spin" />
							Menghapus...
						{:else}
							<Trash2 class="w-4 h-4" />
							Hapus
						{/if}
					</button>
				</div>
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
					<p class="text-gray-600">{successMessage}</p>
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
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>