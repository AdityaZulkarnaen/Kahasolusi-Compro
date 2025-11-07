<script>
	import { goto } from '$app/navigation';
	import { Plus, ArrowLeft, Upload, X, User, Loader2 } from 'lucide-svelte';
	import { sdmAPI, uploadAPI } from '$lib/api.js';
	
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
	let showCustomPosition = false;
	let customPosition = '';
	let redirecting = false;
	let success = false;
	let successMessage = '';
	
	// File upload
	let photoFile = null;
	let photoPreview = null;
	
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
	
	function removePhoto() {
		photoFile = null;
		photoPreview = null;
		formData.photo_url = '';
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
			
			// Handle photo upload first if photoFile exists
			if (photoFile) {
				try {
					const uploadResponse = await uploadAPI.uploadSDMImage(photoFile);
					submitData.photo_url = uploadResponse.path;
				} catch (uploadError) {
					console.error('Photo upload failed:', uploadError);
					alert('Gagal mengupload foto. Silakan coba lagi.');
					return;
				}
			}
			
			// Convert years_experience to number
			submitData.years_experience = parseInt(submitData.years_experience) || 0;
			
			// Create SDM via API
			const response = await sdmAPI.create(submitData);
			
			console.log('SDM created successfully:', response);
			
			success = true;
			successMessage = 'Anggota tim berhasil ditambahkan!';
			redirecting = true;
			
			// Hide success message after 3 seconds and redirect
			setTimeout(() => {
				success = false;
				goto('/dashboard/sdm');
			}, 3000);
		} catch (error) {
			console.error('Error creating SDM:', error);
			alert('Gagal menambahkan anggota tim. Silakan coba lagi.');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Anggota Tim - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
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
					<h1 class="text-3xl font-bold text-gray-900">Tambah Anggota Tim</h1>
					<p class="text-gray-600 mt-1">Tambahkan anggota tim baru ke dalam database SDM</p>
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

		<!-- Redirecting Overlay -->
		{#if redirecting}
			<div 
				class="fixed inset-0 flex items-center justify-center z-50"
				style="background-color: rgba(0, 0, 0, 0.3);"
			>
				<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
					<div>
						<p class="text-lg font-medium text-gray-900">Anggota Tim Berhasil Ditambahkan!</p>
						<p class="text-sm text-gray-500">Mengalihkan ke halaman SDM...</p>
					</div>
				</div>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-8 {isSubmitting || redirecting ? 'pointer-events-none opacity-75' : ''}">
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
							<Plus class="w-4 h-4" />
							Simpan Anggota Tim
						{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</div>