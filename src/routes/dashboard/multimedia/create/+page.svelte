<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { 
		ArrowLeft, 
		Save, 
		X, 
		Plus, 
		Calendar,
		Link as LinkIcon,
		Image as ImageIcon,
		Video,
		FileText,
		Code,
		Globe
	} from 'lucide-svelte';
	
	// Form data based on ERD table
	let formData = {
		media_type: 'image',
		media_title: '',
		media_description: '',
		media_url: '',
		embed_code: '',
		thumbnail_url: '',
		is_active: true,
		sort_order: 1
	};
	
	// Form state
	let isSubmitting = false;
	let errors = {};
	
	// Validation
	function validateForm() {
		errors = {};
		
		if (!formData.media_title.trim()) {
			errors.media_title = 'Judul media wajib diisi';
		}
		
		if (!formData.media_description.trim()) {
			errors.media_description = 'Deskripsi media wajib diisi';
		}
		
		if (formData.media_type !== 'video' && !formData.media_url.trim()) {
			errors.media_url = 'URL media wajib diisi untuk tipe selain video';
		}
		
		if (formData.media_type === 'video' && !formData.media_url.trim() && !formData.embed_code.trim()) {
			errors.embed_code = 'URL media atau embed code wajib diisi untuk video';
		}
		
		if (formData.media_url && !isValidUrl(formData.media_url)) {
			errors.media_url = 'Format URL tidak valid';
		}
		
		if (formData.thumbnail_url && !isValidUrl(formData.thumbnail_url)) {
			errors.thumbnail_url = 'Format URL thumbnail tidak valid';
		}
		
		if (formData.sort_order < 1) {
			errors.sort_order = 'Urutan tampil minimal 1';
		}
		
		return Object.keys(errors).length === 0;
	}
	
	function isValidUrl(string) {
		try {
			new URL(string);
			return string.startsWith('http://') || string.startsWith('https://');
		} catch (_) {
			return false;
		}
	}
	
	// Get media type icon
	function getTypeIcon(type) {
		switch (type) {
			case 'image': return ImageIcon;
			case 'video': return Video;
			case 'document': return FileText;
			default: return FileText;
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
			const mediaData = {
				...formData,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				created_by: 1, // Current user ID
				updated_by: 1
			};
			
			console.log('Media data:', mediaData);
			
			// Redirect to multimedia list
			goto('/dashboard/multimedia');
		} catch (error) {
			console.error('Error saving media:', error);
			alert('Terjadi kesalahan saat menyimpan media');
		} finally {
			isSubmitting = false;
		}
	}
	
	function handleCancel() {
		goto('/dashboard/multimedia');
	}
</script>

<svelte:head>
	<title>Tambah Media Baru - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-4xl mx-auto">
	<!-- Header -->
	<div class="mb-6">
		<div class="flex items-center gap-4 mb-4">
			<button 
				onclick={handleCancel}
				class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors gap-2"
			>
				<ArrowLeft class="w-4 h-4" />
				Kembali
			</button>
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Tambah Media Baru</h1>
				<p class="text-gray-600 mt-1">Tambahkan konten multimedia untuk website dan platform digital</p>
			</div>
		</div>
	</div>

	<!-- Main Form -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="p-6">
			<form onsubmit={handleSubmit} class="space-y-8">
				<!-- Media Type Selection -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div class="lg:col-span-1">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Tipe Media</h3>
						<p class="text-sm text-gray-600">Pilih jenis konten multimedia yang akan ditambahkan</p>
					</div>
					
					<div class="lg:col-span-2">
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{#each ['image', 'video', 'document'] as type}
								<label class="relative cursor-pointer">
									<input
										type="radio"
										bind:group={formData.media_type}
										value={type}
										class="sr-only"
									/>
									<div class="border-2 rounded-lg p-4 text-center transition-all duration-200 {formData.media_type === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}">
										<div class="flex flex-col items-center gap-2">
											<div class="w-8 h-8 {formData.media_type === type ? 'text-blue-600' : 'text-gray-400'}">
												<svelte:component this={getTypeIcon(type)} class="w-full h-full" />
											</div>
											<span class="text-sm font-medium capitalize {formData.media_type === type ? 'text-blue-900' : 'text-gray-700'}">{type}</span>
										</div>
									</div>
								</label>
							{/each}
						</div>
					</div>
				</div>

				<hr class="border-gray-200" />

				<!-- Basic Information -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div class="lg:col-span-1">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Informasi Dasar</h3>
						<p class="text-sm text-gray-600">Informasi umum tentang konten media</p>
					</div>
					
					<div class="lg:col-span-2 space-y-6">
						<!-- Media Title -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Judul Media <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								bind:value={formData.media_title}
								placeholder="Masukkan judul media"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								class:border-red-500={errors.media_title}
							/>
							{#if errors.media_title}
								<p class="text-red-500 text-sm mt-1">{errors.media_title}</p>
							{/if}
						</div>

						<!-- Media Description -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Deskripsi <span class="text-red-500">*</span>
							</label>
							<textarea
								bind:value={formData.media_description}
								rows="4"
								placeholder="Deskripsi detail tentang media ini"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
								class:border-red-500={errors.media_description}
							></textarea>
							{#if errors.media_description}
								<p class="text-red-500 text-sm mt-1">{errors.media_description}</p>
							{/if}
						</div>
					</div>
				</div>

				<hr class="border-gray-200" />

				<!-- Media Sources -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div class="lg:col-span-1">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Sumber Media</h3>
						<p class="text-sm text-gray-600">URL atau embed code untuk konten media</p>
					</div>
					
					<div class="lg:col-span-2 space-y-6">
						<!-- Media URL -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Media URL {formData.media_type !== 'video' ? '*' : ''}
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<LinkIcon class="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="url"
									bind:value={formData.media_url}
									placeholder="https://example.com/media-file"
									class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-500={errors.media_url}
								/>
							</div>
							{#if errors.media_url}
								<p class="text-red-500 text-sm mt-1">{errors.media_url}</p>
							{/if}
							{#if formData.media_type === 'video'}
								<p class="text-gray-500 text-sm mt-1">Opsional jika menggunakan embed code</p>
							{/if}
						</div>

						<!-- Embed Code (for videos) -->
						{#if formData.media_type === 'video'}
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Embed Code {!formData.media_url ? '*' : ''}
								</label>
								<div class="relative">
									<div class="absolute top-3 left-3 pointer-events-none">
										<Code class="h-5 w-5 text-gray-400" />
									</div>
									<textarea
										bind:value={formData.embed_code}
										rows="5"
										placeholder="<iframe src='...' width='560' height='315'></iframe>"
										class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm"
										class:border-red-500={errors.embed_code}
									></textarea>
								</div>
								{#if errors.embed_code}
									<p class="text-red-500 text-sm mt-1">{errors.embed_code}</p>
								{/if}
								<p class="text-gray-500 text-sm mt-1">Embed code dari YouTube, Vimeo, atau platform video lainnya</p>
							</div>
						{/if}

						<!-- Thumbnail URL -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Thumbnail URL
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<ImageIcon class="h-5 w-5 text-gray-400" />
								</div>
								<input
									type="url"
									bind:value={formData.thumbnail_url}
									placeholder="https://example.com/thumbnail.jpg"
									class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-500={errors.thumbnail_url}
								/>
							</div>
							{#if errors.thumbnail_url}
								<p class="text-red-500 text-sm mt-1">{errors.thumbnail_url}</p>
							{/if}
							<p class="text-gray-500 text-sm mt-1">URL gambar untuk preview atau thumbnail</p>
						</div>
					</div>
				</div>

				<hr class="border-gray-200" />

				<!-- Settings -->
				<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<div class="lg:col-span-1">
						<h3 class="text-lg font-semibold text-gray-900 mb-2">Pengaturan</h3>
						<p class="text-sm text-gray-600">Konfigurasi tampilan dan status media</p>
					</div>
					
					<div class="lg:col-span-2 space-y-6">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<!-- Sort Order -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Urutan Tampil
								</label>
								<input
									type="number"
									bind:value={formData.sort_order}
									min="1"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-500={errors.sort_order}
								/>
								{#if errors.sort_order}
									<p class="text-red-500 text-sm mt-1">{errors.sort_order}</p>
								{/if}
							</div>

							<!-- Active Status -->
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Status
								</label>
								<label class="flex items-center cursor-pointer bg-gray-50 rounded-lg p-3">
									<input
										type="checkbox"
										bind:checked={formData.is_active}
										class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="ml-3 text-sm font-medium text-gray-700">Media Aktif</span>
								</label>
							</div>
						</div>
					</div>
				</div>

				<!-- Preview Section -->
				{#if formData.thumbnail_url && isValidUrl(formData.thumbnail_url)}
					<hr class="border-gray-200" />
					
					<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div class="lg:col-span-1">
							<h3 class="text-lg font-semibold text-gray-900 mb-2">Preview</h3>
							<p class="text-sm text-gray-600">Preview thumbnail media</p>
						</div>
						
						<div class="lg:col-span-2">
							<div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
								<img 
									src={formData.thumbnail_url} 
									alt="Preview thumbnail"
									class="w-full max-w-sm h-48 object-cover rounded-lg"
									onerror={() => {
										errors.thumbnail_url = 'Thumbnail tidak dapat dimuat';
									}}
								/>
							</div>
						</div>
					</div>
				{/if}

				<!-- Form Actions -->
				<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
					<button
						type="button"
						onclick={handleCancel}
						class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{#if isSubmitting}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							Menyimpan...
						{:else}
							<Save class="w-4 h-4" />
							Simpan Media
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	input[type="radio"]:checked + div {
		border-color: #3b82f6;
		background-color: #eff6ff;
	}
</style>