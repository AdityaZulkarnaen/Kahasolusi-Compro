<script>
	import { goto } from '$app/navigation';
	import { Phone, Mail, MessageSquare, ExternalLink, ArrowLeft } from 'lucide-svelte';
	
	// Form data - based on ERD CONTACT_CTA table
	let formData = {
		cta_type: 'WhatsApp',
		cta_title: '',
		cta_url: '',
		contact: '',
		cta_description: '',
		is_active: true,
		sort_order: 1
	};
	
	let errors = {};
	let isSubmitting = false;
	
	// CTA types for dropdown
	const ctaTypes = [
		{ value: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
		{ value: 'Email', label: 'Email', icon: Mail },
		{ value: 'Phone', label: 'Phone', icon: Phone },
		{ value: 'Form', label: 'Form', icon: ExternalLink }
	];
	
	// Validation function
	function validateForm() {
		const newErrors = {};
		
		if (!formData.cta_type.trim()) {
			newErrors.cta_type = 'Tipe contact wajib dipilih';
		}
		
		if (!formData.cta_title.trim()) {
			newErrors.cta_title = 'Judul contact wajib diisi';
		}
		
		if (!formData.contact.trim()) {
			newErrors.contact = 'Contact info wajib diisi';
		}
		
		if (!formData.cta_url.trim()) {
			newErrors.cta_url = 'URL contact wajib diisi';
		}
		
		if (!formData.cta_description.trim()) {
			newErrors.cta_description = 'Deskripsi wajib diisi';
		}
		
		// URL validation
		if (formData.cta_url && !isValidUrl(formData.cta_url)) {
			newErrors.cta_url = 'Format URL tidak valid';
		}
		
		// Contact validation based on type
		if (formData.cta_type === 'Email' && formData.contact && !isValidEmail(formData.contact)) {
			newErrors.contact = 'Format email tidak valid';
		}
		
		if (formData.cta_type === 'Phone' && formData.contact && !isValidPhone(formData.contact)) {
			newErrors.contact = 'Format nomor telepon tidak valid';
		}
		
		if (formData.sort_order < 1) {
			newErrors.sort_order = 'Urutan harus minimal 1';
		}
		
		return newErrors;
	}
	
	function isValidUrl(url) {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}
	
	function isValidEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
	
	function isValidPhone(phone) {
		const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
		return phoneRegex.test(phone);
	}
	
	function getTypeIcon(type) {
		const typeConfig = ctaTypes.find(t => t.value === type);
		return typeConfig ? typeConfig.icon : ExternalLink;
	}
	
	function getTypeColor(type) {
		switch (type) {
			case 'WhatsApp': return 'bg-green-100 text-green-800';
			case 'Email': return 'bg-blue-100 text-blue-800';
			case 'Phone': return 'bg-purple-100 text-purple-800';
			case 'Form': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	// Generate sample URLs based on type
	function updateSampleUrl() {
		switch (formData.cta_type) {
			case 'WhatsApp':
				if (!formData.cta_url) formData.cta_url = 'https://wa.me/';
				if (!formData.contact) formData.contact = '+62 812 3456 7890';
				break;
			case 'Email':
				if (!formData.cta_url) formData.cta_url = 'mailto:';
				if (!formData.contact) formData.contact = 'info@kahasolusi.com';
				break;
			case 'Phone':
				if (!formData.cta_url) formData.cta_url = 'tel:';
				if (!formData.contact) formData.contact = '+62 21 1234 5678';
				break;
			case 'Form':
				if (!formData.cta_url) formData.cta_url = '/contact-form';
				if (!formData.contact) formData.contact = 'Contact Form';
				break;
		}
	}
	
	// Watch for type changes
	$: if (formData.cta_type) {
		updateSampleUrl();
	}
	
	async function handleSubmit(event) {
		event.preventDefault();
		
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			errors = validationErrors;
			return;
		}
		
		isSubmitting = true;
		errors = {};
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			console.log('Contact CTA data:', {
				...formData,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				created_by: 1,
				updated_by: 1
			});
			
			// Redirect to contact-cta list
			goto('/dashboard/contact-cta');
			
		} catch (error) {
			console.error('Error saving contact CTA:', error);
			alert('Terjadi kesalahan saat menyimpan contact CTA');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Tambah Contact CTA - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-4xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex items-center gap-4 mb-4">
			<button 
				onclick={() => goto('/dashboard/contact-cta')}
				class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
			>
				<ArrowLeft class="w-4 h-4" />
				Kembali
			</button>
		</div>
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Tambah Contact CTA Baru</h1>
			<p class="text-gray-600 mt-1">Buat contact dan call-to-action baru untuk komunikasi dengan klien</p>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Form -->
		<div class="lg:col-span-2">
			<form onsubmit={handleSubmit} class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
				<!-- CTA Type -->
				<div>
					<label for="cta_type" class="block text-sm font-medium text-gray-700 mb-2">
						Tipe Contact <span class="text-red-500">*</span>
					</label>
					<select 
						id="cta_type"
						bind:value={formData.cta_type}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.cta_type}
					>
						{#each ctaTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
					{#if errors.cta_type}
						<p class="text-red-500 text-sm mt-1">{errors.cta_type}</p>
					{/if}
				</div>
				
				<!-- CTA Title -->
				<div>
					<label for="cta_title" class="block text-sm font-medium text-gray-700 mb-2">
						Judul Contact <span class="text-red-500">*</span>
					</label>
					<input
						id="cta_title"
						type="text"
						bind:value={formData.cta_title}
						placeholder="Konsultasi WhatsApp"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.cta_title}
					/>
					{#if errors.cta_title}
						<p class="text-red-500 text-sm mt-1">{errors.cta_title}</p>
					{/if}
				</div>
				
				<!-- Contact Info -->
				<div>
					<label for="contact" class="block text-sm font-medium text-gray-700 mb-2">
						Contact Info <span class="text-red-500">*</span>
					</label>
					<input
						id="contact"
						type="text"
						bind:value={formData.contact}
						placeholder={formData.cta_type === 'Email' ? 'info@kahasolusi.com' : formData.cta_type === 'Phone' ? '+62 21 1234 5678' : formData.cta_type === 'WhatsApp' ? '+62 812 3456 7890' : 'Contact Form'}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.contact}
					/>
					{#if errors.contact}
						<p class="text-red-500 text-sm mt-1">{errors.contact}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">
						{#if formData.cta_type === 'Email'}
							Masukkan alamat email yang valid
						{:else if formData.cta_type === 'Phone'}
							Masukkan nomor telepon dengan format: +62 21 1234 5678
						{:else if formData.cta_type === 'WhatsApp'}
							Masukkan nomor WhatsApp dengan format: +62 812 3456 7890
						{:else}
							Masukkan nama atau label untuk form contact
						{/if}
					</p>
				</div>
				
				<!-- CTA URL -->
				<div>
					<label for="cta_url" class="block text-sm font-medium text-gray-700 mb-2">
						URL Contact <span class="text-red-500">*</span>
					</label>
					<input
						id="cta_url"
						type="url"
						bind:value={formData.cta_url}
						placeholder={formData.cta_type === 'Email' ? 'mailto:info@kahasolusi.com' : formData.cta_type === 'Phone' ? 'tel:+622112345678' : formData.cta_type === 'WhatsApp' ? 'https://wa.me/6281234567890' : '/contact-form'}
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						class:border-red-500={errors.cta_url}
					/>
					{#if errors.cta_url}
						<p class="text-red-500 text-sm mt-1">{errors.cta_url}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">
						{#if formData.cta_type === 'Email'}
							Format: mailto:email@domain.com
						{:else if formData.cta_type === 'Phone'}
							Format: tel:+622112345678
						{:else if formData.cta_type === 'WhatsApp'}
							Format: https://wa.me/6281234567890
						{:else}
							URL halaman form contact atau endpoint API
						{/if}
					</p>
				</div>
				
				<!-- CTA Description -->
				<div>
					<label for="cta_description" class="block text-sm font-medium text-gray-700 mb-2">
						Deskripsi <span class="text-red-500">*</span>
					</label>
					<textarea
						id="cta_description"
						bind:value={formData.cta_description}
						rows="4"
						placeholder="Deskripsi lengkap tentang contact ini dan kegunaannya"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						class:border-red-500={errors.cta_description}
					></textarea>
					{#if errors.cta_description}
						<p class="text-red-500 text-sm mt-1">{errors.cta_description}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">Jelaskan dengan detail kegunaan dan cara penggunaan contact ini</p>
				</div>
				
				<!-- Settings -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
						<p class="text-sm text-gray-500 mt-1">Contact dengan urutan lebih kecil akan ditampilkan lebih dulu</p>
					</div>
					
					<div class="flex flex-col justify-center">
						<div class="flex items-center">
							<input
								type="checkbox"
								id="is_active"
								bind:checked={formData.is_active}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="is_active" class="ml-3 text-sm font-medium text-gray-700">Contact Aktif</label>
						</div>
						<p class="ml-2 text-xs text-gray-500">(Contact akan ditampilkan di website)</p>
					</div>
				</div>
				
				<!-- Submit Buttons -->
				<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
					<button 
						type="button"
						onclick={() => goto('/dashboard/contact-cta')}
						class="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						disabled={isSubmitting}
					>
						Batal
					</button>
					<button 
						type="submit"
						class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						disabled={isSubmitting}
					>
						{#if isSubmitting}
							<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						{/if}
						Simpan Contact CTA
					</button>
				</div>
			</form>
		</div>

		<!-- Preview -->
		
	</div>
</div>