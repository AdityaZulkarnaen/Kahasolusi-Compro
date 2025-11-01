<script>
	import { onMount } from 'svelte';
	import { Plus, Search, Eye, Edit, Trash2, User, MapPin, Calendar, Award } from 'lucide-svelte';
	
	// Sample data for team members
	let teamMembers = [
		{
			member_id: 1,
			member_name: 'Ahmad Rizki Pratama',
			position: 'Full Stack Developer',
			bio: 'Experienced developer with 5+ years in web development. Passionate about creating scalable applications and mentoring junior developers.',
			photo_url: '/team/ahmad.jpg',
			skills: 'JavaScript, React, Node.js, PostgreSQL, Docker',
			certifications: 'AWS Certified Solutions Architect, MongoDB Certified Developer',
			specializations: 'Frontend Development, API Development, Database Design',
			years_experience: 5,
			linkedin_url: 'https://linkedin.com/in/ahmad-rizki',
			github_url: 'https://github.com/ahmadrizki',
			is_active: true,
			sort_order: 1,
			created_at: '2024-01-15',
			projects_count: 12
		},
		{
			member_id: 2,
			member_name: 'Sarah Maharani',
			position: 'UI/UX Designer',
			bio: 'Creative designer focused on user-centered design principles. Experienced in creating intuitive and beautiful digital experiences.',
			photo_url: '/team/sarah.jpg',
			skills: 'Figma, Adobe XD, Sketch, Prototyping, User Research',
			certifications: 'Google UX Design Certificate, Adobe Certified Expert',
			specializations: 'Mobile App Design, Web Design, Design Systems',
			years_experience: 4,
			linkedin_url: 'https://linkedin.com/in/sarah-maharani',
			github_url: '',
			is_active: true,
			sort_order: 2,
			created_at: '2024-01-10',
			projects_count: 8
		},
		{
			member_id: 3,
			member_name: 'Budi Santoso',
			position: 'Backend Developer',
			bio: 'Specialized in building robust backend systems and APIs. Strong background in system architecture and performance optimization.',
			photo_url: '/team/budi.jpg',
			skills: 'Python, Django, FastAPI, Redis, Kubernetes',
			certifications: 'Docker Certified Associate, Kubernetes Application Developer',
			specializations: 'Microservices, API Development, DevOps',
			years_experience: 6,
			linkedin_url: 'https://linkedin.com/in/budi-santoso',
			github_url: 'https://github.com/budisantoso',
			is_active: true,
			sort_order: 3,
			created_at: '2024-01-05',
			projects_count: 15
		},
		{
			member_id: 4,
			member_name: 'Lisa Permata',
			position: 'Project Manager',
			bio: 'Experienced project manager with strong leadership skills. Specializes in agile methodologies and team coordination.',
			photo_url: '/team/lisa.jpg',
			skills: 'Project Management, Scrum, Agile, JIRA, Slack',
			certifications: 'PMP Certified, Scrum Master Certified',
			specializations: 'Agile Project Management, Team Leadership, Client Relations',
			years_experience: 7,
			linkedin_url: 'https://linkedin.com/in/lisa-permata',
			github_url: '',
			is_active: true,
			sort_order: 4,
			created_at: '2023-12-20',
			projects_count: 20
		}
	];
	
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
	let sortBy = 'name'; // name, experience, projects
	let filteredMembers = teamMembers;
	
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
			case 'experience':
				filtered.sort((a, b) => b.years_experience - a.years_experience);
				break;
			case 'projects':
				filtered.sort((a, b) => b.projects_count - a.projects_count);
				break;
			case 'name':
			default:
				filtered.sort((a, b) => a.member_name.localeCompare(b.member_name));
				break;
		}
		
		filteredMembers = filtered;
	}
	
	// Handle delete
	function handleDelete(memberId) {
		const member = teamMembers.find(m => m.member_id === memberId);
		if (member && member.projects_count > 0) {
			alert(`Tidak dapat menghapus ${member.member_name} karena sedang terlibat dalam ${member.projects_count} project.`);
			return;
		}
		
		if (confirm('Apakah Anda yakin ingin menghapus anggota tim ini?')) {
			teamMembers = teamMembers.filter(m => m.member_id !== memberId);
			filterAndSortMembers();
		}
	}
	
	// Toggle active status
	function toggleActive(memberId) {
		teamMembers = teamMembers.map(m => 
			m.member_id === memberId 
				? { ...m, is_active: !m.is_active }
				: m
		);
		filterAndSortMembers();
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	// Get experience badge color
	function getExperienceBadgeColor(years) {
		if (years >= 7) return 'bg-purple-100 text-purple-800';
		if (years >= 5) return 'bg-blue-100 text-blue-800';
		if (years >= 3) return 'bg-green-100 text-green-800';
		return 'bg-yellow-100 text-yellow-800';
	}
	
	// Get stats
	$: stats = {
		total: teamMembers.length,
		active: teamMembers.filter(m => m.is_active).length,
		totalExperience: teamMembers.reduce((sum, m) => sum + m.years_experience, 0),
		totalProjects: teamMembers.reduce((sum, m) => sum + m.projects_count, 0),
		avgExperience: Math.round(teamMembers.reduce((sum, m) => sum + m.years_experience, 0) / teamMembers.length * 10) / 10,
		byPosition: positions.reduce((acc, pos) => {
			acc[pos] = teamMembers.filter(m => m.position === pos).length;
			return acc;
		}, {})
	};
	
	onMount(() => {
		filterAndSortMembers();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || selectedPosition !== undefined || sortBy !== undefined) {
		filterAndSortMembers();
	}
</script>

<svelte:head>
	<title>SDM Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
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
		{#each filteredMembers as member}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
				<!-- Header with Photo -->
				<div class="p-6 pb-4">
					<div class="flex items-start gap-4">
						<div class="flex-shrink-0">
							<div class="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
								{#if member.photo_url}
									<img 
										src={member.photo_url} 
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
								onclick={() => window.location.href = `/dashboard/sdm/${member.member_id}`}
								class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
								title="View Details"
							>
								<Eye class="w-4 h-4" />
							</button>
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
								onclick={() => handleDelete(member.member_id)}
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

	<!-- Empty State -->
	{#if filteredMembers.length === 0}
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
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>