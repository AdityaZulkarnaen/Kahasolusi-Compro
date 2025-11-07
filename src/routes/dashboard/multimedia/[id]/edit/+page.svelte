<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { multimediaAPI } from '$lib/api.js';
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
		Globe,
		Loader2
	} from 'lucide-svelte';
	
	// Get multimedia ID from URL params
	$: multimediaId = $page.params.id;
	
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
	let loading = true;
	let isSubmitting = false;
	let errors = {};
	let success = false;
	let successMessage = '';
	let redirecting = false;
	let error = null;
	
	// Load multimedia data on mount
	onMount(async () => {
		if (multimediaId) {
			await loadMultimediaData();
		}
	});
	
	async function loadMultimediaData() {
		try {
			loading = true;
			const data = await multimediaAPI.getById(multimediaId);
			
			if (data) {
				formData = {
					media_type: data.media_type || 'image',
					media_title: data.media_title || '',
					media_description: data.media_description || '',
					media_url: data.media_url || '',
					embed_code: data.embed_code || '',
					thumbnail_url: data.thumbnail_url || '',
					is_active: Boolean(data.is_active),
					sort_order: data.sort_order || 1
				};
			}
		} catch (err) {
			error = 'Gagal memuat data media: ' + (err.message || 'Terjadi kesalahan');
			console.error('Error loading multimedia:', err);
		} finally {
			loading = false;
		}
	}
	
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
	async function handleSubmit(event) {
		event.preventDefault();
		
		if (!validateForm()) {
			error = 'Mohon periksa kembali data yang diisi';
			return;
		}
		
		isSubmitting = true;
		error = null;
		
		try {
			await multimediaAPI.update(multimediaId, formData);
			
			success = true;
			successMessage = 'Media berhasil diperbarui!';
			redirecting = true;
			
			// Hide success message after 3 seconds and redirect
			setTimeout(() => {
				success = false;
				goto('/dashboard/multimedia');
			}, 3000);
		} catch (err) {
			error = err.message || 'Terjadi kesalahan saat memperbarui media';
			console.error('Error updating media:', err);
		} finally {
			isSubmitting = false;
		}
	}
	
	function handleCancel() {
		goto('/dashboard/multimedia');
	}
</script>

<svelte:head>
	<title>Edit Media - Dashboard Kahasolusi</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto p-6">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<button 
					onclick={() => goto('/dashboard/multimedia')}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<ArrowLeft class="w-5 h-5 text-gray-600" />
				</button>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Edit Media</h1>
					<p class="text-gray-600 mt-1">Perbarui informasi konten multimedia</p>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
				<div class="flex items-center justify-center gap-3">
					<Loader2 class="w-6 h-6 animate-spin text-blue-600" />
					<span class="text-gray-600">Memuat data media...</span>
				</div>
			</div>
		{:else}

		<!-- Success Toast Notification -->
		{#if success}
			<div class="fixed top-4 right-4 z-50 max-w-md">
				<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
					<svg class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
					<span class="font-medium">{successMessage}</span>
					<button onclick={() => success = false} class="ml-auto text-green-500 hover:text-green-700">
						<X class="w-4 h-4" />
					</button>
				</div>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-red-800">{error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Loading Overlay -->
		{#if isSubmitting}
			<div 
				class="fixed inset-0 flex items-center justify-center z-50"
				style="background-color: rgba(0, 0, 0, 0.5);"
			>
				<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<div>
						<p class="text-lg font-medium text-gray-900">Memperbarui Media...</p>
						<p class="text-sm text-gray-500">Mohon tunggu, sedang memproses data</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Redirecting Overlay -->
		{#if redirecting}
			<div 
				class="fixed inset-0 flex items-center justify-center z-50"
				style="background-color: rgba(0, 0, 0, 0.3);"
			>
				<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
					<div>
						<p class="text-lg font-medium text-gray-900">Media Berhasil Diperbarui!</p>
						<p class="text-sm text-gray-500">Mengalihkan ke halaman multimedia...</p>
					</div>
				</div>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-8 {isSubmitting || redirecting ? 'pointer-events-none opacity-75' : ''}">
			<!-- Media Type Selection -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Tipe Media</h2>
				
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

			<!-- Basic Information -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Media Title -->
					<div class="md:col-span-2">
						<label for="media_title" class="block text-sm font-medium text-gray-700 mb-2">
							Judul Media <span class="text-red-500">*</span>
						</label>
						<input
							id="media_title"
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
					<div class="md:col-span-2">
						<label for="media_description" class="block text-sm font-medium text-gray-700 mb-2">
							Deskripsi <span class="text-red-500">*</span>
						</label>
						<textarea
							id="media_description"
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

			<!-- Media Sources -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Sumber Media</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Media URL -->
					<div class="md:col-span-2">
						<label for="media_url" class="block text-sm font-medium text-gray-700 mb-2">
							Media URL {formData.media_type !== 'video' ? '*' : ''}
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<LinkIcon class="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="media_url"
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
						<div class="md:col-span-2">
							<label for="embed_code" class="block text-sm font-medium text-gray-700 mb-2">
								Embed Code {!formData.media_url ? '*' : ''}
							</label>
							<div class="relative">
								<div class="absolute top-3 left-3 pointer-events-none">
									<Code class="h-5 w-5 text-gray-400" />
								</div>
								<textarea
									id="embed_code"
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
					<div class="md:col-span-2">
						<label for="thumbnail_url" class="block text-sm font-medium text-gray-700 mb-2">
							Thumbnail URL
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<ImageIcon class="h-5 w-5 text-gray-400" />
							</div>
							<input
								id="thumbnail_url"
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

			<!-- Settings -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Pengaturan</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Sort Order -->
					<div>
						<label for="sort_order" class="block text-sm font-medium text-gray-700 mb-2">
							Urutan Tampil
						</label>
						<input
							id="sort_order"
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
								id="is_active"
								type="checkbox"
								bind:checked={formData.is_active}
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="ml-3 text-sm font-medium text-gray-700">Media Aktif</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Preview Section -->
			{#if formData.thumbnail_url && isValidUrl(formData.thumbnail_url)}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Preview Thumbnail</h2>
					
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
			{/if}

			<!-- Form Actions -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="flex justify-end gap-3">
					<button
						type="button"
						onclick={() => goto('/dashboard/multimedia')}
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
							Memperbarui...
						{:else}
							<Save class="w-4 h-4" />
							Perbarui Media
						{/if}
					</button>
				</div>
			</div>
		</form>

		{/if}
	</div>
</div>