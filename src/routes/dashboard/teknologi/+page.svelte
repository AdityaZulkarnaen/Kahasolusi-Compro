<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, Upload, ExternalLink, Code2 } from 'lucide-svelte';
	
	// Sample data for technologies
	let technologies = [
		{
			tech_id: 1,
			tech_name: 'SvelteKit',
			tech_type: 'Frontend Framework',
			tech_description: 'Modern web framework with zero-config builds and excellent developer experience',
			icon_url: '/icons/sveltekit.svg',
			logo_url: '/logos/sveltekit.png',
			official_url: 'https://kit.svelte.dev',
			is_active: true,
			sort_order: 1,
			created_at: '2024-01-15',
			usage_count: 5
		},
		{
			tech_id: 2,
			tech_name: 'React',
			tech_type: 'Frontend Framework',
			tech_description: 'JavaScript library for building user interfaces',
			icon_url: '/icons/react.svg',
			logo_url: '/logos/react.png',
			official_url: 'https://react.dev',
			is_active: true,
			sort_order: 2,
			created_at: '2024-01-10',
			usage_count: 8
		},
		{
			tech_id: 3,
			tech_name: 'Node.js',
			tech_type: 'Backend Runtime',
			tech_description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
			icon_url: '/icons/nodejs.svg',
			logo_url: '/logos/nodejs.png',
			official_url: 'https://nodejs.org',
			is_active: true,
			sort_order: 3,
			created_at: '2024-01-05',
			usage_count: 12
		},
		{
			tech_id: 4,
			tech_name: 'PostgreSQL',
			tech_type: 'Database',
			tech_description: 'Advanced open source relational database',
			icon_url: '/icons/postgresql.svg',
			logo_url: '/logos/postgresql.png',
			official_url: 'https://postgresql.org',
			is_active: true,
			sort_order: 4,
			created_at: '2024-01-01',
			usage_count: 6
		},
		{
			tech_id: 5,
			tech_name: 'TailwindCSS',
			tech_type: 'CSS Framework',
			tech_description: 'Utility-first CSS framework for rapid UI development',
			icon_url: '/icons/tailwind.svg',
			logo_url: '/logos/tailwind.png',
			official_url: 'https://tailwindcss.com',
			is_active: true,
			sort_order: 5,
			created_at: '2023-12-20',
			usage_count: 10
		}
	];
	
	// Technology types for filtering
	let techTypes = [
		'Frontend Framework',
		'Backend Framework',
		'Backend Runtime',
		'Database',
		'CSS Framework',
		'Programming Language',
		'Mobile Framework',
		'Cloud Service',
		'DevOps Tool',
		'Design Tool'
	];
	
	let searchQuery = '';
	let selectedType = '';
	let filteredTechnologies = technologies;
	
	// Filter functions
	function filterTechnologies() {
		let filtered = technologies;
		
		// Search filter
		if (searchQuery.trim()) {
			filtered = filtered.filter(tech => 
				tech.tech_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tech.tech_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tech.tech_description.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		
		// Type filter
		if (selectedType) {
			filtered = filtered.filter(tech => tech.tech_type === selectedType);
		}
		
		// Sort by sort_order
		filtered.sort((a, b) => a.sort_order - b.sort_order);
		
		filteredTechnologies = filtered;
	}
	
	// Handle delete
	function handleDelete(techId) {
		const tech = technologies.find(t => t.tech_id === techId);
		if (tech && tech.usage_count > 0) {
			alert(`Tidak dapat menghapus ${tech.tech_name} karena sedang digunakan di ${tech.usage_count} portfolio.`);
			return;
		}
		
		if (confirm('Apakah Anda yakin ingin menghapus teknologi ini?')) {
			technologies = technologies.filter(t => t.tech_id !== techId);
			filterTechnologies();
		}
	}
	
	// Toggle active status
	function toggleActive(techId) {
		technologies = technologies.map(t => 
			t.tech_id === techId 
				? { ...t, is_active: !t.is_active }
				: t
		);
		filterTechnologies();
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	// Get stats
	$: stats = {
		total: technologies.length,
		active: technologies.filter(t => t.is_active).length,
		byType: techTypes.reduce((acc, type) => {
			acc[type] = technologies.filter(t => t.tech_type === type).length;
			return acc;
		}, {}),
		mostUsed: technologies.reduce((prev, current) => 
			(prev.usage_count > current.usage_count) ? prev : current
		)
	};
	
	onMount(() => {
		filterTechnologies();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || selectedType !== undefined) filterTechnologies();
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
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
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
					<p class="text-lg font-bold text-gray-900 mt-1">{stats.mostUsed?.tech_name || 'N/A'}</p>
					<p class="text-sm text-gray-500">{stats.mostUsed?.usage_count || 0} projects</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<Upload class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Categories</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{Object.keys(stats.byType).filter(type => stats.byType[type] > 0).length}</p>
				</div>
				<div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
					<ExternalLink class="w-6 h-6 text-yellow-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Technology Types Overview -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Overview by Type</h3>
		<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
			{#each Object.entries(stats.byType) as [type, count]}
				{#if count > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<p class="text-2xl font-bold text-gray-900">{count}</p>
						<p class="text-sm text-gray-600">{type}</p>
					</div>
				{/if}
			{/each}
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
					<select class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]">
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

	<!-- Technology Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
		{#each filteredTechnologies as tech}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
				<!-- Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
							{#if tech.icon_url}
								<img 
									src={tech.icon_url} 
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
							onclick={() => handleDelete(tech.tech_id)}
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

	<!-- Empty State -->
	{#if filteredTechnologies.length === 0}
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

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>