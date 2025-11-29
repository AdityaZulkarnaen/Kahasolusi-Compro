<script>
	import SDMHero from './components/SDMHero.svelte';
	import TeamGrid from './components/TeamGrid.svelte';
	import SDMCTA from './components/SDMCTA.svelte';
	import SDMDetailModal from './components/SDMDetailModal.svelte';

	let selectedMember = null;
	let isModalOpen = false;

	function handleMemberClick(event) {
		console.log('Member clicked in SDM:', event.detail);
		selectedMember = event.detail.transformedMember;
		isModalOpen = true;
		console.log('Modal should open now. isModalOpen:', isModalOpen);
	}

	function closeModal() {
		console.log('Closing modal from SDM');
		isModalOpen = false;
		selectedMember = null;
	}
</script>

<!-- SDM Page Container -->
<div class="relative bg-white">
	<!-- SDM Hero Section -->
	<SDMHero />

	<!-- Team Grid Section -->
	<section class="relative bg-white py-16 z-20">
		<TeamGrid on:memberClick={handleMemberClick} />
	</section>

	<!-- SDM CTA Section -->
	<section class="relative bg-white py-16 z-20">
		<SDMCTA />
	</section>
</div>

<!-- Modal at top level with highest z-index -->
<SDMDetailModal member={selectedMember} isOpen={isModalOpen} on:close={closeModal} />
