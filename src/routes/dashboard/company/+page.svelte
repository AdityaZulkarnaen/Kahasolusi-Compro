<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Save, Building, MapPin, Phone, Mail, Globe, Upload, X, Eye, Loader2 } from 'lucide-svelte';
	import { companyAPI, uploadAPI } from '$lib/api.js';
	
	// Company profile data based on ERD table
	let companyData = {
		profile_id: 1,
		company_name: '',
		company_address: '',
		logo_url: '',
		vision: '',
		mission: '',
		description: '',
		phone: '',
		email: '',
		linkedin_url: '',
		created_at: '',
		updated_at: '',
		created_by: 1,
		updated_by: 1
	};
	
	// Form validation
	let errors = {};
	let isSubmitting = false;
	let isLoading = true;
	let error = null;
	let showSuccessModal = false;
	let logoFile = null;
	let logoPreview = null;
	
	// Load company data on mount
	onMount(async () => {
		await loadCompanyData();
	});
	
	async function loadCompanyData() {
		// Only run in browser, not during SSR
		if (!browser) return;
		
		try {
			console.log('Loading company data...');
			isLoading = true;
			error = null;
			
			const companies = await companyAPI.get();
			console.log('Received company data:', companies);
			
			// Get first company (should be only one)
			const company = companies && companies.length > 0 ? companies[0] : null;
			
			if (company) {
				companyData = { ...company };
				
				// Set logo preview if exists
				if (company.logo_url) {
					logoPreview = getLogoUrl(company.logo_url);
				}
			} else {
				error = 'Data company tidak ditemukan';
			}
		} catch (err) {
			console.error('Error loading company data:', err);
			error = 'Gagal memuat data company';
		} finally {
			isLoading = false;
		}
	}
	
	// Get proper logo URL
	function getLogoUrl(logoUrl) {
		if (!logoUrl) return null;
		// If it's already a full URL, return as is
		if (logoUrl.startsWith('http')) return logoUrl;
		
		// Get base URL from environment or default
		const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
		
		// If it starts with /uploads/, add the base URL
		if (logoUrl.startsWith('/uploads/')) {
			return `${baseUrl}${logoUrl}`;
		}
		// Otherwise, assume it's an old path and add the full uploads path
		return `${baseUrl}/uploads/company/${logoUrl}`;
	}
	
	// Handle logo upload
	function handleLogoUpload(event) {
		const file = event.target.files[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) { // 2MB limit
				alert('Ukuran file terlalu besar. Maksimal 2MB.');
				return;
			}
			
			if (!file.type.startsWith('image/')) {
				alert('File harus berupa gambar.');
				return;
			}
			
			logoFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				logoPreview = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
	
	// Remove logo
	function removeLogo() {
		logoFile = null;
		logoPreview = companyData.logo_url ? getLogoUrl(companyData.logo_url) : null;
		// Reset file input
		const fileInput = document.querySelector('input[type="file"]');
		if (fileInput) fileInput.value = '';
	}
	
	// Remove logo permanently 
	async function removeLogoPermanently() {
		if (confirm('Yakin ingin menghapus logo ini secara permanen?')) {
			try {
				// Delete from server if exists
				if (companyData.logo_url) {
					const filename = companyData.logo_url.split('/').pop();
					await uploadAPI.deleteCompanyLogo(filename);
				}
				
				// Update database to remove logo URL
				const updateData = { ...companyData, logo_url: null };
				await companyAPI.updateCompany(updateData);
				
				// Update local state
				companyData.logo_url = null;
				originalLogoUrl = null;
				logoFile = null;
				logoPreview = null;
				
				// Reset file input
				const fileInput = document.querySelector('input[type="file"]');
				if (fileInput) fileInput.value = '';
				
				alert('Logo berhasil dihapus');
			} catch (error) {
				console.error('Error removing logo:', error);
				alert('Gagal menghapus logo');
			}
		}
	}
	
	// Validate field
	function validateField(field) {
		errors[field] = '';
		
		switch (field) {
			case 'company_name':
				if (!companyData.company_name.trim()) {
					errors[field] = 'Nama perusahaan wajib diisi';
				}
				break;
			case 'email':
				if (companyData.email && !/\S+@\S+\.\S+/.test(companyData.email)) {
					errors[field] = 'Format email tidak valid';
				}
				break;
			case 'linkedin_url':
				if (companyData.linkedin_url && !/^https?:\/\/.+/.test(companyData.linkedin_url)) {
					errors[field] = 'Format URL LinkedIn tidak valid (harus dimulai dengan http:// atau https://)';
				}
				break;
			case 'phone':
				if (companyData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(companyData.phone)) {
					errors[field] = 'Format nomor telepon tidak valid';
				}
				break;
		}
	}
	
	// Validate all fields
	function validateForm() {
		validateField('company_name');
		validateField('email');
		validateField('linkedin_url');
		validateField('phone');
		
		return !Object.values(errors).some(error => error);
	}
	
	// Handle form submission
	async function handleSubmit(event) {
		event.preventDefault();
		
		if (!validateForm()) {
			alert('Mohon perbaiki kesalahan pada form');
			return;
		}
		
		isSubmitting = true;
		
		try {
			let submitData = { ...companyData };
			const originalLogoUrl = companyData.logo_url;
			
			// Handle logo upload if new file is selected
			if (logoFile) {
				try {
					const uploadResponse = await uploadAPI.uploadCompanyLogo(logoFile);
					submitData.logo_url = uploadResponse.path;
					
					// Delete old logo if it exists and is different
					if (originalLogoUrl && originalLogoUrl !== submitData.logo_url) {
						try {
							const filename = originalLogoUrl.split('/').pop();
							await uploadAPI.deleteCompanyLogo(filename);
						} catch (deleteError) {
							console.warn('Failed to delete old logo:', deleteError);
						}
					}
				} catch (uploadError) {
					console.error('Logo upload failed:', uploadError);
					alert('Gagal mengupload logo. Silakan coba lagi.');
					return;
				}
			}
			
			// Update company via API
			const response = await companyAPI.update(submitData);
			
			console.log('Company updated successfully:', response);
			
			// Show success modal
			showSuccessModal = true;
			
		} catch (error) {
			console.error('Error updating company:', error);
			alert('Terjadi kesalahan saat menyimpan profil perusahaan');
		} finally {
			isSubmitting = false;
		}
	}
	
	// Close success modal
	function closeSuccessModal() {
		showSuccessModal = false;
		// Reload data to get updated info
		loadCompanyData();
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		});
	}
</script>

<svelte:head>
	<title>Company Profile - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Loading State -->
	{#if isLoading && !isSubmitting}
		<div class="flex items-center justify-center min-h-64">
			<div class="text-center">
				<Loader2 class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
				<p class="text-gray-600">Memuat data company...</p>
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
				onclick={() => window.location.reload()}
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
			>
				Muat Ulang
			</button>
		</div>
	{:else}
		<!-- Submitting Overlay -->
		{#if isSubmitting}
			<div 
				class="fixed inset-0 flex items-center justify-center z-50"
				style="background-color: rgba(0, 0, 0, 0.3);"
			>
				<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
					<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<div>
						<p class="text-lg font-medium text-gray-900">Menyimpan Profil Company...</p>
						<p class="text-sm text-gray-500">Mohon tunggu, sedang memproses data</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Header Section -->
		<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Company Profile</h1>
				<p class="text-gray-600 mt-1">Kelola informasi profil dan identitas perusahaan</p>
			</div>
			<div class="flex items-center gap-3">
				<span class="text-sm text-gray-500">
					Terakhir diperbarui: {formatDate(companyData.updated_at)}
				</span>
				<div class="w-2 h-2 bg-green-500 rounded-full" title="Active"></div>
			</div>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Basic Information -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Company Name -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Nama Perusahaan <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						bind:value={companyData.company_name}
						onblur={() => validateField('company_name')}
						placeholder="Masukkan nama perusahaan"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.company_name}
					/>
					{#if errors.company_name}
						<p class="text-red-500 text-xs mt-1">{errors.company_name}</p>
					{/if}
				</div>

				<!-- Phone -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						<Phone class="w-4 h-4 inline mr-1" />
						Nomor Telepon
					</label>
					<input
						type="tel"
						bind:value={companyData.phone}
						onblur={() => validateField('phone')}
						placeholder="+62 21 1234 5678"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.phone}
					/>
					{#if errors.phone}
						<p class="text-red-500 text-xs mt-1">{errors.phone}</p>
					{/if}
				</div>

				<!-- Email -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						<Mail class="w-4 h-4 inline mr-1" />
						Email
					</label>
					<input
						type="email"
						bind:value={companyData.email}
						onblur={() => validateField('email')}
						placeholder="info@company.com"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.email}
					/>
					{#if errors.email}
						<p class="text-red-500 text-xs mt-1">{errors.email}</p>
					{/if}
				</div>

				<!-- LinkedIn URL -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2">
						<Globe class="w-4 h-4 inline mr-1" />
						LinkedIn URL
					</label>
					<input
						type="url"
						bind:value={companyData.linkedin_url}
						onblur={() => validateField('linkedin_url')}
						placeholder="https://linkedin.com/company/company-name"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.linkedin_url}
					/>
					{#if errors.linkedin_url}
						<p class="text-red-500 text-xs mt-1">{errors.linkedin_url}</p>
					{/if}
				</div>
			</div>

			<!-- Address -->
			<div class="mt-6">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					<MapPin class="w-4 h-4 inline mr-1" />
					Alamat Perusahaan
				</label>
				<textarea
					bind:value={companyData.company_address}
					rows="3"
					placeholder="Alamat lengkap perusahaan"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
				></textarea>
			</div>

			<!-- Description -->
			<div class="mt-6">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Deskripsi Perusahaan
				</label>
				<textarea
					bind:value={companyData.description}
					rows="4"
					placeholder="Deskripsi singkat tentang perusahaan"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
				></textarea>
			</div>
		</div>

		<!-- Vision & Mission -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">Visi & Misi</h2>
			
			<!-- Vision -->
			<div class="mb-6">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Visi Perusahaan
				</label>
				<textarea
					bind:value={companyData.vision}
					rows="3"
					placeholder="Visi jangka panjang perusahaan..."
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
				></textarea>
			</div>

			<!-- Mission -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Misi Perusahaan
				</label>
				<textarea
					bind:value={companyData.mission}
					rows="5"
					placeholder="Misi dan tujuan perusahaan..."
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
				></textarea>
				<p class="text-xs text-gray-500 mt-1">Pisahkan setiap poin misi dengan paragraf baru atau tanda titik</p>
			</div>
		</div>

		<!-- Logo Upload -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">Logo Perusahaan</h2>
			
			<div class="flex flex-col items-center justify-center space-y-4">
				{#if logoPreview}
					<div class="relative">
						<img 
							src={logoPreview} 
							alt="Preview" 
							class="w-32 h-32 object-contain rounded-lg border-4 border-gray-200"
						/>
						<button
							type="button"
							onclick={removeLogo}
							class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
							title="Batalkan pemilihan logo"
						>
							<X class="w-4 h-4" />
						</button>
					</div>
					
					<!-- Additional permanent delete button for existing logos -->
					{#if companyData.logo_url && !logoFile}
						<button
							type="button"
							onclick={removeLogoPermanently}
							class="text-sm text-red-600 hover:text-red-800 underline"
						>
							Hapus logo permanen
						</button>
					{/if}
				{:else}
					<div class="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-4 border-gray-200">
						<Building class="w-16 h-16 text-gray-400" />
					</div>
				{/if}
				
				<div class="text-center">
					<label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						<Upload class="w-4 h-4" />
						{logoPreview ? 'Ganti Logo' : 'Upload Logo'}
						<input
							type="file"
							accept="image/*"
							onchange={handleLogoUpload}
							class="hidden"
						/>
					</label>
					<p class="text-xs text-gray-500 mt-2">
						Rekomendasi: 400x400px, format PNG/JPG/SVG, maksimal 2MB
					</p>
				</div>
			</div>
		</div>

		<!-- Metadata Info (Read Only) -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Sistem</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Profile ID</label>
					<input
						type="text"
						value={companyData.profile_id}
						readonly
						class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
					/>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Dibuat Tanggal</label>
					<input
						type="text"
						value={formatDate(companyData.created_at)}
						readonly
						class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
					/>
				</div>
				
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Terakhir Diperbarui</label>
					<input
						type="text"
						value={formatDate(companyData.updated_at)}
						readonly
						class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
					/>
				</div>
			</div>
		</div>

		<!-- Submit Button -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex justify-end">
				<button
					type="submit"
					disabled={isSubmitting}
					class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
				>
					{#if isSubmitting}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Menyimpan...
					{:else}
						<Save class="w-4 h-4" />
						Simpan Perubahan
					{/if}
				</button>
			</div>
		</div>
	</form>
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
					<p class="text-gray-600">Profil company berhasil diperbarui.</p>
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