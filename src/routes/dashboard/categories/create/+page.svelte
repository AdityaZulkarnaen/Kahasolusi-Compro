<script>
	import { onMount } from 'svelte';
	import { ArrowLeft, Save, Eye, Hash, Tag, FileText, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-svelte';
	
	// Form data
	let formData = {
		category_name: '',
		category_slug: '',
		category_description: '',
		is_active: true
	};
	
	// Form validation
	let errors = {};
	let isSubmitting = false;
	let isSlugManual = false;
	
	// Auto-generate slug when name changes
	function generateSlug(name) {
		return name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}
	
	// Handle name input change
	function handleNameChange() {
		if (!isSlugManual && formData.category_name) {
			formData.category_slug = generateSlug(formData.category_name);
		}
		validateField('category_name');
	}
	
	// Handle manual slug change
	function handleSlugChange() {
		isSlugManual = true;
		formData.category_slug = generateSlug(formData.category_slug);
		validateField('category_slug');
	}
	
	// Validate individual field
	function validateField(field) {
		errors[field] = '';
		
		switch (field) {
			case 'category_name':
				if (!formData.category_name.trim()) {
					errors[field] = 'Nama kategori wajib diisi';
				} else if (formData.category_name.length < 3) {
					errors[field] = 'Nama kategori minimal 3 karakter';
				} else if (formData.category_name.length > 50) {
					errors[field] = 'Nama kategori maksimal 50 karakter';
				}
				break;
				
			case 'category_slug':
				if (!formData.category_slug.trim()) {
					errors[field] = 'Slug kategori wajib diisi';
				} else if (formData.category_slug.length < 3) {
					errors[field] = 'Slug kategori minimal 3 karakter';
				} else if (formData.category_slug.length > 60) {
					errors[field] = 'Slug kategori maksimal 60 karakter';
				} else if (!/^[a-z0-9-]+$/.test(formData.category_slug)) {
					errors[field] = 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung';
				}
				break;
				
			case 'category_description':
				if (!formData.category_description.trim()) {
					errors[field] = 'Deskripsi kategori wajib diisi';
				} else if (formData.category_description.length < 10) {
					errors[field] = 'Deskripsi kategori minimal 10 karakter';
				} else if (formData.category_description.length > 200) {
					errors[field] = 'Deskripsi kategori maksimal 200 karakter';
				}
				break;
		}
	}
	
	// Validate entire form
	function validateForm() {
		const fields = ['category_name', 'category_slug', 'category_description'];
		fields.forEach(field => validateField(field));
		return !Object.values(errors).some(error => error);
	}
	
	// Handle form submission
	async function handleSubmit() {
		if (!validateForm()) return;
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Show success message
			alert('Kategori berhasil ditambahkan!');
			
			// Navigate back to categories list
			window.location.href = '/dashboard/categories';
			
		} catch (error) {
			console.error('Error saving category:', error);
			alert('Terjadi kesalahan saat menyimpan kategori');
		} finally {
			isSubmitting = false;
		}
	}
	
	// Handle cancel
	function handleCancel() {
		if (hasUnsavedChanges()) {
			if (confirm('Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?')) {
				window.location.href = '/dashboard/categories';
			}
		} else {
			window.location.href = '/dashboard/categories';
		}
	}
	
	// Check if form has unsaved changes
	function hasUnsavedChanges() {
		return formData.category_name || formData.category_description || formData.category_slug;
	}
	
	// Preview URL format
	$: previewUrl = formData.category_slug ? `/portfolio/category/${formData.category_slug}` : '/portfolio/category/[slug]';
	
	onMount(() => {
		// Focus on name field
		document.querySelector('input[name="category_name"]')?.focus();
	});
</script>

<svelte:head>
	<title>Tambah Kategori - Categories Management</title>
</svelte:head>

<div class="p-6 max-w-4xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center gap-4 mb-4">
			<button 
				on:click={handleCancel}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
			>
				<ArrowLeft class="w-5 h-5 text-gray-600" />
			</button>
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Tambah Kategori Baru</h1>
				<p class="text-gray-600 mt-1">Buat kategori baru untuk mengorganisir portfolio project</p>
			</div>
		</div>
		
		<!-- Breadcrumb -->
		<nav class="flex text-sm text-gray-600">
			<a href="/dashboard" class="hover:text-gray-900">Dashboard</a>
			<span class="mx-2">/</span>
			<a href="/dashboard/categories" class="hover:text-gray-900">Categories</a>
			<span class="mx-2">/</span>
			<span class="text-gray-900">Tambah Baru</span>
		</nav>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Main Form -->
		<div class="lg:col-span-2">
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Basic Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
							<Tag class="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<h2 class="text-lg font-semibold text-gray-900">Informasi Dasar</h2>
							<p class="text-sm text-gray-600">Masukkan informasi dasar kategori</p>
						</div>
					</div>

					<div class="space-y-6">
						<!-- Category Name -->
						<div>
							<label for="category_name" class="block text-sm font-medium text-gray-700 mb-2">
								Nama Kategori *
							</label>
							<input
								type="text"
								id="category_name"
								name="category_name"
								bind:value={formData.category_name}
								on:input={handleNameChange}
								placeholder="Contoh: Web Development"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								class:border-red-300={errors.category_name}
								class:focus:ring-red-500={errors.category_name}
								class:focus:border-red-500={errors.category_name}
							/>
							{#if errors.category_name}
								<p class="mt-2 text-sm text-red-600 flex items-center gap-1">
									<AlertCircle class="w-4 h-4" />
									{errors.category_name}
								</p>
							{/if}
						</div>

						<!-- Category Slug -->
						<div>
							<label for="category_slug" class="block text-sm font-medium text-gray-700 mb-2">
								Slug Kategori *
							</label>
							<div class="relative">
								<Hash class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
								<input
									type="text"
									id="category_slug"
									name="category_slug"
									bind:value={formData.category_slug}
									on:input={handleSlugChange}
									placeholder="web-development"
									class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-300={errors.category_slug}
									class:focus:ring-red-500={errors.category_slug}
									class:focus:border-red-500={errors.category_slug}
								/>
							</div>
							{#if errors.category_slug}
								<p class="mt-2 text-sm text-red-600 flex items-center gap-1">
									<AlertCircle class="w-4 h-4" />
									{errors.category_slug}
								</p>
							{/if}
							<p class="mt-2 text-sm text-gray-500">
								Slug akan digunakan dalam URL. Hanya huruf kecil, angka, dan tanda hubung.
							</p>
						</div>

						<!-- Category Description -->
						<div>
							<label for="category_description" class="block text-sm font-medium text-gray-700 mb-2">
								Deskripsi Kategori *
							</label>
							<div class="relative">
								<FileText class="absolute left-3 top-3 text-gray-400 w-5 h-5" />
								<textarea
									id="category_description"
									name="category_description"
									bind:value={formData.category_description}
									on:input={() => validateField('category_description')}
									placeholder="Jelaskan tentang kategori ini dan jenis project yang termasuk di dalamnya..."
									rows="4"
									class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
									class:border-red-300={errors.category_description}
									class:focus:ring-red-500={errors.category_description}
									class:focus:border-red-500={errors.category_description}
								></textarea>
							</div>
							{#if errors.category_description}
								<p class="mt-2 text-sm text-red-600 flex items-center gap-1">
									<AlertCircle class="w-4 h-4" />
									{errors.category_description}
								</p>
							{/if}
							<p class="mt-2 text-sm text-gray-500">
								{formData.category_description.length}/200 karakter
							</p>
						</div>

						<!-- Status -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-3">Status Kategori</label>
							<div class="flex items-center gap-3">
								<button
									type="button"
									on:click={() => formData.is_active = !formData.is_active}
									class="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
								>
									{#if formData.is_active}
										<ToggleRight class="w-6 h-6 text-green-600" />
										<span class="text-green-700 font-medium">Active</span>
									{:else}
										<ToggleLeft class="w-6 h-6 text-gray-400" />
										<span class="text-gray-600 font-medium">Inactive</span>
									{/if}
								</button>
							</div>
							<p class="mt-2 text-sm text-gray-500">
								{formData.is_active ? 'Kategori akan tampil di website dan dapat digunakan' : 'Kategori tidak akan tampil di website'}
							</p>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
					<button
						type="button"
						on:click={handleCancel}
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
					>
						{#if isSubmitting}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Menyimpan...
						{:else}
							<Save class="w-4 h-4" />
							Simpan Kategori
						{/if}
					</button>
				</div>
			</form>
		</div>

		<!-- Sidebar Preview -->
		<div class="lg:col-span-1">
			<div class="sticky top-6 space-y-6">
				<!-- URL Preview -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
							<Eye class="w-4 h-4 text-green-600" />
						</div>
						<h3 class="font-semibold text-gray-900">URL Preview</h3>
					</div>
					<div class="space-y-3">
						<div>
							<p class="text-sm text-gray-600 mb-1">Category Page URL:</p>
							<code class="block text-xs text-blue-600 bg-blue-50 p-2 rounded border break-all">
								{previewUrl}
							</code>
						</div>
					</div>
				</div>

				<!-- Category Info Preview -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex items-center gap-3 mb-4">
						<div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
							<Tag class="w-4 h-4 text-purple-600" />
						</div>
						<h3 class="font-semibold text-gray-900">Preview</h3>
					</div>
					
					<div class="space-y-4">
						<!-- Category Card Preview -->
						<div class="border border-gray-200 rounded-lg p-4">
							<div class="flex items-center gap-3 mb-2">
								<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<Tag class="w-4 h-4 text-blue-600" />
								</div>
								<h4 class="font-medium text-gray-900">
									{formData.category_name || 'Nama Kategori'}
								</h4>
							</div>
							<p class="text-sm text-gray-600 mb-3">
								{formData.category_description || 'Deskripsi kategori akan ditampilkan di sini...'}
							</p>
							<div class="flex items-center justify-between">
								<code class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
									{formData.category_slug || 'category-slug'}
								</code>
								<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {formData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
									{formData.is_active ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Tips -->
				<div class="bg-blue-50 rounded-xl border border-blue-200 p-6">
					<h3 class="font-semibold text-blue-900 mb-3">💡 Tips</h3>
					<ul class="text-sm text-blue-800 space-y-2">
						<li>• Gunakan nama yang jelas dan mudah dipahami</li>
						<li>• Slug akan otomatis dibuat dari nama kategori</li>
						<li>• Deskripsi yang baik membantu SEO website</li>
						<li>• Kategori aktif akan tampil di filter portfolio</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</div>