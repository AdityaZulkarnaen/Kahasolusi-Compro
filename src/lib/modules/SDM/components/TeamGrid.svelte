<script>
	// Team Grid Component
	import TeamCard from './TeamCard.svelte';

	// Data anggota tim (sesuaikan dengan data sebenarnya)
	const teamMembers = [
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' },
		{ name: 'Steve', position: 'Fullstack' }
	];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-0">
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 lg:gap-x-4 lg:gap-y-20"
	>
		{#each teamMembers as member}
			<TeamCard name={member.name} position={member.position} />
		{/each}
	</div>
</div>
