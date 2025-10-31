<script>
	import { onMount } from 'svelte';
	import { Save, Eye, Building, MapPin, Phone, Mail, Globe, Users, Target, Heart, History, Upload, Image as ImageIcon, AlertCircle } from 'lucide-svelte';
	
	// Company profile data
	let companyData = {
		company_id: 1,
		company_name: 'PT. Kaha Solusi Teknologi',
		company_slogan: 'Inovasi Teknologi untuk Masa Depan',
		company_logo: '/images/logo-kahasolusi.png',
		company_address: 'Jl. Teknologi No. 123, Jakarta Selatan 12345',
		company_phone: '+62 21 1234 5678',
		company_email: 'info@kahasolusi.com',
		company_website: 'https://kahasolusi.com',
		company_description: 'PT. Kaha Solusi Teknologi adalah perusahaan teknologi yang berdedikasi untuk memberikan solusi inovatif dalam pengembangan perangkat lunak dan sistem informasi.',
		
		// Vision & Mission
		company_vision: 'Menjadi perusahaan teknologi terdepan di Indonesia yang memberikan solusi inovatif dan berkualitas tinggi untuk memajukan transformasi digital di berbagai sektor industri.',
		company_mission: [
			'Mengembangkan solusi teknologi yang inovatif dan berkelanjutan',
			'Memberikan layanan berkualitas tinggi dengan fokus pada kepuasan klien',
			'Membangun tim profesional yang kompeten dan berdedikasi',
			'Berkontribusi dalam kemajuan teknologi informasi di Indonesia'
		],
		
		// History & Foundation
		company_founded_year: '2020',
		company_history: 'Didirikan pada tahun 2020, PT. Kaha Solusi Teknologi lahir dari visi untuk memberikan solusi teknologi yang dapat membantu bisnis berkembang di era digital. Dengan tim yang berpengalaman dan komitmen terhadap inovasi, kami telah melayani berbagai klien dari startup hingga perusahaan besar.',
		
		// Statistics
		total_projects: 150,
		total_clients: 85,
		total_employees: 25,
		years_experience: 4,
		
		// Social Media
		social_facebook: 'https://facebook.com/kahasolusi',
		social_instagram: 'https://instagram.com/kahasolusi',
		social_linkedin: 'https://linkedin.com/company/kahasolusi',
		social_twitter: 'https://twitter.com/kahasolusi',
		
		// Other details
		company_size: 'medium', // small, medium, large
		industry_focus: ['web-development', 'mobile-development', 'system-integration', 'ui-ux-design'],
		certifications: ['ISO 9001:2015', 'CMMI Level 3'],
		
		updated_at: '2024-01-25',
		is_active: true
	};
	
	// Form validation
	let errors = {};
	let isSubmitting = false;
	let activeTab = 'basic'; // basic, vision-mission, history, social, stats
	
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
			
			// Simulate file upload
			const reader = new FileReader();
			reader.onload = (e) => {
				companyData.company_logo = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}
	
	// Add new mission
	function addMission() {
		companyData.company_mission = [...companyData.company_mission, ''];
	}
	
	// Remove mission
	function removeMission(index) {
		companyData.company_mission = companyData.company_mission.filter((_, i) => i !== index);
	}
	
	// Update mission
	function updateMission(index, value) {
		companyData.company_mission[index] = value;
		companyData.company_mission = [...companyData.company_mission];
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
			case 'company_email':
				if (companyData.company_email && !/\S+@\S+\.\S+/.test(companyData.company_email)) {
					errors[field] = 'Format email tidak valid';
				}
				break;
			case 'company_website':
				if (companyData.company_website && !/^https?:\/\/.+/.test(companyData.company_website)) {
					errors[field] = 'Format website tidak valid (harus dimulai dengan http:// atau https://)';
				}
				break;
		}
	}
	
	// Handle form submission
	async function handleSubmit() {
		// Validate required fields
		validateField('company_name');
		validateField('company_email');
		validateField('company_website');
		
		if (Object.values(errors).some(error => error)) {
			alert('Mohon perbaiki kesalahan pada form');
			return;
		}
		
		isSubmitting = true;
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Update timestamp
			companyData.updated_at = new Date().toISOString().split('T')[0];
			
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
			day: 'numeric'
		});
	}
	
	// Tab navigation
	const tabs = [
		{ id: 'basic', label: 'Informasi Dasar', icon: Building },
		{ id: 'vision-mission', label: 'Visi & Misi', icon: Target },
		{ id: 'history', label: 'Sejarah', icon: History },
		{ id: 'social', label: 'Media Sosial', icon: Globe },
		{ id: 'stats', label: 'Statistik', icon: Users }
	];
</script>

<svelte:head>
	<title>Company Profile - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-6 max-w-6xl mx-auto">
	<!-- Header Section -->
	<div class="mb-8">
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

	<!-- Tab Navigation -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
		<div class="border-b border-gray-200">
			<nav class="flex space-x-8 px-6">
				{#each tabs as tab}
					<button
						on:click={() => activeTab = tab.id}
						class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					>
						<div class="flex items-center gap-2">
							<svelte:component this={tab.icon} class="w-4 h-4" />
							{tab.label}
						</div>
					</button>
				{/each}
			</nav>
		</div>
	</div>

	<form on:submit|preventDefault={handleSubmit}>
		<!-- Basic Information Tab -->
		{#if activeTab === 'basic'}
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div class="lg:col-span-2 space-y-6">
					<!-- Company Logo -->
					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-4">Logo Perusahaan</h3>
						<div class="flex items-start gap-6">
							<div class="flex-shrink-0">
								<div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
									{#if companyData.company_logo}
										<img 
											src={companyData.company_logo} 
											alt="Company Logo" 
											class="w-full h-full object-cover"
										/>
									{:else}
										<div class="w-full h-full flex items-center justify-center">
											<ImageIcon class="w-8 h-8 text-gray-400" />
										</div>
									{/if}
								</div>
							</div>
							<div class="flex-1">
								<label class="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
								<input
									type="file"
									accept="image/*"
									on:change={handleLogoUpload}
									class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
								/>
								<p class="text-sm text-gray-500 mt-1">PNG, JPG hingga 2MB. Rasio 1:1 disarankan.</p>
							</div>
						</div>
					</div>

					<!-- Basic Company Info -->
					<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<h3 class="text-lg font-semibold text-gray-900 mb-6">Informasi Perusahaan</h3>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- Company Name -->
							<div class="md:col-span-2">
								<label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
									Nama Perusahaan *
								</label>
								<input
									type="text"
									id="company_name"
									bind:value={companyData.company_name}
									on:blur={() => validateField('company_name')}
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-300={errors.company_name}
								/>
								{#if errors.company_name}
									<p class="mt-1 text-sm text-red-600">{errors.company_name}</p>
								{/if}
							</div>

							<!-- Company Slogan -->
							<div class="md:col-span-2">
								<label for="company_slogan" class="block text-sm font-medium text-gray-700 mb-2">
									Slogan Perusahaan
								</label>
								<input
									type="text"
									id="company_slogan"
									bind:value={companyData.company_slogan}
									placeholder="Tagline atau slogan perusahaan"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>

							<!-- Phone -->
							<div>
								<label for="company_phone" class="block text-sm font-medium text-gray-700 mb-2">
									<Phone class="w-4 h-4 inline mr-1" />
									Nomor Telepon
								</label>
								<input
									type="tel"
									id="company_phone"
									bind:value={companyData.company_phone}
									placeholder="+62 21 1234 5678"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>

							<!-- Email -->
							<div>
								<label for="company_email" class="block text-sm font-medium text-gray-700 mb-2">
									<Mail class="w-4 h-4 inline mr-1" />
									Email
								</label>
								<input
									type="email"
									id="company_email"
									bind:value={companyData.company_email}
									on:blur={() => validateField('company_email')}
									placeholder="info@company.com"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-300={errors.company_email}
								/>
								{#if errors.company_email}
									<p class="mt-1 text-sm text-red-600">{errors.company_email}</p>
								{/if}
							</div>

							<!-- Website -->
							<div>
								<label for="company_website" class="block text-sm font-medium text-gray-700 mb-2">
									<Globe class="w-4 h-4 inline mr-1" />
									Website
								</label>
								<input
									type="url"
									id="company_website"
									bind:value={companyData.company_website}
									on:blur={() => validateField('company_website')}
									placeholder="https://company.com"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
									class:border-red-300={errors.company_website}
								/>
								{#if errors.company_website}
									<p class="mt-1 text-sm text-red-600">{errors.company_website}</p>
								{/if}
							</div>

							<!-- Founded Year -->
							<div>
								<label for="company_founded_year" class="block text-sm font-medium text-gray-700 mb-2">
									Tahun Didirikan
								</label>
								<input
									type="number"
									id="company_founded_year"
									bind:value={companyData.company_founded_year}
									min="1900"
									max="2024"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>
						</div>

						<!-- Address -->
						<div class="mt-6">
							<label for="company_address" class="block text-sm font-medium text-gray-700 mb-2">
								<MapPin class="w-4 h-4 inline mr-1" />
								Alamat Perusahaan
							</label>
							<textarea
								id="company_address"
								bind:value={companyData.company_address}
								rows="3"
								placeholder="Alamat lengkap perusahaan"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							></textarea>
						</div>

						<!-- Description -->
						<div class="mt-6">
							<label for="company_description" class="block text-sm font-medium text-gray-700 mb-2">
								Deskripsi Perusahaan
							</label>
							<textarea
								id="company_description"
								bind:value={companyData.company_description}
								rows="4"
								placeholder="Deskripsi singkat tentang perusahaan"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							></textarea>
						</div>
					</div>
				</div>

				<!-- Sidebar Preview -->
				<div class="lg:col-span-1">
					<div class="sticky top-6">
						<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<h3 class="font-semibold text-gray-900 mb-4">Preview Kartu Perusahaan</h3>
							
							<!-- Company Card Preview -->
							<div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
								<div class="flex items-start gap-4 mb-4">
									<div class="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
										{#if companyData.company_logo}
											<img 
												src={companyData.company_logo} 
												alt="Logo" 
												class="w-full h-full object-cover"
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center">
												<Building class="w-6 h-6 text-gray-400" />
											</div>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<h4 class="font-semibold text-gray-900 truncate">
											{companyData.company_name || 'Nama Perusahaan'}
										</h4>
										{#if companyData.company_slogan}
											<p class="text-sm text-gray-600 italic">{companyData.company_slogan}</p>
										{/if}
									</div>
								</div>
								
								{#if companyData.company_description}
									<p class="text-sm text-gray-600 mb-3 line-clamp-3">{companyData.company_description}</p>
								{/if}
								
								<div class="space-y-2 text-sm">
									{#if companyData.company_phone}
										<div class="flex items-center gap-2 text-gray-600">
											<Phone class="w-4 h-4" />
											<span class="truncate">{companyData.company_phone}</span>
										</div>
									{/if}
									{#if companyData.company_email}
										<div class="flex items-center gap-2 text-gray-600">
											<Mail class="w-4 h-4" />
											<span class="truncate">{companyData.company_email}</span>
										</div>
									{/if}
									{#if companyData.company_website}
										<div class="flex items-center gap-2 text-gray-600">
											<Globe class="w-4 h-4" />
											<span class="truncate">{companyData.company_website}</span>
										</div>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Vision & Mission Tab -->
		{#if activeTab === 'vision-mission'}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-6">Visi & Misi Perusahaan</h3>
				
				<!-- Vision -->
				<div class="mb-8">
					<label for="company_vision" class="block text-sm font-medium text-gray-700 mb-2">
						<Target class="w-4 h-4 inline mr-1" />
						Visi Perusahaan
					</label>
					<textarea
						id="company_vision"
						bind:value={companyData.company_vision}
						rows="4"
						placeholder="Visi jangka panjang perusahaan..."
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
					></textarea>
				</div>

				<!-- Mission -->
				<div>
					<div class="flex items-center justify-between mb-4">
						<label class="block text-sm font-medium text-gray-700">
							<Heart class="w-4 h-4 inline mr-1" />
							Misi Perusahaan
						</label>
						<button
							type="button"
							on:click={addMission}
							class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
						>
							+ Tambah Misi
						</button>
					</div>
					
					<div class="space-y-3">
						{#each companyData.company_mission as mission, index}
							<div class="flex gap-3">
								<span class="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-2">
									{index + 1}
								</span>
								<div class="flex-1">
									<textarea
										bind:value={mission}
										on:input={(e) => updateMission(index, e.target.value)}
										rows="2"
										placeholder="Tuliskan poin misi..."
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
									></textarea>
								</div>
								{#if companyData.company_mission.length > 1}
									<button
										type="button"
										on:click={() => removeMission(index)}
										class="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2"
									>
										<AlertCircle class="w-4 h-4" />
									</button>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- History Tab -->
		{#if activeTab === 'history'}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-6">Sejarah Perusahaan</h3>
				
				<div class="space-y-6">
					<div>
						<label for="company_history" class="block text-sm font-medium text-gray-700 mb-2">
							<History class="w-4 h-4 inline mr-1" />
							Cerita Sejarah
						</label>
						<textarea
							id="company_history"
							bind:value={companyData.company_history}
							rows="8"
							placeholder="Ceritakan sejarah berdirinya perusahaan, pencapaian penting, dan perkembangan hingga saat ini..."
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						></textarea>
					</div>

					<!-- Company Size -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Ukuran Perusahaan</label>
						<select 
							bind:value={companyData.company_size}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						>
							<option value="small">Small (1-10 karyawan)</option>
							<option value="medium">Medium (11-50 karyawan)</option>
							<option value="large">Large (50+ karyawan)</option>
						</select>
					</div>

					<!-- Industry Focus -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">Fokus Industri</label>
						<div class="grid grid-cols-2 gap-3">
							{#each ['web-development', 'mobile-development', 'system-integration', 'ui-ux-design', 'consulting', 'e-commerce'] as industry}
								<label class="flex items-center gap-2">
									<input 
										type="checkbox" 
										value={industry}
										checked={companyData.industry_focus.includes(industry)}
										on:change={(e) => {
											if (e.target.checked) {
												companyData.industry_focus = [...companyData.industry_focus, industry];
											} else {
												companyData.industry_focus = companyData.industry_focus.filter(i => i !== industry);
											}
										}}
										class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-700 capitalize">{industry.replace('-', ' ')}</span>
								</label>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Social Media Tab -->
		{#if activeTab === 'social'}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-6">Media Sosial</h3>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label for="social_facebook" class="block text-sm font-medium text-gray-700 mb-2">
							Facebook
						</label>
						<input
							type="url"
							id="social_facebook"
							bind:value={companyData.social_facebook}
							placeholder="https://facebook.com/company"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label for="social_instagram" class="block text-sm font-medium text-gray-700 mb-2">
							Instagram
						</label>
						<input
							type="url"
							id="social_instagram"
							bind:value={companyData.social_instagram}
							placeholder="https://instagram.com/company"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label for="social_linkedin" class="block text-sm font-medium text-gray-700 mb-2">
							LinkedIn
						</label>
						<input
							type="url"
							id="social_linkedin"
							bind:value={companyData.social_linkedin}
							placeholder="https://linkedin.com/company/company"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label for="social_twitter" class="block text-sm font-medium text-gray-700 mb-2">
							Twitter
						</label>
						<input
							type="url"
							id="social_twitter"
							bind:value={companyData.social_twitter}
							placeholder="https://twitter.com/company"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>
				</div>
			</div>
		{/if}

		<!-- Statistics Tab -->
		{#if activeTab === 'stats'}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-6">Statistik Perusahaan</h3>
				
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div>
						<label for="total_projects" class="block text-sm font-medium text-gray-700 mb-2">
							Total Projects
						</label>
						<input
							type="number"
							id="total_projects"
							bind:value={companyData.total_projects}
							min="0"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label for="total_clients" class="block text-sm font-medium text-gray-700 mb-2">
							Total Clients
						</label>
						<input
							type="number"
							id="total_clients"
							bind:value={companyData.total_clients}
							min="0"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label for="total_employees" class="block text-sm font-medium text-gray-700 mb-2">
							Total Employees
						</label>
						<input
							type="number"
							id="total_employees"
							bind:value={companyData.total_employees}
							min="0"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label for="years_experience" class="block text-sm font-medium text-gray-700 mb-2">
							Years Experience
						</label>
						<input
							type="number"
							id="years_experience"
							bind:value={companyData.years_experience}
							min="0"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>
				</div>

				<!-- Certifications -->
				<div class="mt-6">
					<label class="block text-sm font-medium text-gray-700 mb-2">Sertifikasi</label>
					<div class="space-y-2">
						{#each companyData.certifications as cert, index}
							<div class="flex gap-2">
								<input
									type="text"
									bind:value={cert}
									on:input={(e) => {
										companyData.certifications[index] = e.target.value;
										companyData.certifications = [...companyData.certifications];
									}}
									placeholder="Nama sertifikasi"
									class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
								<button
									type="button"
									on:click={() => {
										companyData.certifications = companyData.certifications.filter((_, i) => i !== index);
									}}
									class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								>
									<AlertCircle class="w-4 h-4" />
								</button>
							</div>
						{/each}
						<button
							type="button"
							on:click={() => {
								companyData.certifications = [...companyData.certifications, ''];
							}}
							class="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
						>
							+ Tambah Sertifikasi
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Submit Button -->
		<div class="flex justify-end mt-8">
			<button
				type="submit"
				disabled={isSubmitting}
				class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
	</form>
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>