<script>
	import { ArrowRight } from 'lucide-svelte';
	import ProjectExampleImg from '$lib/assets/images/project_example.png';
	import ProjectDetailModal from './ProjectDetailModal.svelte';

	let {
		project = {
			title: 'Aplikasi Jepla Center',
			description:
				'Jepla Center WM Online, Develop Produk Gitar & Government Portal dan Sistem UMK & Inventori, Jepla Center Sistem UMK, Jepla Center Portal, Sistem Jepla Portal Pembayaran, Jepla Center - Sistem Produk Keuangan System & Pembayaran di Hasil UMK...',
			category: 'akademik',
			image: ProjectExampleImg,
			link: '#'
		}
	} = $props();

	let showModal = $state(false);

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<div
	class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm w-full h-full flex flex-col"
>
	<!-- Project Image -->
	<div class="h-48 bg-gray-200 overflow-hidden flex-shrink-0">
		<img
			src={project.image}
			alt={project.title}
			class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
		/>
	</div>

	<!-- Project Content -->
	<div class="p-6 flex flex-col flex-grow">
		<h3 class="text-lg font-semibold text-gray-900 mb-3 font-family-sans line-clamp-2">
			{project.title}
		</h3>

		<p class="text-gray-600 text-sm leading-relaxed mb-4 font-family-sans line-clamp-3 flex-grow">
			{project.description}
		</p>

		<div class="flex gap-3 mb-4">
			<div class="w-8 h-8 bg-[#D2D2D2B2] rounded-full"></div>
			<div class="w-8 h-8 bg-[#D2D2D2B2] rounded-full"></div>
			<div class="w-8 h-8 bg-[#D2D2D2B2] rounded-full"></div>
		</div>

		<!-- External Link -->
		<div class="mt-auto">
			<button
				onclick={openModal}
				class="flex items-center gap-1 text-[#176684] hover:text-[#0d4a5c] transition-colors text-sm font-medium font-family-sans underline cursor-pointer"
			>
				<span>Lihat selengkapnya</span>
				<ArrowRight class="w-4 h-4" />
			</button>
		</div>
	</div>
</div>

<!-- Project Detail Modal -->
<ProjectDetailModal isOpen={showModal} {project} onClose={closeModal} />

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
