<script>
	import { ArrowRight } from 'lucide-svelte';
	import ProjectExampleImg from '$lib/assets/images/project_example.png';

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
</script>

<div
	class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm w-full"
>
	<!-- Project Image -->
	<div class="h-48 bg-gray-200 overflow-hidden">
		<img
			src={project.image}
			alt={project.title}
			class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
		/>
	</div>

	<!-- Project Content -->
	<div class="p-6">
		<h3 class="text-lg font-semibold text-gray-900 mb-3 font-family-sans">
			{project.title}
		</h3>

		<p class="text-gray-600 text-sm leading-relaxed mb-4 font-family-sans line-clamp-4">
			{project.description}
		</p>

		<div class="flex gap-3 mb-4">
			<div class="w-8 h-8 bg-[#D2D2D2B2] rounded-full"></div>
			<div class="w-8 h-8 bg-[#D2D2D2B2] rounded-full"></div>
			<div class="w-8 h-8 bg-[#D2D2D2B2] rounded-full"></div>
		</div>

		<!-- External Link -->
		<div>
			<a
				href={project.link}
				class="flex items-center gap-1 text-[#176684] hover:text-[#0d4a5c] transition-colors text-sm font-medium font-family-sans underline"
			>
				<span>Lihat selengkapnya</span>
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</div>
</div>

<style>
	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
