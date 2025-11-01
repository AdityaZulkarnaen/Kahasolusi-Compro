<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { 
		ArrowLeft, 
		Save, 
		Upload, 
		X, 
		ExternalLink,
		Image as ImageIcon,
		Code2,
		Palette
	} from 'lucide-svelte';
	
	// Form data
	let formData = {
		tech_name: '',
		tech_type: '',
		tech_description: '',
		official_url: '',
		icon_url: '',
		logo_url: '',
		is_active: true,
		sort_order: 1
	};
	
	// Technology types
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
		'Design Tool',
		'Testing Framework',
		'Build Tool',
		'Package Manager',
		'API Tool',
		'Monitoring Tool'
	];
	
	// Form state
	let isSubmitting = false;
	let errors = {};
	let logoFile = null;
	let logoPreview = '';
	let customType = '';
	let showCustomType = false;
	
	// Validation
	function validateForm() {
		errors = {};
		
		if (!formData.tech_name.trim()) {
			errors.tech_name = 'Nama teknologi wajib diisi';
		}
		
		if (!formData.tech_type.trim() && !customType.trim()) {
			errors.tech_type = 'Tipe teknologi wajib dipilih';
		}
		
		if (!formData.tech_description.trim()) {
			errors.tech_description = 'Deskripsi teknologi wajib diisi';
		}
		
		if (formData.official_url && !isValidUrl(formData.official_url)) {
			errors.official_url = 'URL tidak valid';
		}
		
		if (formData.sort_order < 1) {
			errors.sort_order = 'Urutan harus minimal 1';
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
	
	// Handle file uploads
	function handleLogoUpload(event) {
		const file = event.target.files[0];
		if (file) {
			logoFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				logoPreview = e.target.result;
				formData.logo_url = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
	
	// Handle custom type
	function handleTypeChange() {
		if (formData.tech_type === 'custom') {
			showCustomType = true;
		} else {
			showCustomType = false;
			customType = '';
		}
	}
	
	// Generate slug from name
	function generateSlug(name) {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9\s]/g, '')
			.replace(/\s+/g, '-')
			.trim();
	}
	
	// Form submission
	async function handleSubmit(event) {
		event.preventDefault();
		
		// Handle custom type
		if (showCustomType && customType.trim()) {
			formData.tech_type = customType.trim();
		}
		
		if (!validateForm()) {
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// In real app, this would send data to API
			console.log('Technology data:', {
				...formData,
				logoFile
			});
			
			// Redirect to technology list
			goto('/dashboard/teknologi');
		} catch (error) {
			console.error('Error saving technology:', error);
		} finally {
			isSubmitting = false;
		}
	}
	
	// Remove uploaded files
	function removeLogo() {
		logoFile = null;
		logoPreview = '';
		formData.logo_url = '';
	}
</script>

<svelte:head>
	<title>Tambah Teknologi - Dashboard Kahasolusi</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto p-6">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<button 
					onclick={() => goto('/dashboard/teknologi')}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<ArrowLeft class="w-5 h-5 text-gray-600" />
				</button>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Tambah Teknologi Baru</h1>
					<p class="text-gray-600 mt-1">Tambahkan teknologi baru ke dalam database tech stack</p>
				</div>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="space-y-8">
			<!-- Basic Information -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="md:col-span-2">
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Nama Teknologi <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={formData.tech_name}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							placeholder="Contoh: React, Node.js, PostgreSQL"
							class:border-red-500={errors.tech_name}
						/>
						{#if errors.tech_name}
							<p class="text-red-500 text-sm mt-1">{errors.tech_name}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Tipe Teknologi <span class="text-red-500">*</span>
						</label>
						<select
							bind:value={formData.tech_type}
							onchange={handleTypeChange}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.tech_type}
						>
							<option value="">Pilih tipe teknologi</option>
							{#each techTypes as type}
								<option value={type}>{type}</option>
							{/each}
							<option value="custom">Custom Type...</option>
						</select>
						{#if errors.tech_type}
							<p class="text-red-500 text-sm mt-1">{errors.tech_type}</p>
						{/if}
					</div>
					
					{#if showCustomType}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Custom Type <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								bind:value={customType}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="Masukkan tipe custom"
							/>
						</div>
					{/if}
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Official Website
						</label>
						<div class="relative">
							<ExternalLink class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
							<input
								type="url"
								bind:value={formData.official_url}
								class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="https://example.com"
								class:border-red-500={errors.official_url}
							/>
						</div>
						{#if errors.official_url}
							<p class="text-red-500 text-sm mt-1">{errors.official_url}</p>
						{/if}
					</div>
					
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Urutan Tampilan
						</label>
						<input
							type="number"
							bind:value={formData.sort_order}
							min="1"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.sort_order}
						/>
						{#if errors.sort_order}
							<p class="text-red-500 text-sm mt-1">{errors.sort_order}</p>
						{/if}
						<p class="text-sm text-gray-500 mt-1">Teknologi dengan urutan lebih kecil akan ditampilkan lebih dulu</p>
					</div>
				</div>
			</div>

			<!-- Description -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Deskripsi</h2>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Deskripsi Teknologi <span class="text-red-500">*</span>
					</label>
					<textarea
						bind:value={formData.tech_description}
						rows="4"
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						placeholder="Jelaskan tentang teknologi ini, kegunaannya, dan mengapa perusahaan menggunakannya"
						class:border-red-500={errors.tech_description}
					></textarea>
					{#if errors.tech_description}
						<p class="text-red-500 text-sm mt-1">{errors.tech_description}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">Deskripsi yang baik akan membantu visitor memahami teknologi yang digunakan</p>
				</div>
			</div>

			<!-- Visual Assets -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Visual Assets</h2>
				
				<div class="max-w-md mx-auto">
					<!-- Logo Upload -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-4">
							Logo Teknologi (Rekomendasi: 200x100px, PNG/SVG)
						</label>
						
						<div class="space-y-4">
							<div class="flex items-center justify-center w-full">
								<label class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
									{#if logoPreview}
										<div class="relative">
											<img src={logoPreview} alt="Logo Preview" class="max-w-32 max-h-16 object-contain" />
											<button
												type="button"
												onclick={(e) => { e.preventDefault(); removeLogo(); }}
												class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
											>
												<X class="w-3 h-3" />
											</button>
										</div>
									{:else}
										<div class="flex flex-col items-center justify-center pt-5 pb-6">
											<ImageIcon class="w-8 h-8 mb-2 text-gray-500" />
											<p class="mb-2 text-sm text-gray-500">
												<span class="font-semibold">Click to upload logo</span>
											</p>
											<p class="text-xs text-gray-500">SVG, PNG, JPG (MAX. 200x100px)</p>
										</div>
									{/if}
									<input type="file" accept="image/*" class="hidden" onchange={handleLogoUpload} />
								</label>
							</div>
						</div>
					</div>
				</div>
				
				<div class="mt-6 p-4 bg-blue-50 rounded-lg">
					<div class="flex">
						<div class="flex-shrink-0">
							<ImageIcon class="h-5 w-5 text-blue-400" />
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-blue-800">Tips untuk Upload Gambar</h3>
							<div class="mt-2 text-sm text-blue-700">
								<ul class="list-disc list-inside space-y-1">
									<li>Icon digunakan untuk tampilan grid teknologi (ukuran kecil)</li>
									<li>Logo digunakan untuk tampilan detail dan presentasi (ukuran besar)</li>
									<li>Format SVG lebih direkomendasikan untuk kualitas yang scalable</li>
									<li>Pastikan background transparan untuk hasil terbaik</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Settings -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Pengaturan</h2>
				
				<div class="space-y-4">
					<label class="flex items-center">
						<input
							type="checkbox"
							bind:checked={formData.is_active}
							class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="ml-3 text-sm font-medium text-gray-700">Status Active</span>
						<p class="ml-2 text-xs text-gray-500">(Teknologi akan ditampilkan di website)</p>
					</label>
				</div>
				
				<div class="mt-6 p-4 bg-yellow-50 rounded-lg">
					<div class="flex">
						<div class="flex-shrink-0">
							<Code2 class="h-5 w-5 text-yellow-400" />
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-yellow-800">Catatan</h3>
							<div class="mt-2 text-sm text-yellow-700">
								<p>Teknologi yang sudah dibuat dapat digunakan di portfolio project. Pastikan informasi yang dimasukkan akurat dan lengkap.</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-end">
				<button
					type="button"
					onclick={() => goto('/dashboard/teknologi')}
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
						Simpan Teknologi
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>