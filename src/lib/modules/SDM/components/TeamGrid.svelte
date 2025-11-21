<script>
	// Team Grid Component
	import { onMount } from 'svelte';
	import { sdmAPI } from '$lib/api.js';
	import TeamCard from './TeamCard.svelte';
	import SDMDetailModal from './SDMDetailModal.svelte';
	import PersonIcon from '$lib/assets/svg/People.svg';

	let selectedMember = null;
	let isModalOpen = false;
	let teamMembers = [];
	let loading = true;
	let error = null;

	// Fetch SDM data from database
	onMount(async () => {
		try {
			loading = true;
			const response = await sdmAPI.getAll();
			teamMembers = response.data || response;
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
		selectedMember = transformMember(dbMember);
		isModalOpen = true;
		console.log('Modal should open now. isModalOpen:', isModalOpen);
	}

	function closeModal() {
		console.log('Closing modal');
		isModalOpen = false;
		selectedMember = null;
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
			<p class="text-gray-500">No team members found</p>
		</div>
	{:else}
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 lg:gap-x-4 lg:gap-y-20"
		>
			{#each teamMembers as member}
				<TeamCard
					name={member.member_name}
					position={member.position}
					image={getImageUrl(member)}
					{member}
					on:click={handleMemberClick}
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal -->
<SDMDetailModal member={selectedMember} isOpen={isModalOpen} on:close={closeModal} />
