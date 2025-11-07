<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { Plus, ArrowLeft, Upload, X, User, Loader2, Edit } from 'lucide-svelte';
	import { sdmAPI, uploadAPI } from '$lib/api.js';
	
	// Get the member ID from the URL
	$: memberId = $page.params.id;
	
	// Form data structure based on ERD
	let formData = {
		member_name: '',
		position: '',
		bio: '',
		photo_url: '',
		skills: '',
		certifications: '',
		specializations: '',
		years_experience: 0,
		linkedin_url: '',
		github_url: '',
		is_active: true,
		sort_order: 1
	};
	
	// Available positions
	let positions = [
		'Full Stack Developer',
		'Frontend Developer',
		'Backend Developer',
		'UI/UX Designer',
		'Project Manager',
		'DevOps Engineer',
		'QA Engineer',
		'Business Analyst',
		'Mobile Developer',
		'Data Analyst',
		'System Administrator',
		'Product Manager'
	];
	
	// Form state
	let errors = {};
	let isSubmitting = false;
	let isLoading = true;
	let error = null;
	let showCustomPosition = false;
	let customPosition = '';
	let showSuccessModal = false;
	
	// File upload
	let photoFile = null;
	let photoPreview = null;
	
	// Load member data on mount
	onMount(async () => {
		await loadMemberData();
	});
	
	async function loadMemberData() {
		// Only run in browser, not during SSR
		if (!browser) return;
		
		try {
			console.log('Loading member data for ID:', memberId);
			
			// Check if memberId is valid
			if (!memberId || memberId === 'undefined' || isNaN(Number(memberId))) {
				console.error('Invalid member ID:', memberId);
				error = 'ID anggota tim tidak valid';
				isLoading = false;
				return;
			}
			
			isLoading = true;
			error = null;
			const member = await sdmAPI.getById(memberId);
			console.log('Received member data:', member);
			
			if (member) {
				formData = { ...member };
				
				// Check if position is custom (not in predefined positions)
				if (!positions.includes(member.position)) {
					showCustomPosition = true;
					customPosition = member.position;
				}
				
				// Set photo preview if exists
				if (member.photo_url) {
					photoPreview = getPhotoUrl(member.photo_url);
				}
			} else {
				error = 'Data anggota tim tidak ditemukan';
			}
		} catch (err) {
			console.error('Error loading member data:', err);
			error = 'Gagal memuat data anggota tim';
		} finally {
			isLoading = false;
		}
	}
	
	// Validation function
	function validateForm() {
		errors = {};
		
		if (!formData.member_name.trim()) {
			errors.member_name = 'Nama anggota wajib diisi';
		}
		
		if (!formData.position.trim() && !customPosition.trim()) {
			errors.position = 'Posisi wajib dipilih';
		}
		
		if (!formData.bio.trim()) {
			errors.bio = 'Bio/deskripsi wajib diisi';
		}
		
		if (!formData.skills.trim()) {
			errors.skills = 'Skills wajib diisi';
		}
		
		if (formData.years_experience < 0) {
			errors.years_experience = 'Pengalaman tidak boleh negatif';
		}
		
		if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
			errors.linkedin_url = 'URL LinkedIn tidak valid';
		}
		
		if (formData.github_url && !isValidUrl(formData.github_url)) {
			errors.github_url = 'URL GitHub tidak valid';
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
	
	// Handle file upload
	function handlePhotoUpload(event) {
		const file = event.target.files[0];
		if (file) {
			photoFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				photoPreview = e.target.result;
				formData.photo_url = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
	
	// Handle custom position
	function handlePositionChange() {
		if (formData.position === 'custom') {
			showCustomPosition = true;
		} else {
			showCustomPosition = false;
			customPosition = '';
		}
	}
	
	// Form submission
	async function handleSubmit(event) {
		event.preventDefault();
		
		// Handle custom position
		if (showCustomPosition && customPosition.trim()) {
			formData.position = customPosition.trim();
		}
		
		if (!validateForm()) {
			return;
		}
		
		isSubmitting = true;
		
		try {
			let submitData = { ...formData };
			const originalPhotoUrl = formData.photo_url;
			
			// Handle photo upload if new file is selected
			if (photoFile) {
				try {
					const uploadResponse = await uploadAPI.uploadSDMImage(photoFile);
					submitData.photo_url = uploadResponse.path;
					
					// Delete old photo if it exists and is different
					if (originalPhotoUrl && originalPhotoUrl !== submitData.photo_url) {
						try {
							const filename = originalPhotoUrl.split('/').pop();
							await uploadAPI.deleteSDMImage(filename);
						} catch (deleteError) {
							console.warn('Failed to delete old photo:', deleteError);
						}
					}
				} catch (uploadError) {
					console.error('Photo upload failed:', uploadError);
					alert('Gagal mengupload foto. Silakan coba lagi.');
					return;
				}
			}
			
			// Convert years_experience to number
			submitData.years_experience = parseInt(submitData.years_experience) || 0;
			
			// Update SDM via API
			const response = await sdmAPI.update(memberId, submitData);
			
			console.log('SDM updated successfully:', response);
			
			// Show success modal
			showSuccessModal = true;
		} catch (error) {
			console.error('Error updating SDM:', error);
			alert('Gagal memperbarui data anggota tim. Silakan coba lagi.');
		} finally {
			isSubmitting = false;
		}
	}
	
	// Get proper photo URL
	function getPhotoUrl(photoUrl) {
		if (!photoUrl) return null;
		// If it's already a full URL, return as is
		if (photoUrl.startsWith('http')) return photoUrl;
		
		// Get base URL from environment or default
		const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
		
		// If it starts with /uploads/, add the base URL
		if (photoUrl.startsWith('/uploads/')) {
			return `${baseUrl}${photoUrl}`;
		}
		// Otherwise, assume it's an old path and add the full uploads path
		return `${baseUrl}/uploads/sdm/${photoUrl}`;
	}
	
	// Close success modal and redirect
	function closeSuccessModal() {
		showSuccessModal = false;
		goto('/dashboard/sdm');
	}
	
	// Update removePhoto function for edit mode
	function removePhoto() {
		photoFile = null;
		photoPreview = formData.photo_url ? getPhotoUrl(formData.photo_url) : null;
		// Reset file input
		const fileInput = document.querySelector('input[type="file"]');
		if (fileInput) fileInput.value = '';
	}
</script>

<svelte:head>
	<title>Edit Anggota Tim - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Loading State -->
	{#if isLoading && !isSubmitting}
		<div class="flex items-center justify-center min-h-64">
			<div class="text-center">
				<Loader2 class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
				<p class="text-gray-600">Memuat data anggota tim...</p>
			</div>
		</div>
	{:else if error}
		<!-- Error State -->
		<div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<svg class="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800">Error</h3>
					<p class="text-sm text-red-700 mt-1">{error}</p>
				</div>
			</div>
		</div>
		<div class="text-center">
			<button
				onclick={() => goto('/dashboard/sdm')}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Kembali ke Dashboard SDM
			</button>
		</div>
	{:else}
		<!-- Header -->
		<div class="max-w-4xl mx-auto">
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<button 
					onclick={() => goto('/dashboard/sdm')}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<ArrowLeft class="w-5 h-5 text-gray-500" />
				</button>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Edit Anggota Tim</h1>
					<p class="text-gray-600 mt-1">Perbarui informasi anggota tim</p>
				</div>
			</div>
		</div>

		<!-- Submitting Overlay -->
		{#if isSubmitting}
			<div 
				class="fixed inset-0 flex items-center justify-center z-50"
				style="background-color: rgba(0, 0, 0, 0.3);"
			>
				<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<div>
						<p class="text-lg font-medium text-gray-900">Menyimpan Anggota Tim...</p>
						<p class="text-sm text-gray-500">Mohon tunggu, sedang memproses data</p>
					</div>
				</div>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-8 {isSubmitting ? 'pointer-events-none opacity-75' : ''}">
			<!-- Basic Information -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Member Name -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Nama Lengkap <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={formData.member_name}
							placeholder="Masukkan nama lengkap"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.member_name}
						/>
						{#if errors.member_name}
							<p class="text-red-500 text-xs mt-1">{errors.member_name}</p>
						{/if}
					</div>
					
					<!-- Position -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Posisi <span class="text-red-500">*</span>
						</label>
						<select
							bind:value={formData.position}
							onchange={handlePositionChange}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.position}
						>
							<option value="">Pilih posisi</option>
							{#each positions as position}
								<option value={position}>{position}</option>
							{/each}
							<option value="custom">Custom Position</option>
						</select>
						{#if errors.position}
							<p class="text-red-500 text-xs mt-1">{errors.position}</p>
						{/if}
					</div>
					
					<!-- Custom Position -->
					{#if showCustomPosition}
						<div class="md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Custom Position <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								bind:value={customPosition}
								placeholder="Masukkan posisi kustom"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							/>
						</div>
					{/if}
					
					<!-- Years Experience -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Pengalaman (Tahun)
						</label>
						<input
							type="number"
							bind:value={formData.years_experience}
							min="0"
							max="50"
							placeholder="0"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.years_experience}
						/>
						{#if errors.years_experience}
							<p class="text-red-500 text-xs mt-1">{errors.years_experience}</p>
						{/if}
					</div>
					
					<!-- Sort Order -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Urutan Tampilan
						</label>
						<input
							type="number"
							bind:value={formData.sort_order}
							min="1"
							placeholder="1"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.sort_order}
						/>
						{#if errors.sort_order}
							<p class="text-red-500 text-xs mt-1">{errors.sort_order}</p>
						{/if}
					</div>
				</div>
			</div>
			
			<!-- Bio & Description -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Bio & Deskripsi</h2>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Bio/Deskripsi <span class="text-red-500">*</span>
					</label>
					<textarea
						bind:value={formData.bio}
						rows="4"
						placeholder="Tulis bio singkat tentang anggota tim..."
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						class:border-red-500={errors.bio}
					></textarea>
					{#if errors.bio}
						<p class="text-red-500 text-xs mt-1">{errors.bio}</p>
					{/if}
				</div>
			</div>
			
			<!-- Skills & Certifications -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Skills & Sertifikasi</h2>
				
				<div class="grid grid-cols-1 gap-6">
					<!-- Skills -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Skills <span class="text-red-500">*</span>
						</label>
						<textarea
							bind:value={formData.skills}
							rows="3"
							placeholder="Contoh: JavaScript, React, Node.js, PostgreSQL, Docker (pisahkan dengan koma)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							class:border-red-500={errors.skills}
						></textarea>
						{#if errors.skills}
							<p class="text-red-500 text-xs mt-1">{errors.skills}</p>
						{/if}
						<p class="text-xs text-gray-500 mt-1">Pisahkan setiap skill dengan koma (,)</p>
					</div>
					
					<!-- Certifications -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Sertifikasi
						</label>
						<textarea
							bind:value={formData.certifications}
							rows="3"
							placeholder="Contoh: AWS Certified Solutions Architect, MongoDB Certified Developer (pisahkan dengan koma)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						></textarea>
						<p class="text-xs text-gray-500 mt-1">Pisahkan setiap sertifikasi dengan koma (,)</p>
					</div>
					
					<!-- Specializations -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Spesialisasi
						</label>
						<textarea
							bind:value={formData.specializations}
							rows="3"
							placeholder="Contoh: Frontend Development, API Development, Database Design (pisahkan dengan koma)"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						></textarea>
						<p class="text-xs text-gray-500 mt-1">Pisahkan setiap spesialisasi dengan koma (,)</p>
					</div>
				</div>
			</div>
			
			<!-- Photo Upload -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Foto Profil</h2>
				
				<div class="flex flex-col items-center justify-center space-y-4">
					{#if photoPreview}
						<div class="relative">
							<img 
								src={photoPreview} 
								alt="Preview" 
								class="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
							/>
							<button
								type="button"
								onclick={removePhoto}
								class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
							>
								<X class="w-4 h-4" />
							</button>
						</div>
					{:else}
						<div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
							<User class="w-16 h-16 text-gray-400" />
						</div>
					{/if}
					
					<div class="text-center">
						<label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							<Upload class="w-4 h-4" />
							{photoPreview ? 'Ganti Foto' : 'Upload Foto'}
							<input
								type="file"
								accept="image/*"
								onchange={handlePhotoUpload}
								class="hidden"
							/>
						</label>
						<p class="text-xs text-gray-500 mt-2">
							Rekomendasi: 400x400px, format JPG/PNG, maksimal 2MB
						</p>
					</div>
				</div>
			</div>
			
			<!-- Social Links -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Social Links</h2>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- LinkedIn -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							LinkedIn URL
						</label>
						<input
							type="url"
							bind:value={formData.linkedin_url}
							placeholder="https://linkedin.com/in/username"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.linkedin_url}
						/>
						{#if errors.linkedin_url}
							<p class="text-red-500 text-xs mt-1">{errors.linkedin_url}</p>
						{/if}
					</div>
					
					<!-- GitHub -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							GitHub URL
						</label>
						<input
							type="url"
							bind:value={formData.github_url}
							placeholder="https://github.com/username"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							class:border-red-500={errors.github_url}
						/>
						{#if errors.github_url}
							<p class="text-red-500 text-xs mt-1">{errors.github_url}</p>
						{/if}
					</div>
				</div>
			</div>
			
			<!-- Settings -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-6">Pengaturan</h2>
				
				<div>
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							bind:checked={formData.is_active}
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
						<span class="text-sm font-medium text-gray-700">
							Aktif (anggota akan ditampilkan di website)
						</span>
					</label>
				</div>
			</div>
			
			<!-- Submit Buttons -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="flex flex-col sm:flex-row gap-4 justify-end">
					<button
						type="button"
						onclick={() => goto('/dashboard/sdm')}
						class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{#if isSubmitting}
							<Loader2 class="w-4 h-4 animate-spin" />
							Menyimpan...
						{:else}
							<Edit class="w-4 h-4" />
							Simpan Perubahan
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
{/if}
</div>

<!-- Success Modal -->
{#if showSuccessModal}
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.3);"
	>
		<div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto">
			<div class="p-6">
				<!-- Success Icon -->
				<div class="flex justify-center mb-4">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
						<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>
				
				<!-- Success Message -->
				<div class="text-center mb-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Berhasil!</h3>
					<p class="text-gray-600">Data anggota tim berhasil diperbarui.</p>
				</div>
				
				<!-- Close Button -->
				<div class="flex justify-center">
					<button
						onclick={closeSuccessModal}
						class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					>
						OK
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}