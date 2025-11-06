<script>
	import { onMount } from 'svelte';
	import { Phone, Mail, MessageSquare, Save, Edit, Trash2, Plus, Eye, ToggleLeft, ToggleRight, ExternalLink, Search, Calendar, Tag, Globe } from 'lucide-svelte';
	
	// Contact CTA data - based on ERD CONTACT_CTA table
	let contactCTAs = [
		{
			cta_id: 1,
			cta_type: 'WhatsApp',
			cta_title: 'Azril Fahmiardi',
			cta_url: 'https://wa.me/6281234567890',
			contact: '+62 812 3456 7890',
			cta_description: 'Hubungi kami melalui WhatsApp untuk konsultasi project dan diskusi kebutuhan teknologi bisnis Anda',
			is_active: true,
			sort_order: 1,
			created_at: '2024-01-20T10:00:00Z',
			updated_at: '2024-01-20T10:00:00Z',
			created_by: 1,
			updated_by: 1
		},
		{
			cta_id: 2,
			cta_type: 'Email',
			cta_title: 'Azril Fahmiardi',
			cta_url: 'mailto:info@kahasolusi.com',
			contact: 'info@kahasolusi.com',
			cta_description: 'Kirim email untuk pertanyaan detail tentang layanan, penawaran project, dan partnership bisnis',
			is_active: true,
			sort_order: 2,
			created_at: '2024-01-18T14:30:00Z',
			updated_at: '2024-01-25T09:15:00Z',
			created_by: 1,
			updated_by: 1
		},
		{
			cta_id: 3,
			cta_type: 'Phone',
			cta_title: 'Azril Fahmiardi',
			cta_url: 'tel:+622112345678',
			contact: '+62 21 1234 5678',
			cta_description: 'Hubungi langsung kantor kami untuk konsultasi mendalam dan diskusi project secara real-time',
			is_active: true,
			sort_order: 3,
			created_at: '2024-01-15T16:45:00Z',
			updated_at: '2024-01-15T16:45:00Z',
			created_by: 1,
			updated_by: 1
		},
		{
			cta_id: 4,
			cta_type: 'Form',
			cta_title: 'Azril Fahmiardi',
			cta_url: '/contact-form',
			contact: 'Contact Form',
			cta_description: 'Isi form konsultasi online untuk mendapatkan penawaran dan estimasi project yang detail',
			is_active: false,
			sort_order: 4,
			created_at: '2024-01-10T11:20:00Z',
			updated_at: '2024-01-12T13:45:00Z',
			created_by: 2,
			updated_by: 1
		},
		{
			cta_id: 5,
			cta_type: 'Email',
			cta_title: 'Azril Fahmiardi',
			cta_url: 'mailto:support@kahasolusi.com',
			contact: 'support@kahasolusi.com',
			cta_description: 'Email khusus untuk support technical, troubleshooting, dan bantuan teknis project yang sedang berjalan',
			is_active: true,
			sort_order: 5,
			created_at: '2024-01-08T09:30:00Z',
			updated_at: '2024-01-20T15:00:00Z',
			created_by: 1,
			updated_by: 1
		}
	];
	
	// Filter states
	let searchQuery = '';
	let selectedType = 'all'; // all, WhatsApp, Email, Phone, Form
	let selectedStatus = 'all'; // all, active, inactive
	let sortBy = 'recent'; // recent, title, type
	let filteredCTAs = contactCTAs;
	
	// Form states
	let isCreateModalOpen = false;
	let editingCTA = null;
	let isEditing = false;
	
	// New CTA form data - based on ERD schema
	let newCTA = {
		cta_type: 'WhatsApp',
		cta_title: '',
		cta_url: '',
		contact: '',
		cta_description: '',
		is_active: true,
		sort_order: contactCTAs.length + 1
	};
	
	// Filter and sort functions
	function filterAndSortCTAs() {
		let filtered = contactCTAs;
		
		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(cta => 
				cta.cta_title.toLowerCase().includes(query) ||
				cta.cta_description.toLowerCase().includes(query) ||
				cta.cta_type.toLowerCase().includes(query) ||
				cta.contact.toLowerCase().includes(query)
			);
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
		
		// Sorting
		switch (sortBy) {
			case 'title':
				filtered.sort((a, b) => a.cta_title.localeCompare(b.cta_title));
				break;
			case 'type':
				filtered.sort((a, b) => a.cta_type.localeCompare(b.cta_type));
				break;
			case 'recent':
			default:
				filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				break;
		}
		
		filteredCTAs = filtered;
	}
	
	// Utility functions
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		});
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
	
	function getTypeIcon(type) {
		switch (type) {
			case 'WhatsApp': return MessageSquare;
			case 'Email': return Mail;
			case 'Phone': return Phone;
			case 'Form': return ExternalLink;
			default: return ExternalLink;
		}
	}
	
	// CRUD operations
	function openCreateModal() {
		isCreateModalOpen = true;
		newCTA = {
			cta_type: 'WhatsApp',
			cta_title: '',
			cta_url: '',
			contact: '',
			cta_description: '',
			is_active: true,
			sort_order: contactCTAs.length + 1
		};
	}
	
	function closeCreateModal() {
		isCreateModalOpen = false;
		editingCTA = null;
	}
	
	async function saveCTA() {
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			if (editingCTA) {
				// Update existing CTA
				contactCTAs = contactCTAs.map(cta => 
					cta.cta_id === editingCTA.cta_id 
						? { 
							...newCTA, 
							cta_id: editingCTA.cta_id, 
							created_at: editingCTA.created_at,
							created_by: editingCTA.created_by,
							updated_at: new Date().toISOString(),
							updated_by: 1
						}
						: cta
				);
				alert('Contact CTA berhasil diupdate!');
			} else {
				// Create new CTA
				const newId = Math.max(...contactCTAs.map(c => c.cta_id)) + 1;
				contactCTAs = [...contactCTAs, {
					...newCTA,
					cta_id: newId,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					created_by: 1,
					updated_by: 1
				}];
				alert('Contact CTA berhasil dibuat!');
			}
			
			closeCreateModal();
			filterAndSortCTAs();
			
		} catch (error) {
			console.error('Error saving CTA:', error);
			alert('Terjadi kesalahan saat menyimpan Contact CTA');
		}
	}
	
	function editCTA(cta) {
		editingCTA = cta;
		newCTA = { 
			cta_type: cta.cta_type,
			cta_title: cta.cta_title,
			cta_url: cta.cta_url,
			contact: cta.contact,
			cta_description: cta.cta_description,
			is_active: cta.is_active,
			sort_order: cta.sort_order
		};
		isCreateModalOpen = true;
	}
	
	async function deleteCTA(ctaId) {
		if (!confirm('Apakah Anda yakin ingin menghapus Contact CTA ini?')) {
			return;
		}
		
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 500));
			
			contactCTAs = contactCTAs.filter(cta => cta.cta_id !== ctaId);
			filterAndSortCTAs();
			alert('Contact CTA berhasil dihapus!');
			
		} catch (error) {
			console.error('Error deleting CTA:', error);
			alert('Terjadi kesalahan saat menghapus Contact CTA');
		}
	}
	
	async function toggleActive(ctaId) {
		try {
			contactCTAs = contactCTAs.map(cta => 
				cta.cta_id === ctaId 
					? { 
						...cta, 
						is_active: !cta.is_active, 
						updated_at: new Date().toISOString(),
						updated_by: 1
					}
					: cta
			);
			filterAndSortCTAs();
			
		} catch (error) {
			console.error('Error toggling status:', error);
			alert('Terjadi kesalahan saat mengubah status');
		}
	}
	
	// Get stats
	$: stats = {
		total: contactCTAs.length,
		active: contactCTAs.filter(c => c.is_active).length,
		whatsapp: contactCTAs.filter(c => c.cta_type === 'WhatsApp').length,
		email: contactCTAs.filter(c => c.cta_type === 'Email').length,
		phone: contactCTAs.filter(c => c.cta_type === 'Phone').length,
		form: contactCTAs.filter(c => c.cta_type === 'Form').length
	};
	
	onMount(() => {
		filterAndSortCTAs();
	});
	
	// Reactive statements
	$: if (searchQuery !== undefined || selectedType !== undefined || selectedStatus !== undefined || sortBy !== undefined) {
		filterAndSortCTAs();
	}
</script>

<svelte:head>
	<title>Contact CTA Management - Dashboard Kahasolusi</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-none mx-auto">
	<!-- Header -->
	<div class="mb-6">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Contact CTA Management</h1>
				<p class="text-gray-600 mt-1">Kelola kontak dan call-to-action untuk komunikasi dengan klien</p>
			</div>
			<div class="flex flex-col sm:flex-row gap-3">
				<button 
					onclick={() => window.location.href = '/dashboard/contact-cta/create'}
					class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors gap-2"
				>
					<Plus class="w-4 h-4" />
					Tambah Contact CTA
				</button>
			</div>
		</div>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Total Contact</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<ExternalLink class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active</p>
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
					<p class="text-sm font-medium text-gray-600">WhatsApp</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.whatsapp}</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<MessageSquare class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Email</p>
					<p class="text-2xl font-bold text-gray-900 mt-1">{stats.email}</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Mail class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Filters and Search (styled to match portfolio/teknologi/multimedia) -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
		<div class="flex flex-col xl:flex-row gap-4">
			<!-- Search Bar -->
			<div class="flex-1 min-w-0">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Cari contact CTA berdasarkan judul, tipe, kontak, atau deskripsi..."
						bind:value={searchQuery}
						class="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
					/>
				</div>
			</div>

			<!-- Filters -->
			<div class="flex flex-wrap gap-2 items-center">
				<select 
					bind:value={selectedType}
					class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[160px]"
				>
					<option value="all">Semua Tipe</option>
					<option value="WhatsApp">WhatsApp</option>
					<option value="Email">Email</option>
					<option value="Phone">Phone</option>
					<option value="Form">Form</option>
				</select>

				<select 
					bind:value={selectedStatus}
					class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
				>
					<option value="all">Semua Status</option>
					<option value="active">Aktif</option>
					<option value="inactive">Tidak Aktif</option>
				</select>

				<select 
					bind:value={sortBy}
					class="appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px]"
				>
					<option value="recent">Terbaru</option>
					<option value="title">Judul A-Z</option>
					<option value="type">Tipe</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Contact CTA List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<div class="px-6 py-4 border-b border-gray-200">
			<h3 class="text-lg font-semibold text-gray-900">
				Contact CTAs ({filteredCTAs.length})
			</h3>
		</div>
		
		{#if filteredCTAs.length === 0}
			<div class="text-center py-12">
				<ExternalLink class="w-16 h-16 text-gray-400 mx-auto mb-4" />
				<p class="text-gray-500 text-lg mb-2">Tidak ada contact CTA ditemukan</p>
				<p class="text-gray-400 text-sm">Tambahkan contact CTA baru atau ubah filter pencarian</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-50">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredCTAs as cta}
							<tr class="hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center">
										<div class="flex-shrink-0 h-10 w-10">
											<div class="h-10 w-10 rounded-lg {getTypeColor(cta.cta_type)} flex items-center justify-center">
												<svelte:component this={getTypeIcon(cta.cta_type)} class="w-5 h-5" />
											</div>
										</div>
										<div class="ml-4">
											<div class="text-sm font-medium text-gray-900">{cta.cta_title}</div>
											<div class="text-sm text-gray-500">{cta.contact}</div>
											<div class="text-sm text-gray-500 truncate max-w-xs" title={cta.cta_description}>
												{cta.cta_description}
											</div>
										</div>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getTypeColor(cta.cta_type)}">
										<svelte:component this={getTypeIcon(cta.cta_type)} class="w-3 h-3 mr-1" />
										{cta.cta_type}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										<a 
											href={cta.cta_url} 
											target="_blank"
											class="text-blue-600 hover:text-blue-900 truncate max-w-xs inline-block"
											title={cta.cta_url}
										>
											{cta.cta_url}
										</a>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {cta.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
										{cta.is_active ? 'Aktif' : 'Tidak Aktif'}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{formatDate(cta.created_at)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div class="flex items-center gap-2">
										<a 
											href={cta.cta_url} 
											target="_blank"
											class="text-gray-600 hover:text-gray-900"
											title="Open URL"
										>
											<ExternalLink class="w-4 h-4" />
										</a>
										<button 
											onclick={() => editCTA(cta)}
											class="text-blue-600 hover:text-blue-900"
											title="Edit"
										>
											<Edit class="w-4 h-4" />
										</button>
										<button 
											onclick={() => toggleActive(cta.cta_id)}
											class="{cta.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}"
											title={cta.is_active ? 'Nonaktifkan' : 'Aktifkan'}
										>
											{#if cta.is_active}
												<ToggleRight class="w-4 h-4" />
											{:else}
												<ToggleLeft class="w-4 h-4" />
											{/if}
										</button>
										<button 
											onclick={() => deleteCTA(cta.cta_id)}
											class="text-red-600 hover:text-red-900"
											title="Hapus"
										>
											<Trash2 class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Create/Edit Modal -->
{#if isCreateModalOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
		<div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-semibold text-gray-900">
						{editingCTA ? 'Edit Contact CTA' : 'Tambah Contact CTA Baru'}
					</h3>
					<button onclick={closeCreateModal} class="text-gray-400 hover:text-gray-600">
						<ExternalLink class="w-6 h-6" />
					</button>
				</div>
				
				<form onsubmit={saveCTA} class="space-y-6">
					<!-- CTA Type -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Tipe Contact <span class="text-red-500">*</span>
						</label>
						<select 
							bind:value={newCTA.cta_type}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						>
							<option value="WhatsApp">WhatsApp</option>
							<option value="Email">Email</option>
							<option value="Phone">Phone</option>
							<option value="Form">Form</option>
						</select>
					</div>
					
					<!-- CTA Title -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Judul Contact <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={newCTA.cta_title}
							placeholder="Konsultasi WhatsApp"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>
					
					<!-- Contact -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Contact Info <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							bind:value={newCTA.contact}
							placeholder="+62 812 3456 7890 atau info@kahasolusi.com"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>
					
					<!-- CTA URL -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							URL Contact <span class="text-red-500">*</span>
						</label>
						<input
							type="url"
							bind:value={newCTA.cta_url}
							placeholder="https://wa.me/6281234567890 atau mailto:info@kahasolusi.com"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						/>
					</div>
					
					<!-- CTA Description -->
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-2">
							Deskripsi <span class="text-red-500">*</span>
						</label>
						<textarea
							bind:value={newCTA.cta_description}
							rows="3"
							placeholder="Deskripsi contact dan kegunaan"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
						></textarea>
					</div>
					
					<!-- Settings -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Urutan Tampil
							</label>
							<input
								type="number"
								bind:value={newCTA.sort_order}
								min="1"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							/>
						</div>
						
						<div class="flex items-center pt-8">
							<input
								type="checkbox"
								id="is_active"
								bind:checked={newCTA.is_active}
								class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label for="is_active" class="ml-2 block text-sm text-gray-900">
								Contact Aktif
							</label>
						</div>
					</div>
					
					<!-- Submit Buttons -->
					<div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
						<button 
							type="button"
							onclick={closeCreateModal}
							class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
						>
							Batal
						</button>
						<button 
							type="submit"
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							{editingCTA ? 'Update Contact' : 'Simpan Contact'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

