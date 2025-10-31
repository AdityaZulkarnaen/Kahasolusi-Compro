<script>
	import { onMount } from 'svelte';
	import { Phone, Mail, MessageSquare, Save, Edit, Trash2, Plus, Eye, ToggleLeft, ToggleRight, ExternalLink, Copy, Clock, MapPin } from 'lucide-svelte';
	
	// Contact CTA data
	let contactCTAs = [
		{
			cta_id: 1,
			cta_title: 'Hubungi Kami Sekarang',
			cta_subtitle: 'Siap membantu mewujudkan project digital Anda',
			cta_description: 'Tim expert kami siap memberikan konsultasi gratis untuk kebutuhan teknologi bisnis Anda. Jangan ragu untuk menghubungi kami!',
			cta_button_text: 'Konsultasi Gratis',
			cta_button_link: '/contact',
			cta_type: 'primary', // primary, secondary, outline
			placement: 'homepage', // homepage, portfolio, about, footer
			contact_methods: [
				{ type: 'phone', label: 'Telepon', value: '+62 21 1234 5678', icon: 'Phone' },
				{ type: 'email', label: 'Email', value: 'info@kahasolution.com', icon: 'Mail' },
				{ type: 'whatsapp', label: 'WhatsApp', value: '+62 812 3456 7890', icon: 'MessageSquare' }
			],
			background_color: '#3B82F6',
			text_color: '#FFFFFF',
			is_active: true,
			created_at: '2024-01-20',
			updated_at: '2024-01-20',
			click_count: 156,
			conversion_rate: 12.5
		},
		{
			cta_id: 2,
			cta_title: 'Butuh Bantuan?',
			cta_subtitle: 'Tim support kami siap membantu',
			cta_description: 'Memiliki pertanyaan tentang layanan kami? Tim customer service kami siap membantu Anda 24/7.',
			cta_button_text: 'Chat Support',
			cta_button_link: 'https://wa.me/6281234567890',
			cta_type: 'secondary',
			placement: 'portfolio',
			contact_methods: [
				{ type: 'whatsapp', label: 'WhatsApp', value: '+62 812 3456 7890', icon: 'MessageSquare' },
				{ type: 'email', label: 'Support Email', value: 'support@kahasolution.com', icon: 'Mail' }
			],
			background_color: '#10B981',
			text_color: '#FFFFFF',
			is_active: true,
			created_at: '2024-01-18',
			updated_at: '2024-01-25',
			click_count: 89,
			conversion_rate: 8.7
		},
		{
			cta_id: 3,
			cta_title: 'Diskusi Project Anda',
			cta_subtitle: 'Konsultasi gratis dengan expert',
			cta_description: 'Ceritakan ide project Anda kepada kami. Dapatkan estimasi biaya dan timeline yang akurat.',
			cta_button_text: 'Mulai Diskusi',
			cta_button_link: '/consultation',
			cta_type: 'outline',
			placement: 'about',
			contact_methods: [
				{ type: 'phone', label: 'Konsultasi Call', value: '+62 21 1234 5678', icon: 'Phone' },
				{ type: 'email', label: 'Project Email', value: 'project@kahasolution.com', icon: 'Mail' }
			],
			background_color: '#F3F4F6',
			text_color: '#1F2937',
			is_active: false,
			created_at: '2024-01-15',
			updated_at: '2024-01-22',
			click_count: 34,
			conversion_rate: 15.2
		}
	];
	
	// Filter states
	let searchQuery = '';
	let selectedPlacement = 'all';
	let selectedType = 'all';
	let selectedStatus = 'all';
	let filteredCTAs = contactCTAs;
	
	// Form states
	let isCreateModalOpen = false;
	let editingCTA = null;
	let isEditing = false;
	
	// New CTA form data
	let newCTA = {
		cta_title: '',
		cta_subtitle: '',
		cta_description: '',
		cta_button_text: '',
		cta_button_link: '',
		cta_type: 'primary',
		placement: 'homepage',
		contact_methods: [
			{ type: 'phone', label: 'Telepon', value: '', icon: 'Phone' }
		],
		background_color: '#3B82F6',
		text_color: '#FFFFFF',
		is_active: true
	};
	
	// Filter and sort functions
	function filterCTAs() {
		let filtered = contactCTAs;
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(cta => 
				cta.cta_title.toLowerCase().includes(query) ||
				cta.cta_subtitle.toLowerCase().includes(query) ||
				cta.cta_description.toLowerCase().includes(query) ||
				cta.placement.toLowerCase().includes(query)
			);
		}
		
		// Placement filter
		if (selectedPlacement !== 'all') {
			filtered = filtered.filter(cta => cta.placement === selectedPlacement);
		}
		
		// Type filter
		if (selectedType !== 'all') {
			filtered = filtered.filter(cta => cta.cta_type === selectedType);
		}
		
		// Status filter
		if (selectedStatus !== 'all') {
			const isActive = selectedStatus === 'active';
			filtered = filtered.filter(cta => cta.is_active === isActive);
		}
		
		filteredCTAs = filtered;
	}
	
	// Utility functions
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
	
	function getTypeColor(type) {
		switch (type) {
			case 'primary': return 'bg-blue-100 text-blue-800';
			case 'secondary': return 'bg-green-100 text-green-800';
			case 'outline': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	function getPlacementColor(placement) {
		switch (placement) {
			case 'homepage': return 'bg-purple-100 text-purple-800';
			case 'portfolio': return 'bg-orange-100 text-orange-800';
			case 'about': return 'bg-indigo-100 text-indigo-800';
			case 'footer': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}
	
	// CRUD operations
	function openCreateModal() {
		isCreateModalOpen = true;
		newCTA = {
			cta_title: '',
			cta_subtitle: '',
			cta_description: '',
			cta_button_text: '',
			cta_button_link: '',
			cta_type: 'primary',
			placement: 'homepage',
			contact_methods: [
				{ type: 'phone', label: 'Telepon', value: '', icon: 'Phone' }
			],
			background_color: '#3B82F6',
			text_color: '#FFFFFF',
			is_active: true
		};
	}
	
	function closeCreateModal() {
		isCreateModalOpen = false;
	}
	
	function addContactMethod() {
		newCTA.contact_methods = [...newCTA.contact_methods, { type: 'email', label: '', value: '', icon: 'Mail' }];
	}
	
	function removeContactMethod(index) {
		newCTA.contact_methods = newCTA.contact_methods.filter((_, i) => i !== index);
	}
	
	function saveCTA() {
		if (editingCTA) {
			// Update existing CTA
			contactCTAs = contactCTAs.map(cta => 
				cta.cta_id === editingCTA.cta_id 
					? { ...newCTA, cta_id: editingCTA.cta_id, updated_at: new Date().toISOString().split('T')[0] }
					: cta
			);
		} else {
			// Create new CTA
			const newId = Math.max(...contactCTAs.map(c => c.cta_id)) + 1;
			contactCTAs = [...contactCTAs, {
				...newCTA,
				cta_id: newId,
				created_at: new Date().toISOString().split('T')[0],
				updated_at: new Date().toISOString().split('T')[0],
				click_count: 0,
				conversion_rate: 0
			}];
		}
		
		closeCreateModal();
		editingCTA = null;
		filterCTAs();
		alert(editingCTA ? 'CTA berhasil diupdate!' : 'CTA berhasil dibuat!');
	}
	
	function editCTA(cta) {
		editingCTA = cta;
		newCTA = { ...cta };
		isCreateModalOpen = true;
	}
	
	function deleteCTA(ctaId) {
		if (confirm('Apakah Anda yakin ingin menghapus CTA ini?')) {
			contactCTAs = contactCTAs.filter(cta => cta.cta_id !== ctaId);
			filterCTAs();
		}
	}
	
	function toggleActive(ctaId) {
		contactCTAs = contactCTAs.map(cta => 
			cta.cta_id === ctaId 
				? { ...cta, is_active: !cta.is_active, updated_at: new Date().toISOString().split('T')[0] }
				: cta
		);
		filterCTAs();
	}
	
	function copyLink(link) {
		navigator.clipboard.writeText(link);
		alert('Link berhasil disalin!');
	}
	
	// Get stats
	$: stats = {
		total: contactCTAs.length,
		active: contactCTAs.filter(c => c.is_active).length,
		totalClicks: contactCTAs.reduce((sum, c) => sum + c.click_count, 0),
		avgConversion: contactCTAs.length > 0 ? 
			(contactCTAs.reduce((sum, c) => sum + c.conversion_rate, 0) / contactCTAs.length).toFixed(1) : 0
	};
	
	onMount(() => {
		filterCTAs();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || selectedPlacement !== undefined || selectedType !== undefined || selectedStatus !== undefined) {
		filterCTAs();
	}
</script>

<svelte:head>
	<title>Contact CTA Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Contact CTA Management</h1>
				<p class="text-gray-600 mt-1">Kelola call-to-action untuk meningkatkan konversi kontak</p>
			</div>
			<button 
				on:click={openCreateModal}
				class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
			>
				<Plus class="w-4 h-4" />
				Tambah CTA Baru
			</button>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total CTAs</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<MessageSquare class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active CTAs</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<Eye class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Clicks</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.totalClicks}</p>
				</div>
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
					<ExternalLink class="w-6 h-6 text-purple-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Avg Conversion</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.avgConversion}%</p>
				</div>
				<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
					<Phone class="w-6 h-6 text-orange-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<!-- Search -->
			<input
				type="text"
				placeholder="Cari CTA..."
				bind:value={searchQuery}
				class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			/>
			
			<!-- Placement Filter -->
			<select 
				bind:value={selectedPlacement}
				class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			>
				<option value="all">Semua Placement</option>
				<option value="homepage">Homepage</option>
				<option value="portfolio">Portfolio</option>
				<option value="about">About</option>
				<option value="footer">Footer</option>
			</select>
			
			<!-- Type Filter -->
			<select 
				bind:value={selectedType}
				class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			>
				<option value="all">Semua Type</option>
				<option value="primary">Primary</option>
				<option value="secondary">Secondary</option>
				<option value="outline">Outline</option>
			</select>
			
			<!-- Status Filter -->
			<select 
				bind:value={selectedStatus}
				class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			>
				<option value="all">Semua Status</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
		</div>
	</div>

	<!-- CTA List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">Contact CTAs ({filteredCTAs.length})</h3>
		</div>
		
		<div class="divide-y divide-gray-200">
			{#each filteredCTAs as cta}
				<div class="p-6 hover:bg-gray-50 transition-colors">
					<div class="flex items-start justify-between gap-4">
						<!-- CTA Info -->
						<div class="flex-1">
							<div class="flex items-start gap-4">
								<!-- CTA Preview -->
								<div class="flex-shrink-0 w-48 p-4 rounded-lg border-2 border-gray-200" style="background-color: {cta.background_color}; color: {cta.text_color};">
									<h4 class="font-semibold text-sm mb-1">{cta.cta_title}</h4>
									<p class="text-xs opacity-90 mb-2">{cta.cta_subtitle}</p>
									<button class="text-xs px-3 py-1 bg-white bg-opacity-20 rounded-lg">
										{cta.cta_button_text}
									</button>
								</div>
								
								<!-- CTA Details -->
								<div class="flex-1 space-y-3">
									<div>
										<h3 class="text-lg font-semibold text-gray-900">{cta.cta_title}</h3>
										<p class="text-sm text-gray-600">{cta.cta_description}</p>
									</div>
									
									<div class="flex flex-wrap gap-2">
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(cta.cta_type)}">
											{cta.cta_type}
										</span>
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getPlacementColor(cta.placement)}">
											{cta.placement}
										</span>
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {cta.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
											{cta.is_active ? 'Active' : 'Inactive'}
										</span>
									</div>
									
									<!-- Contact Methods -->
									<div class="flex flex-wrap gap-2">
										{#each cta.contact_methods as method}
											<div class="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
												{#if method.icon === 'Phone'}
													<Phone class="w-3 h-3" />
												{:else if method.icon === 'Mail'}
													<Mail class="w-3 h-3" />
												{:else}
													<MessageSquare class="w-3 h-3" />
												{/if}
												<span>{method.label}: {method.value}</span>
											</div>
										{/each}
									</div>
									
									<!-- Stats -->
									<div class="flex items-center gap-6 text-sm text-gray-500">
										<div class="flex items-center gap-1">
											<ExternalLink class="w-4 h-4" />
											<span>{cta.click_count} clicks</span>
										</div>
										<div class="flex items-center gap-1">
											<Phone class="w-4 h-4" />
											<span>{cta.conversion_rate}% conversion</span>
										</div>
										<div class="flex items-center gap-1">
											<Clock class="w-4 h-4" />
											<span>Updated {formatDate(cta.updated_at)}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						
						<!-- Actions -->
						<div class="flex flex-col gap-2">
							<button 
								on:click={() => copyLink(cta.cta_button_link)}
								class="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
								title="Copy Link"
							>
								<Copy class="w-4 h-4" />
							</button>
							<button 
								on:click={() => editCTA(cta)}
								class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
								title="Edit"
							>
								<Edit class="w-4 h-4" />
							</button>
							<button 
								on:click={() => toggleActive(cta.cta_id)}
								class="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
								title={cta.is_active ? 'Deactivate' : 'Activate'}
							>
								{#if cta.is_active}
									<ToggleRight class="w-4 h-4" />
								{:else}
									<ToggleLeft class="w-4 h-4" />
								{/if}
							</button>
							<button 
								on:click={() => deleteCTA(cta.cta_id)}
								class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
								title="Delete"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
		
		{#if filteredCTAs.length === 0}
			<div class="text-center py-12">
				<MessageSquare class="mx-auto h-12 w-12 text-gray-400" />
				<h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada CTA</h3>
				<p class="mt-1 text-sm text-gray-500">
					{searchQuery ? 'Tidak ada CTA yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan CTA pertama.'}
				</p>
				{#if !searchQuery}
					<div class="mt-6">
						<button 
							on:click={openCreateModal}
							class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							<Plus class="w-4 h-4 mr-2" />
							Tambah CTA
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<!-- Create/Edit Modal -->
{#if isCreateModalOpen}
	<div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
		<div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
			<div class="mt-3">
				<!-- Modal Header -->
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-medium text-gray-900">
						{editingCTA ? 'Edit CTA' : 'Tambah CTA Baru'}
					</h3>
					<button 
						on:click={closeCreateModal}
						class="text-gray-400 hover:text-gray-600"
					>
						<span class="sr-only">Close</span>
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<!-- Modal Content -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<!-- Form -->
					<div class="space-y-6">
						<!-- Basic Info -->
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Judul CTA</label>
							<input
								type="text"
								bind:value={newCTA.cta_title}
								placeholder="Hubungi Kami Sekarang"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
							<input
								type="text"
								bind:value={newCTA.cta_subtitle}
								placeholder="Siap membantu mewujudkan project digital Anda"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
							<textarea
								bind:value={newCTA.cta_description}
								placeholder="Jelaskan lebih detail tentang CTA ini..."
								rows="3"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
							></textarea>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Text Button</label>
								<input
									type="text"
									bind:value={newCTA.cta_button_text}
									placeholder="Konsultasi Gratis"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Link Button</label>
								<input
									type="url"
									bind:value={newCTA.cta_button_link}
									placeholder="/contact"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
								<select 
									bind:value={newCTA.cta_type}
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								>
									<option value="primary">Primary</option>
									<option value="secondary">Secondary</option>
									<option value="outline">Outline</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Placement</label>
								<select 
									bind:value={newCTA.placement}
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								>
									<option value="homepage">Homepage</option>
									<option value="portfolio">Portfolio</option>
									<option value="about">About</option>
									<option value="footer">Footer</option>
								</select>
							</div>
						</div>

						<!-- Colors -->
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
								<input
									type="color"
									bind:value={newCTA.background_color}
									class="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
								<input
									type="color"
									bind:value={newCTA.text_color}
									class="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								/>
							</div>
						</div>

						<!-- Contact Methods -->
						<div>
							<div class="flex items-center justify-between mb-3">
								<label class="block text-sm font-medium text-gray-700">Contact Methods</label>
								<button 
									type="button"
									on:click={addContactMethod}
									class="text-blue-600 hover:text-blue-800 text-sm"
								>
									+ Tambah
								</button>
							</div>
							<div class="space-y-3">
								{#each newCTA.contact_methods as method, index}
									<div class="flex gap-3">
										<select 
											bind:value={method.type}
											class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
										>
											<option value="phone">Phone</option>
											<option value="email">Email</option>
											<option value="whatsapp">WhatsApp</option>
										</select>
										<input
											type="text"
											bind:value={method.label}
											placeholder="Label"
											class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
										/>
										<input
											type="text"
											bind:value={method.value}
											placeholder="Value"
											class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
										/>
										<button 
											type="button"
											on:click={() => removeContactMethod(index)}
											class="text-red-600 hover:text-red-800 px-2"
										>
											×
										</button>
									</div>
								{/each}
							</div>
						</div>

						<!-- Status -->
						<div class="flex items-center">
							<input
								type="checkbox"
								id="is_active"
								bind:checked={newCTA.is_active}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="is_active" class="ml-2 block text-sm text-gray-900">
								CTA Active
							</label>
						</div>
					</div>

					<!-- Preview -->
					<div class="space-y-6">
						<h4 class="text-lg font-medium text-gray-900">Preview</h4>
						
						<div class="p-6 rounded-lg border-2 border-gray-200" style="background-color: {newCTA.background_color}; color: {newCTA.text_color};">
							<h3 class="text-xl font-bold mb-2">{newCTA.cta_title || 'Judul CTA'}</h3>
							<p class="text-lg opacity-90 mb-3">{newCTA.cta_subtitle || 'Subtitle CTA'}</p>
							<p class="opacity-80 mb-6">{newCTA.cta_description || 'Deskripsi CTA akan tampil di sini...'}</p>
							
							<div class="space-y-3 mb-6">
								{#each newCTA.contact_methods as method}
									{#if method.label && method.value}
										<div class="flex items-center gap-2 text-sm opacity-90">
											{#if method.type === 'phone'}
												<Phone class="w-4 h-4" />
											{:else if method.type === 'email'}
												<Mail class="w-4 h-4" />
											{:else}
												<MessageSquare class="w-4 h-4" />
											{/if}
											<span>{method.label}: {method.value}</span>
										</div>
									{/if}
								{/each}
							</div>
							
							<button class="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg font-medium transition-colors">
								{newCTA.cta_button_text || 'Button Text'}
							</button>
						</div>
					</div>
				</div>

				<!-- Modal Actions -->
				<div class="flex items-center justify-end gap-3 mt-8">
					<button 
						on:click={closeCreateModal}
						class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Batal
					</button>
					<button 
						on:click={saveCTA}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						{editingCTA ? 'Update CTA' : 'Simpan CTA'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}