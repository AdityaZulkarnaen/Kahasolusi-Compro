<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { 
		ArrowLeft, 
		Save, 
		Upload, 
		X, 
		Plus, 
		Calendar,
		Link as LinkIcon,
		Image as ImageIcon
	} from 'lucide-svelte';
	
	// Form data
	let formData = {
		project_name: '',
		project_description: '',
		case_study: '',
		client_name: '',
		project_start_date: '',
		project_end_date: '',
		project_url: '',
		image_url: '',
		is_featured: false,
		is_active: true,
		categories: [],
		technologies: []
	};
	
	// Available options (nanti dari API)
	let availableCategories = [
		{ category_id: 1, category_name: 'Web Development', category_slug: 'web-development' },
		{ category_id: 2, category_name: 'Mobile Development', category_slug: 'mobile-development' },
		{ category_id: 3, category_name: 'E-Commerce', category_slug: 'e-commerce' },
		{ category_id: 4, category_name: 'UI/UX Design', category_slug: 'ui-ux-design' },
		{ category_id: 5, category_name: 'System Integration', category_slug: 'system-integration' }
	];
	
	let availableTechnologies = [
		{ tech_id: 1, tech_name: 'SvelteKit', tech_type: 'Frontend Framework' },
		{ tech_id: 2, tech_name: 'React', tech_type: 'Frontend Framework' },
		{ tech_id: 3, tech_name: 'Vue.js', tech_type: 'Frontend Framework' },
		{ tech_id: 4, tech_name: 'Node.js', tech_type: 'Backend Runtime' },
		{ tech_id: 5, tech_name: 'Express.js', tech_type: 'Backend Framework' },
		{ tech_id: 6, tech_name: 'PostgreSQL', tech_type: 'Database' },
		{ tech_id: 7, tech_name: 'MongoDB', tech_type: 'Database' },
		{ tech_id: 8, tech_name: 'TailwindCSS', tech_type: 'CSS Framework' },
		{ tech_id: 9, tech_name: 'TypeScript', tech_type: 'Programming Language' },
		{ tech_id: 10, tech_name: 'React Native', tech_type: 'Mobile Framework' }
	];
	
	// Form state
	let isSubmitting = false;
	let errors = {};
	let imageFile = null;
	let imagePreview = '';
	
	// Category and Technology selection
	let selectedCategories = [];
	let selectedTechnologies = [];
	let newTechnology = '';
	let showTechInput = false;
	
	// Validation
	function validateForm() {
		errors = {};
		
		if (!formData.project_name.trim()) {
			errors.project_name = 'Nama project wajib diisi';
		}
		
		if (!formData.project_description.trim()) {
			errors.project_description = 'Deskripsi project wajib diisi';
		}
		
		if (!formData.client_name.trim()) {
			errors.client_name = 'Nama client wajib diisi';
		}
		
		if (!formData.project_start_date) {
			errors.project_start_date = 'Tanggal mulai wajib diisi';
		}
		
		if (!formData.project_end_date) {
			errors.project_end_date = 'Tanggal selesai wajib diisi';
		}
		
		if (formData.project_start_date && formData.project_end_date) {
			if (new Date(formData.project_start_date) >= new Date(formData.project_end_date)) {
				errors.project_end_date = 'Tanggal selesai harus setelah tanggal mulai';
			}
		}
		
		if (formData.project_url && !isValidUrl(formData.project_url)) {
			errors.project_url = 'URL project tidak valid';
		}
		
		if (selectedCategories.length === 0) {
			errors.categories = 'Minimal pilih satu kategori';
		}
		
		if (selectedTechnologies.length === 0) {
			errors.technologies = 'Minimal pilih satu teknologi';
		}
		
		return Object.keys(errors).length === 0;
	}
	
	function isValidUrl(string) {
		try {
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	}
	
	// Handle image upload
	function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file) {
			imageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
				formData.image_url = e.target.result; // Temporary preview
			};
			reader.readAsDataURL(file);
		}
	}
	
	// Category management
	function toggleCategory(categoryId) {
		if (selectedCategories.includes(categoryId)) {
			selectedCategories = selectedCategories.filter(id => id !== categoryId);
		} else {
			selectedCategories = [...selectedCategories, categoryId];
		}
		formData.categories = selectedCategories;
	}
	
	// Technology management
	function toggleTechnology(techId) {
		if (selectedTechnologies.includes(techId)) {
			selectedTechnologies = selectedTechnologies.filter(id => id !== techId);
		} else {
			selectedTechnologies = [...selectedTechnologies, techId];
		}
		formData.technologies = selectedTechnologies;
	}
	
	function addNewTechnology() {
		if (newTechnology.trim()) {
			// In real app, this would create a new technology via API
			const newTech = {
				tech_id: Date.now(),
				tech_name: newTechnology.trim(),
				tech_type: 'Custom'
			};
			availableTechnologies = [...availableTechnologies, newTech];
			selectedTechnologies = [...selectedTechnologies, newTech.tech_id];
			formData.technologies = selectedTechnologies;
			newTechnology = '';
			showTechInput = false;
		}
	}
	
	// Form submission
	async function handleSubmit() {
		if (!validateForm()) {
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// In real app, this would send data to API
			console.log('Portfolio data:', {
				...formData,
				categories: selectedCategories,
				technologies: selectedTechnologies,
				imageFile
			});
			
			// Redirect to portfolio list
			goto('/dashboard/portfolio');
		} catch (error) {
			console.error('Error saving portfolio:', error);
			// Handle error
		} finally {
			isSubmitting = false;
		}
	}
	
	// Get category name by ID
	function getCategoryName(categoryId) {
		const category = availableCategories.find(c => c.category_id === categoryId);
		return category ? category.category_name : '';
	}
	
	// Get technology name by ID
	function getTechnologyName(techId) {
		const tech = availableTechnologies.find(t => t.tech_id === techId);
		return tech ? tech.tech_name : '';
	}
</script>

<svelte:head>
	<title>Tambah Portfolio - Dashboard Kahasolusi</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto p-6">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<button 
					on:click={() => goto('/dashboard/portfolio')}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<ArrowLeft class="w-5 h-5 text-gray-600" />
				</button>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Tambah Portfolio Baru</h1>
					<p class="text-gray-600 mt-1">Tambahkan project baru ke dalam portfolio perusahaan</p>
				</div>
			</div>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="space-y-8">
			<!-- Basic Information -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="md:col-span-2">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Nama Project <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={formData.project_name}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							placeholder="Masukkan nama project"
							class:border-red-500={errors.project_name}
						/>
						{#if errors.project_name}
							<p class="text-red-500 text-sm mt-1">{errors.project_name}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Nama Client <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={formData.client_name}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							placeholder="Masukkan nama client"
							class:border-red-500={errors.client_name}
						/>
						{#if errors.client_name}
							<p class="text-red-500 text-sm mt-1">{errors.client_name}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							URL Project
						</label>
						<div class="relative">
							<LinkIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="url"
								bind:value={formData.project_url}
								class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="https://example.com"
								class:border-red-500={errors.project_url}
							/>
						</div>
						{#if errors.project_url}
							<p class="text-red-500 text-sm mt-1">{errors.project_url}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Tanggal Mulai <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<Calendar class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="date"
								bind:value={formData.project_start_date}
								class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								class:border-red-500={errors.project_start_date}
							/>
						</div>
						{#if errors.project_start_date}
							<p class="text-red-500 text-sm mt-1">{errors.project_start_date}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Tanggal Selesai <span class="text-red-500">*</span>
						</label>
						<div class="relative">
							<Calendar class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="date"
								bind:value={formData.project_end_date}
								class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								class:border-red-500={errors.project_end_date}
							/>
						</div>
						{#if errors.project_end_date}
							<p class="text-red-500 text-sm mt-1">{errors.project_end_date}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Description -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Deskripsi Project</h2>
				
				<div class="space-y-6">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Deskripsi Singkat <span class="text-red-500">*</span>
						</label>
						<textarea
							bind:value={formData.project_description}
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							placeholder="Deskripsi singkat tentang project ini"
							class:border-red-500={errors.project_description}
						></textarea>
						{#if errors.project_description}
							<p class="text-red-500 text-sm mt-1">{errors.project_description}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Case Study Detail
						</label>
						<textarea
							bind:value={formData.case_study}
							rows="6"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							placeholder="Jelaskan detail case study, tantangan yang dihadapi, solusi yang diterapkan, dan hasil yang dicapai"
						></textarea>
						<p class="text-sm text-gray-500 mt-1">Opsional - Berikan detail tentang proses dan hasil project</p>
					</div>
				</div>
			</div>

			<!-- Image Upload -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Gambar Project</h2>
				
				<div class="space-y-4">
					<div class="flex items-center justify-center w-full">
						<label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
							{#if imagePreview}
								<img src={imagePreview} alt="Preview" class="w-full h-full object-cover rounded-lg" />
							{:else}
								<div class="flex flex-col items-center justify-center pt-5 pb-6">
									<ImageIcon class="w-8 h-8 mb-4 text-gray-500" />
									<p class="mb-2 text-sm text-gray-500">
										<span class="font-semibold">Click to upload</span> or drag and drop
									</p>
									<p class="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
								</div>
							{/if}
							<input type="file" accept="image/*" class="hidden" on:change={handleImageUpload} />
						</label>
					</div>
					
					{#if imagePreview}
						<button
							type="button"
							on:click={() => {
								imagePreview = '';
								imageFile = null;
								formData.image_url = '';
							}}
							class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700"
						>
							<X class="w-4 h-4" />
							Remove Image
						</button>
					{/if}
				</div>
			</div>

			<!-- Categories -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Kategori Project</h2>
				
				<div class="space-y-4">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
						{#each availableCategories as category}
							<label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {selectedCategories.includes(category.category_id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
								<input
									type="checkbox"
									checked={selectedCategories.includes(category.category_id)}
									on:change={() => toggleCategory(category.category_id)}
									class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span class="ml-3 text-sm font-medium text-gray-700">{category.category_name}</span>
							</label>
						{/each}
					</div>
					
					{#if errors.categories}
						<p class="text-red-500 text-sm">{errors.categories}</p>
					{/if}
					
					{#if selectedCategories.length > 0}
						<div class="mt-4">
							<p class="text-sm font-medium text-gray-700 mb-2">Kategori terpilih:</p>
							<div class="flex flex-wrap gap-2">
								{#each selectedCategories as categoryId}
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
										{getCategoryName(categoryId)}
										<button
											type="button"
											on:click={() => toggleCategory(categoryId)}
											class="ml-2 text-blue-600 hover:text-blue-800"
										>
											<X class="w-3 h-3" />
										</button>
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Technologies -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Teknologi yang Digunakan</h2>
				
				<div class="space-y-4">
					<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
						{#each availableTechnologies as tech}
							<label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {selectedTechnologies.includes(tech.tech_id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
								<input
									type="checkbox"
									checked={selectedTechnologies.includes(tech.tech_id)}
									on:change={() => toggleTechnology(tech.tech_id)}
									class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<div class="ml-3">
									<span class="text-sm font-medium text-gray-700">{tech.tech_name}</span>
									<p class="text-xs text-gray-500">{tech.tech_type}</p>
								</div>
							</label>
						{/each}
					</div>
					
					<!-- Add new technology -->
					<div class="border-t pt-4">
						{#if showTechInput}
							<div class="flex gap-2">
								<input
									type="text"
									bind:value={newTechnology}
									placeholder="Nama teknologi baru"
									class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
								<button
									type="button"
									on:click={addNewTechnology}
									class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
								>
									<Plus class="w-4 h-4" />
								</button>
								<button
									type="button"
									on:click={() => {
										showTechInput = false;
										newTechnology = '';
									}}
									class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
								>
									<X class="w-4 h-4" />
								</button>
							</div>
						{:else}
							<button
								type="button"
								on:click={() => showTechInput = true}
								class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
							>
								<Plus class="w-4 h-4" />
								Tambah Teknologi Baru
							</button>
						{/if}
					</div>
					
					{#if errors.technologies}
						<p class="text-red-500 text-sm">{errors.technologies}</p>
					{/if}
					
					{#if selectedTechnologies.length > 0}
						<div class="mt-4">
							<p class="text-sm font-medium text-gray-700 mb-2">Teknologi terpilih:</p>
							<div class="flex flex-wrap gap-2">
								{#each selectedTechnologies as techId}
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
										{getTechnologyName(techId)}
										<button
											type="button"
											on:click={() => toggleTechnology(techId)}
											class="ml-2 text-green-600 hover:text-green-800"
										>
											<X class="w-3 h-3" />
										</button>
									</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Settings -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Pengaturan</h2>
				
				<div class="space-y-4">
					<label class="flex items-center">
						<input
							type="checkbox"
							bind:checked={formData.is_featured}
							class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="ml-3 text-sm font-medium text-gray-700">Featured Portfolio</span>
						<p class="ml-2 text-xs text-gray-500">(Akan ditampilkan di halaman utama)</p>
					</label>
					
					<label class="flex items-center">
						<input
							type="checkbox"
							bind:checked={formData.is_active}
							class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="ml-3 text-sm font-medium text-gray-700">Status Active</span>
						<p class="ml-2 text-xs text-gray-500">(Portfolio akan ditampilkan di website)</p>
					</label>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-end">
				<button
					type="button"
					on:click={() => goto('/dashboard/portfolio')}
					class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
				>
					Batal
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if isSubmitting}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Menyimpan...
					{:else}
						<Save class="w-4 h-4" />
						Simpan Portfolio
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>