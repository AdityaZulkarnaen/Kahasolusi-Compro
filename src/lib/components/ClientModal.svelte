<script>
	import { createEventDispatcher } from 'svelte';
	import { X, Upload } from 'lucide-svelte';
	import { clientsAPI, uploadAPI } from '$lib/api.js';

	export let isOpen = false;
	export let mode = 'create';
	export let clientData = null;

	const dispatch = createEventDispatcher();

	let formData = {
		client_name: '',
		client_logo: ''
	};

	let logoFile = null;
	let logoPreview = '';
	let isSubmitting = false;
	let error = null;
	let uploadingLogo = false;

	$: if (isOpen && clientData && mode === 'edit') {
		formData = {
			client_name: clientData.client_name || '',
			client_logo: clientData.client_logo || ''
		};
		logoPreview = clientData.client_logo ? `http://localhost:3001${clientData.client_logo}` : '';
	} else if (isOpen && mode === 'create') {
		resetForm();
	}

	function resetForm() {
		formData = {
			client_name: '',
			client_logo: ''
		};
		logoFile = null;
		logoPreview = '';
		error = null;
	}

	function closeModal() {
		isOpen = false;
		resetForm();
		dispatch('close');
	}

	async function handleLogoUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
			if (!allowedTypes.includes(file.type)) {
				error = 'Tipe file tidak valid. Hanya JPEG, PNG, GIF, WebP, dan SVG yang diperbolehkan.';
				return;
			}

			const maxSize = 2 * 1024 * 1024;
			if (file.size > maxSize) {
				error = 'Ukuran file terlalu besar. Maksimal 2MB.';
				return;
			}

			try {
				logoFile = file;
				const reader = new FileReader();
				reader.onload = (e) => {
					logoPreview = e.target.result;
				};
				reader.readAsDataURL(file);

				uploadingLogo = true;
				const uploadResult = await uploadAPI.uploadClientLogo(file);
				formData.client_logo = uploadResult.path;
				uploadingLogo = false;
			} catch (err) {
				uploadingLogo = false;
				error = `Upload gagal: ${err.message}`;
				logoPreview = '';
				logoFile = null;
				formData.client_logo = '';
			}
		}
	}

	async function handleSubmit() {
		if (!formData.client_name.trim()) {
			error = 'Nama client wajib diisi';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			if (mode === 'create') {
				await clientsAPI.create(formData);
			} else {
				await clientsAPI.update(clientData.client_id, formData);
			}

			dispatch('save');
			closeModal();
		} catch (err) {
			error = err.message;
		} finally {
			isSubmitting = false;
		}
	}

	async function removeLogo() {
		if (formData.client_logo && formData.client_logo.startsWith('/uploads/')) {
			try {
				const filename = formData.client_logo.split('/').pop();
				await uploadAPI.deleteClientLogo(filename);
			} catch (err) {
				console.error('Failed to delete logo from server:', err);
			}
		}

		logoPreview = '';
		logoFile = null;
		formData.client_logo = '';
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div 
		class="fixed inset-0 flex items-center justify-center z-50 p-4"
		style="background-color: rgba(0, 0, 0, 0.5);"
		on:click={(e) => e.target === e.currentTarget && closeModal()}
		on:keydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
			<!-- Modal Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h3 class="text-lg font-semibold text-gray-900">
					{mode === 'create' ? 'Tambah Client Baru' : 'Edit Client'}
				</h3>
				<button 
					on:click={closeModal}
					class="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Modal Body -->
			<form on:submit|preventDefault={handleSubmit} class="p-6 space-y-4">
				{#if error}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<p class="text-sm text-red-800">{error}</p>
					</div>
				{/if}

				<div>
					<label for="client_name" class="block text-sm font-medium text-gray-700 mb-2">
						Nama Client <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="client_name"
						bind:value={formData.client_name}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
						placeholder="Masukkan nama client"
						disabled={isSubmitting}
						required
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Logo Client
					</label>
					
					{#if logoPreview}
						<div class="mb-3">
							<div class="relative inline-block">
								<img 
									src={logoPreview} 
									alt="Logo preview" 
									class="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-white p-2"
								/>
								<button
									type="button"
									on:click={removeLogo}
									class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
									disabled={isSubmitting || uploadingLogo}
								>
									<X class="w-4 h-4" />
								</button>
							</div>
						</div>
					{/if}

					<div class="flex items-center gap-3">
						<label class="cursor-pointer">
							<input
								type="file"
								accept="image/*"
								on:change={handleLogoUpload}
								class="hidden"
								disabled={isSubmitting || uploadingLogo}
							/>
							<span class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
								<Upload class="w-4 h-4 mr-2" />
								{logoPreview ? 'Ganti Logo' : 'Upload Logo'}
							</span>
						</label>
						<span class="text-xs text-gray-500">Max 2MB (PNG, JPG, SVG)</span>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						on:click={closeModal}
						class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
						disabled={isSubmitting}
					>
						Batal
					</button>
					<button
						type="submit"
						disabled={isSubmitting || uploadingLogo}
						class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if isSubmitting}
							<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							Menyimpan...
						{:else}
							Simpan
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
