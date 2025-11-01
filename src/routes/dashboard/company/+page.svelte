<script>
	import { onMount } from 'svelte';
	import { Save, Building, MapPin, Phone, Mail, Globe, Upload, X, Eye } from 'lucide-svelte';
	
	// Company profile data based on ERD table
	let companyData = {
		profile_id: 1,
		company_name: 'PT. Kaha Solusi Teknologi',
		company_address: 'Jl. Teknologi No. 123, Jakarta Selatan 12345, Indonesia',
		logo_url: '/images/logo-kahasolusi.png',
		vision: 'Menjadi perusahaan teknologi terdepan di Indonesia yang memberikan solusi inovatif dan berkualitas tinggi untuk memajukan transformasi digital di berbagai sektor industri.',
		mission: 'Mengembangkan solusi teknologi yang inovatif dan berkelanjutan. Memberikan layanan berkualitas tinggi dengan fokus pada kepuasan klien. Membangun tim profesional yang kompeten dan berdedikasi. Berkontribusi dalam kemajuan teknologi informasi di Indonesia.',
		description: 'PT. Kaha Solusi Teknologi adalah perusahaan teknologi yang berdedikasi untuk memberikan solusi inovatif dalam pengembangan perangkat lunak dan sistem informasi. Dengan pengalaman bertahun-tahun di industri, kami telah melayani berbagai klien dari startup hingga perusahaan besar.',
		phone: '+62 21 1234 5678',
		email: 'info@kahasolusi.com',
		linkedin_url: 'https://linkedin.com/company/kahasolusi',
		created_at: '2024-01-15T10:00:00Z',
		updated_at: '2024-01-25T15:30:00Z',
		created_by: 1,
		updated_by: 1
	};
	
	// Form validation
	let errors = {};
	let isSubmitting = false;
	let logoFile = null;
	let logoPreview = null;
	
	// Initialize logo preview
	onMount(() => {
		if (companyData.logo_url) {
			logoPreview = companyData.logo_url;
		}
	});
	
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
				companyData.logo_url = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
	
	// Remove logo
	function removeLogo() {
		logoFile = null;
		logoPreview = null;
		companyData.logo_url = '';
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
	async function handleSubmit() {
		if (!validateForm()) {
			alert('Mohon perbaiki kesalahan pada form');
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Update timestamp
			companyData.updated_at = new Date().toISOString();
			companyData.updated_by = 1; // Current admin ID
			
			alert('Profil perusahaan berhasil diperbarui!');
			
		} catch (error) {
			console.error('Error saving company profile:', error);
			alert('Terjadi kesalahan saat menyimpan profil perusahaan');
		} finally {
			isSubmitting = false;
		}
	}
	
	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Company Profile - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
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
						>
							<X class="w-4 h-4" />
						</button>
					</div>
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
</div>