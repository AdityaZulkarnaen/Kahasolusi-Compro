<script>
	// Team Grid Component
	import { onMount, createEventDispatcher } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { sdmAPI } from '$lib/api.js';
	import TeamCard from './TeamCard.svelte';
	import PersonIcon from '$lib/assets/svg/People.svg';

	const dispatch = createEventDispatcher();

	let teamMembers = [];
	let loading = true;
	let error = null;
	
	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 6; // 2 rows x 3 columns
	$: totalPages = Math.ceil(teamMembers.length / itemsPerPage);
	$: paginatedMembers = teamMembers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	
	function goToPage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			// Scroll to top of team grid
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
	
	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// Fetch SDM data from database
	onMount(async () => {
		try {
			loading = true;
			const response = await sdmAPI.getAll();
			const allMembers = response.data || response;
			
			// Filter only active members (is_active = 1 or true)
			teamMembers = allMembers.filter(member => member.is_active === 1 || member.is_active === true);
			
			console.log(`Total members: ${allMembers.length}, Active members: ${teamMembers.length}`);
			error = null;
		} catch (err) {
			console.error('Failed to fetch SDM data:', err);
			error = 'Failed to load team members';
		} finally {
			loading = false;
		}
	});

	// Get image URL with fallback to default
	function getImageUrl(member) {
		const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
		if (member.photo_url && member.photo_url.trim() !== '') {
			// Check if it's already a full URL
			if (member.photo_url.startsWith('http')) {
				return member.photo_url;
			}
			// Otherwise, construct the full URL
			return `${baseUrl}${member.photo_url}`;
		}
		return PersonIcon;
	}

	// Handle image error - fallback to default
	function handleImageError(event) {
		event.target.src = PersonIcon;
	}

	// Parse JSON fields
	function parseJsonField(field) {
		if (!field) return [];
		if (typeof field === 'string') {
			try {
				return JSON.parse(field);
			} catch {
				return [];
			}
		}
		return field;
	}

	// Transform database member to component format
	function transformMember(dbMember) {
		return {
			...dbMember,
			name: dbMember.member_name,
			image: getImageUrl(dbMember),
			experience: dbMember.bio,
			certifications: parseJsonField(dbMember.certifications),
			specializations: parseJsonField(dbMember.specializations),
			github: dbMember.github_url,
			linkedin: dbMember.linkedin_url
		};
	}

	function handleMemberClick(event) {
		console.log('Member clicked in TeamGrid:', event.detail);
		const dbMember = event.detail;
		const transformedMember = transformMember(dbMember);
		
		// Dispatch event to parent component
		dispatch('memberClick', { transformedMember });
	}

</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-0">
	{#if loading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-red-500">{error}</p>
		</div>
	{:else if teamMembers.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500">Tidak ada anggota tim yang aktif saat ini</p>
		</div>
	{:else}
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 lg:gap-x-4 lg:gap-y-20"
		>
			{#each paginatedMembers as member}
				<TeamCard
					name={member.member_name}
					position={member.position}
					image={getImageUrl(member)}
					{member}
					on:click={handleMemberClick}
				/>
			{/each}
		</div>
		
		<!-- Pagination Controls -->
		{#if totalPages > 1}
			<div class="flex justify-center items-center gap-2 mt-12">
				<!-- Previous Button -->
				<button
					on:click={prevPage}
					disabled={currentPage === 1}
					class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
				>
					<ChevronLeft class="w-5 h-5" />
				</button>
				
				<!-- Page Numbers -->
				{#each Array(totalPages) as _, index}
					{@const pageNumber = index + 1}
					<button
						on:click={() => goToPage(pageNumber)}
						class="flex items-center justify-center w-10 h-10 rounded-lg font-medium font-family-sans transition-all duration-200
							   {currentPage === pageNumber 
								 ? 'bg-[#0D4E6D] text-white' 
								 : 'border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white'}"
					>
						{pageNumber}
					</button>
				{/each}
				
				<!-- Next Button -->
				<button
					on:click={nextPage}
					disabled={currentPage === totalPages}
					class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
				>
					<ChevronRight class="w-5 h-5" />
				</button>
			</div>
		{/if}
	{/if}
</div>
