<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { ArrowLeft, Save, X, Image as ImageIcon } from 'lucide-svelte';
  import { technologiesAPI, uploadAPI } from '$lib/api.js';

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
  const BASE_URL = API_BASE.replace('/api', '');

  let id = null;
  let isSubmitting = false;
  let errors = {};

  let formData = {
    tech_name: '',
    tech_type: '',
    tech_description: '',
    official_url: '',
    icon_url: '',
    logo_url: '',
    is_active: true,
    sort_order: 1
  };

  let techTypes = [
    'Frontend Framework',
    'Backend Framework',
    'Backend Runtime',
    'Database',
    'CSS Framework',
    'Programming Language',
    'Mobile Framework',
    'Cloud Service',
    'DevOps Tool',
    'Design Tool',
    'Testing Framework',
    'Build Tool',
    'Package Manager',
    'API Tool',
    'Monitoring Tool'
  ];

  let logoFile = null;
  let logoPreview = '';
  let iconFile = null;
  let iconPreview = '';
  let customType = '';
  let showCustomType = false;

  function isValidUrl(string) {
    try { new URL(string); return true; } catch(_) { return false; }
  }

  function validateForm() {
    errors = {};
    if (!formData.tech_name.trim()) errors.tech_name = 'Nama teknologi wajib diisi';
    if (!formData.tech_type.trim() && !customType.trim()) errors.tech_type = 'Tipe teknologi wajib dipilih';
    if (!formData.tech_description.trim()) errors.tech_description = 'Deskripsi teknologi wajib diisi';
    if (formData.official_url && !isValidUrl(formData.official_url)) errors.official_url = 'URL tidak valid';
    if (formData.sort_order < 1) errors.sort_order = 'Urutan harus minimal 1';
    return Object.keys(errors).length === 0;
  }

  function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
      logoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => { logoPreview = e.target.result; formData.logo_url = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  function handleIconUpload(event) {
    const file = event.target.files[0];
    if (file) {
      iconFile = file;
      const reader = new FileReader();
      reader.onload = (e) => { iconPreview = e.target.result; formData.icon_url = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  function removeLogo() { logoFile = null; logoPreview = ''; formData.logo_url = ''; }
  function removeIcon() { iconFile = null; iconPreview = ''; formData.icon_url = ''; }

  function handleTypeChange() {
    if (formData.tech_type === 'custom') { showCustomType = true; }
    else { showCustomType = false; customType = ''; }
  }

  onMount(async () => {
    const p = get(page);
    id = p.params.id;
    if (!id) return;

    try {
      const tech = await technologiesAPI.getById(id);
      if (!tech) return;
      formData.tech_name = tech.tech_name || '';
      formData.tech_type = tech.tech_type || '';
      formData.tech_description = tech.tech_description || '';
      formData.official_url = tech.official_url || '';
      formData.icon_url = tech.icon_url || '';
      formData.logo_url = tech.logo_url || '';
      formData.is_active = tech.is_active ? true : false;
      formData.sort_order = tech.sort_order || 1;

      // set previews if existing paths
      if (tech.icon_url) {
        iconPreview = tech.icon_url.startsWith('http') ? tech.icon_url : `${BASE_URL}${tech.icon_url}`;
      }
      if (tech.logo_url) {
        logoPreview = tech.logo_url.startsWith('http') ? tech.logo_url : `${BASE_URL}${tech.logo_url}`;
      }

      // if tech_type not in list, treat as custom
      if (tech.tech_type && !techTypes.includes(tech.tech_type)) {
        showCustomType = true;
        customType = tech.tech_type;
        formData.tech_type = 'custom';
      }
    } catch (err) {
      console.error('Failed to load technology:', err);
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();

    if (showCustomType && customType.trim()) formData.tech_type = customType.trim();
    if (!validateForm()) return;

    isSubmitting = true;
    try {
      if (iconFile) {
        const res = await uploadAPI.uploadTechnologyImage(iconFile);
        if (res && res.path) formData.icon_url = res.path;
      }
      if (logoFile) {
        const res = await uploadAPI.uploadTechnologyImage(logoFile);
        if (res && res.path) formData.logo_url = res.path;
      }

      await technologiesAPI.update(id, { ...formData, is_active: formData.is_active ? 1 : 0 });
      goto('/dashboard/teknologi');
    } catch (err) {
      console.error('Failed to update:', err);
      errors.general = err.message || 'Gagal memperbarui teknologi';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Edit Teknologi - Dashboard Kahasolusi</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-4">
        <button onclick={() => goto('/dashboard/teknologi')} class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Edit Teknologi</h1>
          <p class="text-gray-600 mt-1">Ubah informasi teknologi</p>
        </div>
      </div>
    </div>

  <form onsubmit={handleSubmit} class="space-y-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Teknologi <span class="text-red-500">*</span></label>
            <input type="text" bind:value={formData.tech_name} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: React, Node.js" />
            {#if errors.tech_name}<p class="text-red-500 text-sm mt-1">{errors.tech_name}</p>{/if}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipe Teknologi <span class="text-red-500">*</span></label>
            <select bind:value={formData.tech_type} onchange={handleTypeChange} class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none">
              <option value="">Pilih tipe teknologi</option>
              {#each techTypes as type}<option value={type}>{type}</option>{/each}
              <option value="custom">Custom Type...</option>
            </select>
            {#if errors.tech_type}<p class="text-red-500 text-sm mt-1">{errors.tech_type}</p>{/if}
          </div>

          {#if showCustomType}
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Custom Type <span class="text-red-500">*</span></label>
              <input type="text" bind:value={customType} class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Masukkan tipe custom" />
            </div>
          {/if}

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Official Website</label>
            <input type="url" bind:value={formData.official_url} class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" placeholder="https://example.com" />
            {#if errors.official_url}<p class="text-red-500 text-sm mt-1">{errors.official_url}</p>{/if}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Urutan Tampilan</label>
            <input type="number" bind:value={formData.sort_order} min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" />
            {#if errors.sort_order}<p class="text-red-500 text-sm mt-1">{errors.sort_order}</p>{/if}
            <p class="text-sm text-gray-500 mt-1">Teknologi dengan urutan lebih kecil akan ditampilkan lebih dulu</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Deskripsi</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi Teknologi <span class="text-red-500">*</span></label>
          <textarea bind:value={formData.tech_description} rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none" placeholder="Jelaskan tentang teknologi ini"></textarea>
          {#if errors.tech_description}<p class="text-red-500 text-sm mt-1">{errors.tech_description}</p>{/if}
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Visual Assets</h2>
        <div class="max-w-md mx-auto">
          <!-- Icon Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-4">Icon Teknologi (Rekomendasi: 48x48px, SVG/PNG)</label>
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {#if iconPreview}
                  <div class="relative">
                    <img src={iconPreview} alt="Icon Preview" class="w-12 h-12 object-contain" />
                    <button type="button" onclick={(e) => { e.preventDefault(); removeIcon(); }} class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"><X class="w-3 h-3" /></button>
                  </div>
                {:else}
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon class="w-8 h-8 mb-2 text-gray-500" />
                    <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload icon</span></p>
                    <p class="text-xs text-gray-500">SVG, PNG, JPG (MAX. 48x48px)</p>
                  </div>
                {/if}
                <input type="file" accept="image/*" class="hidden" onchange={handleIconUpload} />
              </label>
            </div>
          </div>

          <!-- Logo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-4">Logo Teknologi (Rekomendasi: 200x100px, PNG/SVG)</label>
            <div class="space-y-4">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {#if logoPreview}
                    <div class="relative">
                      <img src={logoPreview} alt="Logo Preview" class="max-w-32 max-h-16 object-contain" />
                      <button type="button" onclick={(e) => { e.preventDefault(); removeLogo(); }} class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"><X class="w-3 h-3" /></button>
                    </div>
                  {:else}
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon class="w-8 h-8 mb-2 text-gray-500" />
                      <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload logo</span></p>
                      <p class="text-xs text-gray-500">SVG, PNG, JPG (MAX. 200x100px)</p>
                    </div>
                  {/if}
                  <input type="file" accept="image/*" class="hidden" onchange={handleLogoUpload} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Pengaturan</h2>
        <div class="space-y-4">
          <label class="flex items-center">
            <input type="checkbox" bind:checked={formData.is_active} class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <span class="ml-3 text-sm font-medium text-gray-700">Status Active</span>
            <p class="ml-2 text-xs text-gray-500">(Teknologi akan ditampilkan di website)</p>
          </label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-end">
        <button type="button" onclick={() => goto('/dashboard/teknologi')} class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
        <button type="submit" disabled={isSubmitting} class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {#if isSubmitting}<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Updating...{:else}<Save class="w-4 h-4" />Simpan Perubahan{/if}
        </button>
      </div>
    </form>
  </div>
</div>
