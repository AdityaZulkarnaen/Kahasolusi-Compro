<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { portfolioAPI, categoriesAPI, technologiesAPI, uploadAPI, clientsAPI } from '$lib/api.js';
	import { indonesianProvinces } from '$lib/data/provinces.js';
	import { browser } from '$app/environment';
	import ClientModal from '$lib/components/ClientModal.svelte';
	import { 
		ArrowLeft, 
		Save, 
		Upload, 
		X, 
		Plus,
		Eye,
		ImageIcon,
		Edit,
		Trash2
	} from 'lucide-svelte';

	// Get base URL for images
	const API_BASE_URL = browser ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api' : '';
	const BASE_URL = API_BASE_URL.replace('/api', ''); // Remove /api suffix for image URLs
	
	// Helper function to get full image URL
	function getImageUrl(imagePath) {
		if (!imagePath) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVMMTI1IDEyNUw4NyA4N0w3NSAxMDBMMTI1IDE1MEwxNzUgMTAwVjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8Y2lyY2xlIGN4PSI4NyIgY3k9Ijc1IiByPSIxMiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
		if (imagePath.startsWith('http')) return imagePath;
		return `${BASE_URL}${imagePath}`;
	}

	// Get portfolio ID from URL params
	$: portfolioId = $page.params.id;

	// Storage key for form state preservation (unique per portfolio)
	$: STORAGE_KEY = `portfolio_edit_form_state_${portfolioId}`;

	// Form data
	let formData = {
		project_name: '',
		project_description: '',
		case_study: '',
		permasalahan: '',
		hasil: [],
		daerah: '',
		project_start_date: '',
		project_end_date: '',
		project_url: '',
		url_youtube: '',
		image_url: '',
		is_featured: 0
	};
	
	// Available options from API
	let availableCategories = [];
	let availableTechnologies = [];
	let availableClients = [];
	let selectedCategories = [];
	let selectedTechnologies = [];
	let selectedClients = [];
	let clientDropdownValue = '';
	
	// Client modal state
	let isClientModalOpen = false;
	let clientModalMode = 'create';
	let editingClient = null;
	
	// Hasil items state
	let hasilInput = '';
	
	let loading = false;
	let submitting = false;
	let redirecting = false;
	let error = null;
	let success = false;
	let successMessage = '';

	// Image upload
	let imageFile = null;
	let imagePreview = '';

	// State preservation functions
	function saveFormState() {
		if (browser) {
			const state = {
				formData,
				selectedCategories,
				selectedTechnologies,
				selectedClients,
				imagePreview
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		}
	}

	function restoreFormState() {
		if (browser) {
			const savedState = localStorage.getItem(STORAGE_KEY);
			if (savedState) {
				try {
					const state = JSON.parse(savedState);
					formData = state.formData || formData;
					selectedCategories = state.selectedCategories || [];
					selectedTechnologies = state.selectedTechnologies || [];
					selectedClients = state.selectedClients || [];
					imagePreview = state.imagePreview || '';
					clearFormState();
				} catch (err) {
					console.error('Failed to restore form state:', err);
				}
			}
		}
	}

	function clearFormState() {
		if (browser) {
			localStorage.removeItem(STORAGE_KEY);
		}
	}

	function handleAddTechnology() {
		saveFormState();
		goto(`/dashboard/teknologi/create?returnTo=portfolio-edit&portfolioId=${portfolioId}`);
	}

	// Load data on mount
	onMount(async () => {
		await loadInitialData();
		
		// Check if returning from technology create
		const returnFrom = $page.url.searchParams.get('returnFrom');
		if (returnFrom === 'technology-create') {
			restoreFormState();
			// Reload technologies to include newly created one
			try {
				const technologiesData = await technologiesAPI.getAll();
				availableTechnologies = technologiesData;
			} catch (err) {
				console.error('Failed to reload technologies:', err);
			}
		}
	});

	// Load portfolio data and options
	async function loadInitialData() {
		loading = true;
		error = null;
		
			try {
			// Load portfolio, categories, technologies, and clients in parallel
			const [portfolioData, categoriesData, technologiesData, clientsData] = await Promise.all([
				portfolioAPI.getById(portfolioId),
				categoriesAPI.getAll(),
				technologiesAPI.getAll(),
				clientsAPI.getAll()
			]);
			
			// Set form data
			formData = {
				project_name: portfolioData.project_name || '',
				project_description: portfolioData.project_description || '',
				case_study: portfolioData.case_study || '',
				permasalahan: portfolioData.permasalahan || '',
				hasil: portfolioData.hasil ? JSON.parse(portfolioData.hasil) : [],
				daerah: portfolioData.daerah || '',
				project_start_date: portfolioData.project_start_date || '',
				project_end_date: portfolioData.project_end_date || '',
				project_url: portfolioData.project_url || '',
				url_youtube: portfolioData.url_youtube || '',
				image_url: portfolioData.image_url || '',
				is_featured: portfolioData.is_featured || 0
			};			// Set image preview if exists
			if (portfolioData.image_url) {
				imagePreview = `http://localhost:3001${portfolioData.image_url}`;
			}

			// Set available options
			
			availableCategories = categoriesData;
			availableTechnologies = technologiesData;
			availableClients = clientsData;			// Parse and set selected categories and technologies
			if (portfolioData.categories) {
				const categoryNames = portfolioData.categories.split(',');
				selectedCategories = availableCategories
					.filter(cat => categoryNames.includes(cat.category_name))
					.map(cat => cat.category_id);
			}

			if (portfolioData.technologies) {
				// Parse JSON string to get array of technology objects
				const techArray = typeof portfolioData.technologies === 'string' 
					? JSON.parse(portfolioData.technologies) 
					: portfolioData.technologies;
				
				// Extract tech IDs from the array
				selectedTechnologies = techArray.map(tech => tech.tech_id);
			}

			if (portfolioData.clients) {
				// Parse JSON string to get array of client objects
				const clientArray = typeof portfolioData.clients === 'string' 
					? JSON.parse(portfolioData.clients) 
					: portfolioData.clients;
				
				// Extract client IDs from the array
				selectedClients = clientArray.map(client => client.client_id);
			}

		} catch (err) {
			error = err.message;
			console.error('Failed to load portfolio data:', err);
		} finally {
			loading = false;
		}
	}

	// Handle image upload
	async function handleImageUpload(event) {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
			if (!allowedTypes.includes(file.type)) {
				error = 'Tipe file tidak valid. Hanya JPEG, PNG, GIF, dan WebP yang diperbolehkan.';
				return;
			}

			// Validate file size (max 5MB)
			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				error = 'Ukuran file terlalu besar. Maksimal 5MB.';
				return;
			}

			try {
				// Show preview immediately
				imageFile = file;
				const reader = new FileReader();
				reader.onload = (e) => {
					imagePreview = e.target.result;
				};
				reader.readAsDataURL(file);

				// Upload to server
				loading = true;
				const uploadResult = await uploadAPI.uploadPortfolioImage(file);
				
				// Store the server path in form data
				formData.image_url = uploadResult.path; // This will be saved to database
				
				loading = false;
				console.log('Upload successful:', uploadResult);
			} catch (err) {
				loading = false;
				error = `Upload gagal: ${err.message}`;
				imagePreview = '';
				imageFile = null;
				formData.image_url = '';
				console.error('Upload error:', err);
			}
		}
	}
	
	// Category management
	function toggleCategory(categoryId) {
		if (selectedCategories.includes(categoryId)) {
			selectedCategories = selectedCategories.filter(id => id !== categoryId);
		} else {
			selectedCategories = [...selectedCategories, categoryId];
		}
	}
	
	// Technology management
	function toggleTechnology(techId) {
		if (selectedTechnologies.includes(techId)) {
			selectedTechnologies = selectedTechnologies.filter(id => id !== techId);
		} else {
			selectedTechnologies = [...selectedTechnologies, techId];
		}
	}
	
	// Client management
	function toggleClient(clientId) {
		if (selectedClients.includes(clientId)) {
			selectedClients = selectedClients.filter(id => id !== clientId);
		} else {
			selectedClients = [...selectedClients, clientId];
		}
		clientDropdownValue = ''; // Reset dropdown
	}
	
	function openAddClientModal() {
		clientModalMode = 'create';
		editingClient = null;
		isClientModalOpen = true;
	}
	
	function openEditClientModal(client) {
		clientModalMode = 'edit';
		editingClient = client;
		isClientModalOpen = true;
	}
	
	async function handleClientSave() {
		isClientModalOpen = false;
		clientDropdownValue = ''; // Reset dropdown
		// Refresh clients list
		const clientsData = await clientsAPI.getAll();
		availableClients = clientsData.data;
	}
	
	async function handleDeleteClient(clientId) {
		if (!confirm('Apakah Anda yakin ingin menghapus client ini?')) {
			return;
		}
		
		try {
			await clientsAPI.delete(clientId);
			// Remove from selected if it was selected
			selectedClients = selectedClients.filter(id => id !== clientId);
			clientDropdownValue = ''; // Reset dropdown
			// Refresh clients list
			const clientsData = await clientsAPI.getAll();
			availableClients = clientsData.data;
		} catch (err) {
			error = err.message;
			console.error('Failed to delete client:', err);
		}
	}
	
	// Hasil management
	function addHasil() {
		if (hasilInput.trim()) {
			formData.hasil = [...formData.hasil, hasilInput.trim()];
			hasilInput = '';
		}
	}
	
	function removeHasil(index) {
		formData.hasil = formData.hasil.filter((_, i) => i !== index);
	}
	
	function handleHasilKeyPress(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addHasil();
		}
	}
	
	// Form submission
	async function handleSubmit(event) {
		event.preventDefault();
		
		// Prevent multiple submissions
		if (submitting) {
			return;
		}
		
		if (!formData.project_name.trim()) {
			error = 'Nama project harus diisi';
			return;
		}

		if (selectedCategories.length === 0) {
			error = 'Minimal pilih satu kategori';
			return;
		}

		if (selectedTechnologies.length === 0) {
			error = 'Minimal pilih satu teknologi';
			return;
		}

		if (selectedClients.length === 0) {
			error = 'Minimal pilih satu client';
			return;
		}

		submitting = true;
		error = null;

		try {
			// Prepare data with categories, technologies, and clients
			const submissionData = {
				...formData,
				hasil: JSON.stringify(formData.hasil), // Convert array to JSON string
				categories: selectedCategories,
				technologies: selectedTechnologies,
				clients: selectedClients
			};

			await portfolioAPI.update(portfolioId, submissionData);
			
			success = true;
			successMessage = 'Portfolio berhasil diperbarui!';
			redirecting = true;
			
			// Hide success message after 3 seconds and redirect
			setTimeout(() => {
				success = false;
				goto('/dashboard/portfolio');
			}, 3000);
		} catch (err) {
			error = err.message;
			console.error('Failed to update portfolio:', err);
		} finally {
			submitting = false;
		}
	}

	// Handle image preview
	function previewImage() {
		if (formData.image_url) {
			window.open(getImageUrl(formData.image_url), '_blank');
		}
	}

	// Get category name by ID
	function getCategoryName(categoryId) {
		const category = availableCategories.find(cat => cat.category_id === categoryId);
		return category ? category.category_name : 'Unknown';
	}

	// Get technology name by ID
	function getTechnologyName(techId) {
		const tech = availableTechnologies.find(tech => tech.tech_id === techId);
		return tech ? tech.tech_name : 'Unknown';
	}
	
	// Get client name by ID
	function getClientName(clientId) {
		const client = availableClients.find(client => client.client_id === clientId);
		return client ? client.client_name : 'Unknown';
	}
	
	// Extract YouTube video ID from URL
	function getYouTubeEmbedId(url) {
		if (!url) return null;
		
		try {
			const urlObj = new URL(url);
			
			// Handle youtube.com/watch?v=VIDEO_ID
			if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
				return urlObj.searchParams.get('v');
			}
			
			// Handle youtu.be/VIDEO_ID
			if (urlObj.hostname.includes('youtu.be')) {
				return urlObj.pathname.slice(1);
			}
			
			// Handle youtube.com/embed/VIDEO_ID
			if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.includes('/embed/')) {
				return urlObj.pathname.split('/embed/')[1];
			}
		} catch (e) {
			return null;
		}
		
		return null;
	}
</script>

<svelte:head>
	<title>Edit Portfolio - Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-4 mb-4">
				<button 
					onclick={() => goto('/dashboard/portfolio')}
					class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
				>
					<ArrowLeft class="w-5 h-5 text-gray-600" />
				</button>
				<div>
					<h1 class="text-3xl font-bold text-gray-900">Edit Portfolio</h1>
					<p class="text-gray-600 mt-1">Perbarui informasi portfolio perusahaan</p>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		{#if loading && !submitting}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<span class="ml-3 text-gray-600">Memuat data portfolio...</span>
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

			<!-- Loading Overlay -->
			{#if submitting}
				<div 
					class="fixed inset-0 flex items-center justify-center z-50"
					style="background-color: rgba(0, 0, 0, 0.5);"
				>
					<div class="bg-white rounded-lg p-6 flex items-center gap-4 shadow-xl">
						<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<div>
							<p class="text-lg font-medium text-gray-900">Memperbarui Portfolio...</p>
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
							<p class="text-lg font-medium text-gray-900">Portfolio Berhasil Diperbarui!</p>
							<p class="text-sm text-gray-500">Mengalihkan ke halaman portfolio...</p>
						</div>
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

			<form onsubmit={handleSubmit} class="space-y-8 {submitting || redirecting ? 'pointer-events-none opacity-75' : ''}">
				<!-- Basic Information -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="md:col-span-2">
							<label for="project_name" class="block text-sm font-medium text-gray-700 mb-2">
								Nama Project <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="project_name"
								bind:value={formData.project_name}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="Masukkan nama project"
								disabled={submitting}
							/>
						</div>
						
						<!-- Client Management -->
						<div>
							<label for="client" class="block text-sm font-medium text-gray-700 mb-2">
								Client <span class="text-red-500">*</span>
							</label>
							<div class="flex gap-2">
								<div class="flex-1 relative">
									<select
										id="client"
										bind:value={clientDropdownValue}
										class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
										onchange={(e) => {
											const clientId = parseInt(e.target.value);
											if (clientId && !selectedClients.includes(clientId)) {
												selectedClients = [...selectedClients, clientId];
											}
											clientDropdownValue = '';
										}}
										disabled={submitting}
									>
										<option value="">Pilih Client</option>
										{#each availableClients as client}
											<option value={client.client_id}>{client.client_name}</option>
										{/each}
									</select>
									<div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
										<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
										</svg>
									</div>
						</div>
						<button
							type="button"
							onclick={openAddClientModal}
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
							title="Tambah Client Baru"
							disabled={submitting}
						>
							<Plus class="w-4 h-4" />
							Add Client
						</button>
					</div>							{#if selectedClients.length > 0}
								<div class="mt-4">
									<p class="text-sm font-medium text-gray-700 mb-2">Client terpilih:</p>
									<div class="space-y-2">
										{#each selectedClients as clientId}
											{@const client = availableClients.find(c => c.client_id === clientId)}
											{#if client}
												<div class="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
													<div class="flex items-center gap-3">
														{#if client.client_logo}
															<img 
																src={getImageUrl(client.client_logo)} 
																alt={client.client_name}
																class="w-8 h-8 object-contain rounded"
															/>
														{/if}
														<span class="text-sm font-medium text-blue-900">{client.client_name}</span>
													</div>
													<div class="flex items-center gap-2">
														<button
															type="button"
															onclick={() => openEditClientModal(client)}
															class="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
															disabled={submitting}
															title="Edit Client"
														>
															<Edit class="w-4 h-4" />
														</button>
														{#if !client.portfolio_count || client.portfolio_count === 0}
															<button
																type="button"
																onclick={() => handleDeleteClient(client.client_id)}
																class="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
																disabled={submitting}
																title="Hapus Client"
															>
																<Trash2 class="w-4 h-4" />
															</button>
														{/if}
														<button
															type="button"
															onclick={() => toggleClient(clientId)}
															class="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
															disabled={submitting}
															title="Hapus dari pilihan"
														>
															<X class="w-4 h-4" />
														</button>
													</div>
												</div>
											{/if}
										{/each}
									</div>
								</div>
							{/if}
						</div>

						<div>
							<label for="daerah" class="block text-sm font-medium text-gray-700 mb-2">
								Daerah/Provinsi
							</label>
							<select
								id="daerah"
								bind:value={formData.daerah}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								disabled={submitting}
							>
								<option value="">Pilih Provinsi</option>
								{#each indonesianProvinces as province}
									<option value={province}>{province}</option>
								{/each}
							</select>
						</div>
						
						<div>
							<label for="project_url" class="block text-sm font-medium text-gray-700 mb-2">
								URL Project
							</label>
							<input
								type="url"
								id="project_url"
								bind:value={formData.project_url}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="https://project-demo.com"
								disabled={submitting}
							/>
						</div>
						
						<div class="md:col-span-2">
							<label for="url_youtube" class="block text-sm font-medium text-gray-700 mb-2">
								URL YouTube
							</label>
							<input
								type="url"
								id="url_youtube"
								bind:value={formData.url_youtube}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								placeholder="https://youtube.com/watch?v=..."
								disabled={submitting}
							/>
							<p class="text-sm text-gray-500 mt-1">Opsional - Link video YouTube tentang project</p>
							
							<!-- YouTube Preview -->
							{#if formData.url_youtube && getYouTubeEmbedId(formData.url_youtube)}
								<div class="mt-4 rounded-lg overflow-hidden border border-gray-200">
									<div class="bg-gray-100 px-3 py-2 border-b border-gray-200">
										<p class="text-sm font-medium text-gray-700">Preview YouTube</p>
									</div>
									<div class="relative" style="padding-bottom: 56.25%; height: 0;">
										<iframe
											src="https://www.youtube.com/embed/{getYouTubeEmbedId(formData.url_youtube)}"
											title="YouTube video preview"
											frameborder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowfullscreen
											class="absolute top-0 left-0 w-full h-full"
										></iframe>
									</div>
								</div>
							{:else if formData.url_youtube}
								<div class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
									<p class="text-sm text-yellow-800">URL YouTube tidak valid. Gunakan format: https://youtube.com/watch?v=... atau https://youtu.be/...</p>
								</div>
							{/if}
						</div>
						
						<div>
							<label for="project_start_date" class="block text-sm font-medium text-gray-700 mb-2">
								Tanggal Mulai <span class="text-red-500">*</span>
							</label>
							<input
								type="date"
								id="project_start_date"
								bind:value={formData.project_start_date}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								disabled={submitting}
							/>
						</div>
						
						<div>
							<label for="project_end_date" class="block text-sm font-medium text-gray-700 mb-2">
								Tanggal Selesai <span class="text-red-500">*</span>
							</label>
							<input
								type="date"
								id="project_end_date"
								bind:value={formData.project_end_date}
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								disabled={submitting}
							/>
						</div>
						
						<div class="md:col-span-2">
							<label for="project_description" class="block text-sm font-medium text-gray-700 mb-2">
								Deskripsi Singkat <span class="text-red-500">*</span>
							</label>
							<textarea
								id="project_description"
								bind:value={formData.project_description}
								rows="4"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
								placeholder="Masukkan deskripsi singkat project"
								disabled={submitting}
							></textarea>
						</div>
						
						<div class="md:col-span-2">
							<label for="case_study" class="block text-sm font-medium text-gray-700 mb-2">
								Case Study Detail
							</label>
							<textarea
								id="case_study"
								bind:value={formData.case_study}
								rows="6"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
								placeholder="Masukkan detail case study project (opsional)"
								disabled={submitting}
							></textarea>
						</div>
						
						<!-- Permasalahan -->
						<div class="md:col-span-2">
							<label for="permasalahan" class="block text-sm font-medium text-gray-700 mb-2">
								Permasalahan
							</label>
							<textarea
								id="permasalahan"
								bind:value={formData.permasalahan}
								rows="4"
								class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
								placeholder="Jelaskan permasalahan yang dihadapi client sebelum menggunakan solusi ini..."
								disabled={submitting}
							></textarea>
							<p class="text-sm text-gray-500 mt-1">Opsional - Deskripsi masalah yang dihadapi client</p>
						</div>
						
						<!-- Hasil (List) -->
						<div class="md:col-span-2">
							<label class="block text-sm font-medium text-gray-700 mb-2">
								Hasil & Pencapaian
							</label>
							<div class="space-y-3">
								<!-- Input untuk menambah hasil -->
								<div class="flex gap-2">
									<input
										type="text"
										bind:value={hasilInput}
										onkeypress={handleHasilKeyPress}
										placeholder="Masukkan hasil yang dicapai (tekan Enter untuk menambah)"
										class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
										disabled={submitting}
									/>
									<button
										type="button"
										onclick={addHasil}
										disabled={submitting}
										class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<Plus class="w-4 h-4" />
									</button>
								</div>
								
								<!-- List hasil yang sudah ditambahkan -->
								{#if formData.hasil.length > 0}
									<div class="bg-gray-50 rounded-lg p-4 space-y-2">
										<p class="text-sm font-medium text-gray-700 mb-2">Daftar Hasil:</p>
										{#each formData.hasil as hasil, index}
											<div class="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-200">
												<span class="text-sm text-gray-700 flex-1">{index + 1}. {hasil}</span>
												<button
													type="button"
													onclick={() => removeHasil(index)}
													disabled={submitting}
													class="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
													title="Hapus"
												>
													<X class="w-4 h-4" />
												</button>
											</div>
										{/each}
									</div>
								{:else}
									<p class="text-sm text-gray-500 italic">Belum ada hasil yang ditambahkan</p>
								{/if}
							</div>
							<p class="text-sm text-gray-500 mt-1">Opsional - Tambahkan hasil-hasil yang dicapai dari project ini</p>
						</div>
					</div>
				</div>

				<!-- Image Upload -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Gambar Project</h2>
					
					<div class="space-y-4">
						<div class="flex items-center justify-center w-full">
							<label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
								{#if imagePreview}
									<img src={imagePreview} alt="Preview" class="w-full h-full object-cover rounded-lg" />
								{:else}
									<div class="flex flex-col items-center justify-center pt-5 pb-6">
										<ImageIcon class="w-8 h-8 mb-4 text-gray-500" />
										<p class="mb-2 text-sm text-gray-500">
											<span class="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p class="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
									</div>
								{/if}
								<input type="file" accept="image/*" class="hidden" onchange={handleImageUpload} disabled={submitting} />
							</label>
						</div>
						
						{#if imagePreview}
							<button
								type="button"
								onclick={async () => {
									// Delete file from server if it was uploaded
									if (formData.image_url && formData.image_url.startsWith('/uploads/')) {
										try {
											const filename = formData.image_url.split('/').pop();
											await uploadAPI.deletePortfolioImage(filename);
										} catch (err) {
											console.error('Failed to delete image from server:', err);
										}
									}
									
									imagePreview = '';
									imageFile = null;
									formData.image_url = '';
								}}
								class="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700"
								disabled={submitting}
							>
								<X class="w-4 h-4" />
								Hapus Gambar
							</button>
						{/if}
					</div>
				</div>

				<!-- Categories Selection -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Kategori Project</h2>
					
					<div class="space-y-4">
						{#each availableCategories as category}
							<label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {selectedCategories.includes(category.category_id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
								<input
									type="checkbox"
									checked={selectedCategories.includes(category.category_id)}
									onchange={() => toggleCategory(category.category_id)}
									class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									disabled={submitting}
								/>
								<span class="ml-3 text-sm font-medium text-gray-700">{category.category_name}</span>
							</label>
						{/each}
						
						{#if selectedCategories.length > 0}
							<div class="mt-4">
								<p class="text-sm font-medium text-gray-700 mb-2">Kategori terpilih:</p>
								<div class="flex flex-wrap gap-2">
									{#each selectedCategories as categoryId}
										<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
											{getCategoryName(categoryId)}
											<button
												type="button"
												onclick={() => toggleCategory(categoryId)}
												class="ml-2 text-blue-600 hover:text-blue-800"
												disabled={submitting}
											>
												<X class="w-3 h-3" />
											</button>
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Technologies Selection -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div class="flex justify-between items-center mb-6">
						<h2 class="text-xl font-semibold text-gray-900">Teknologi yang Digunakan</h2>
						<button
							type="button"
							onclick={handleAddTechnology}
							class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
							title="Tambah Teknologi Baru"
						>
							<Plus class="w-4 h-4" />
							Add Technology
						</button>
					</div>
					
					<div class="space-y-4">
						{#each availableTechnologies as tech}
							<label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 {selectedTechnologies.includes(tech.tech_id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
								<input
									type="checkbox"
									checked={selectedTechnologies.includes(tech.tech_id)}
									onchange={() => toggleTechnology(tech.tech_id)}
									class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
									disabled={submitting}
								/>
								<div class="ml-3">
									<span class="text-sm font-medium text-gray-700">{tech.tech_name}</span>
								</div>
							</label>
						{/each}

						{#if selectedTechnologies.length > 0}
							<div class="mt-4">
								<p class="text-sm font-medium text-gray-700 mb-2">Teknologi terpilih:</p>
								<div class="flex flex-wrap gap-2">
									{#each selectedTechnologies as techId}
										<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
											{getTechnologyName(techId)}
											<button
												type="button"
												onclick={() => toggleTechnology(techId)}
												class="ml-2 text-green-600 hover:text-green-800"
												disabled={submitting}
											>
												<X class="w-3 h-3" />
											</button>
										</span>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Featured Status -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-6">Status Portfolio</h2>
					
					<div class="space-y-4">
						<label class="block text-sm font-medium text-gray-700 mb-3">Status Featured</label>
						<div class="space-y-3">
							<label class="inline-flex items-center">
								<input
									type="radio"
									bind:group={formData.is_featured}
									value={1}
									class="form-radio h-4 w-4 text-blue-600"
									disabled={submitting}
								/>
								<span class="ml-2 text-sm text-gray-700">Featured (akan ditampilkan secara prioritas)</span>
							</label>
							<label class="inline-flex items-center">
								<input
									type="radio"
									bind:group={formData.is_featured}
									value={0}
									class="form-radio h-4 w-4 text-blue-600"
									disabled={submitting}
								/>
								<span class="ml-2 text-sm text-gray-700">Normal</span>
							</label>
						</div>
						<p class="text-xs text-gray-500 mt-1">Portfolio featured akan ditampilkan secara prioritas</p>
					</div>

					<!-- URLs Section -->
					<div class="pt-4 border-t border-gray-200">
						<h3 class="text-lg font-medium text-gray-900 mb-4">URLs & Media</h3>
						
						<div class="space-y-4">
							<div>
								<label for="image_url" class="block text-sm font-medium text-gray-700 mb-2">
									Path Gambar Project
								</label>
								<div class="flex rounded-lg shadow-sm">
									<input
										type="text"
										id="image_url"
										bind:value={formData.image_url}
										class="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
										placeholder="/uploads/portfolio/image.jpg"
										readonly
										disabled={submitting}
									/>
									{#if formData.image_url}
										<button
											type="button"
											onclick={previewImage}
											class="inline-flex items-center px-3 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
											disabled={submitting}
										>
											<Eye class="w-4 h-4" />
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 justify-end">
					<button
						type="button"
						onclick={() => goto('/dashboard/portfolio')}
						class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						disabled={submitting}
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={submitting || redirecting || !formData.project_name.trim()}
						class="inline-flex items-center px-6 py-3 border border-transparent text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if submitting}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							Memperbarui...
						{:else if redirecting}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
							Mengalihkan...
						{:else}
							<Save class="w-4 h-4 mr-2" />
							Perbarui Portfolio
						{/if}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>

<!-- Client Modal -->
<ClientModal 
	bind:isOpen={isClientModalOpen}
	mode={clientModalMode}
	clientData={editingClient}
	on:save={handleClientSave}
	on:close={() => isClientModalOpen = false}
/>