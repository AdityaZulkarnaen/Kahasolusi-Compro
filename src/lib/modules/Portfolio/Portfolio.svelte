<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import IndonesiaMap from '$lib/components/IndonesiaMap.svelte';
    import ClientExample from '$lib/assets/images/client_example.png';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { feedbackAPI, portfolioAPI, categoriesAPI } from '$lib/api.js';
    
    // Filter state
    let selectedFilter = $state('pemerintah');
    
    // Pagination state
    let currentPage = $state(1);
    const itemsPerPage = 8;
    
    // Data state
    let portfolios = $state([]);
    let categories = $state([]);
    let feedbacks = $state([]);
    let portfolioStats = $state([]);
    let loading = $state(true);
    let error = $state('');
    
    // Feedback form state
    let feedbackForm = $state({
        visitor_name: '',
        visitor_email: '',
        company_name: '',
        message: '',
        hide_name: false
    });
    let submitting = $state(false);
    let submitSuccess = $state(false);
    let submitError = $state('');
    
    // Testimonial state
    let currentTestimonialSet = $state(0);
    
    // Derived testimonials from database (group by 3)
    let testimonialSets = $derived(() => {
        const displayed = feedbacks.filter(f => f.is_displayed === 1 || f.is_displayed === true);
        const sets = [];
        for (let i = 0; i < displayed.length; i += 3) {
            sets.push(displayed.slice(i, i + 3));
        }
        return sets.length > 0 ? sets : [[]];
    });
    
    let currentTestimonials = $derived(testimonialSets()[currentTestimonialSet] || []);
    
    // Filtered projects 
    let filteredProjects = $derived(
        portfolios.filter(project => {
            if (!project.categories) return false;
            return project.categories.toLowerCase().includes(selectedFilter.toLowerCase());
        })
    );
    
    let totalPages = $derived(Math.ceil(filteredProjects.length / itemsPerPage));
    let startIndex = $derived((currentPage - 1) * itemsPerPage);
    let endIndex = $derived(startIndex + itemsPerPage);
    let paginatedProjects = $derived(filteredProjects.slice(startIndex, endIndex));
    
    // Load data on mount
    onMount(async () => {
        await loadData();
    });
    
    async function loadData() {
        loading = true;
        error = '';
        try {
            const [portfolioData, categoryData, feedbackResponse, statsData] = await Promise.all([
                portfolioAPI.getAll().catch(err => {
                    console.error('Failed to load portfolios:', err);
                    return [];
                }),
                categoriesAPI.getAll().catch(err => {
                    console.error('Failed to load categories:', err);
                    return [];
                }),
                feedbackAPI.get().catch(err => {
                    console.error('Failed to load feedbacks:', err);
                    return { data: [] };
                }),
                portfolioAPI.getByProvinces().catch(err => {
                    console.error('Failed to load portfolio stats:', err);
                    return [];
                })
            ]);
            
            portfolios = Array.isArray(portfolioData) ? portfolioData : [];
            categories = Array.isArray(categoryData) ? categoryData : [];
            feedbacks = Array.isArray(feedbackResponse.data) ? feedbackResponse.data : [];
            portfolioStats = Array.isArray(statsData) ? statsData : [];
            
            console.log('✅ Loaded portfolios:', portfolios.length);
            console.log('✅ Loaded categories:', categories.length);
            console.log('✅ Loaded feedbacks:', feedbacks.length);
            console.log('📊 Portfolio stats by provinces:', portfolioStats);
            console.log('Displayed feedbacks:', feedbacks.filter(f => f.is_displayed === 1 || f.is_displayed === true));
            
            // Set default filter to first category or 'pemerintah'
            if (categories.length > 0) {
                const defaultCategory = categories.find(cat => 
                    cat.category_name.toLowerCase() === 'pemerintah'
                );
                if (defaultCategory) {
                    selectedFilter = defaultCategory.category_name.toLowerCase();
                } else {
                    selectedFilter = categories[0].category_name.toLowerCase();
                }
            }
        } catch (err) {
            console.error('Failed to load data:', err);
            error = 'Gagal memuat data portfolio. Silakan coba lagi.';
        } finally {
            loading = false;
        }
    }
    
    function setFilter(filter) {
        selectedFilter = filter;
        currentPage = 1; 
    }
    
    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }
    
    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
        }
    }
    
    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
        }
    }
    
    function setTestimonialSet(index) {
        currentTestimonialSet = index;
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Validate form
        if (!feedbackForm.visitor_name || !feedbackForm.visitor_email || !feedbackForm.message) {
            submitError = 'Mohon lengkapi semua field yang wajib diisi.';
            submitSuccess = false;
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(feedbackForm.visitor_email)) {
            submitError = 'Format email tidak valid.';
            submitSuccess = false;
            return;
        }

        submitting = true;
        submitError = '';
        submitSuccess = false;

        try {
            // Prepare data for API
            const feedbackData = {
                visitor_name: feedbackForm.hide_name ? 'Anonymous' : feedbackForm.visitor_name.trim(),
                visitor_email: feedbackForm.visitor_email.trim(),
                company_name: feedbackForm.company_name.trim() || null,
                message: feedbackForm.message.trim(),
                is_displayed: 1, // Always display, name is already anonymized if needed
                is_read: 0 // Default unread
            };

            // Submit to API
            const result = await feedbackAPI.create(feedbackData);

            if (result && result.data) {
                submitSuccess = true;
                submitError = '';
                
                // Reset form
                feedbackForm = {
                    visitor_name: '',
                    visitor_email: '',
                    company_name: '',
                    message: '',
                    hide_name: false
                };

                // Scroll to success message
                setTimeout(() => {
                    const successElement = document.getElementById('feedback-success');
                    if (successElement) {
                        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            submitError = error.message || 'Terjadi kesalahan saat mengirim feedback. Silakan coba lagi.';
            submitSuccess = false;
        } finally {
            submitting = false;
        }
    }
</script>

<!-- Portfolio Container -->
<div class="relative bg-white min-h-screen">
    <section class="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
            <div class="mb-16">
                <h1 class="text-4xl md:text-5xl font-medium font-family-sans text-gray-900 mb-4">
                    Portfolio Proyek.
                </h1>
                <div class="w-64 h-1 bg-[#176684] mx-auto mb-6"></div>
            </div>
            
            <!-- Indonesia Map with Leaflet -->
            <div class="relative max-w-6xl mx-auto mb-12" style="z-index: 1;">
                <IndonesiaMap portfolioStats={portfolioStats} />
            </div>
        </div>
    </section>
    
    <!-- Filter Section -->
    <section class="relative px-4 sm:px-6 lg:px-8 pb-16">
        <div class="max-w-7xl mx-auto">
            {#if loading}
                <!-- Loading skeleton for filters -->
                <div class="flex flex-wrap justify-center gap-4 mb-16">
                    {#each Array(3) as _}
                        <div class="h-12 w-[140px] bg-gray-200 rounded-lg animate-pulse"></div>
                    {/each}
                </div>
            {:else if error}
                <div class="text-center text-red-600 mb-16">
                    <p>{error}</p>
                </div>
            {:else}
                <div class="flex flex-wrap justify-center gap-4 mb-16">
                    {#each categories as category (category.category_id)}
                        <button
                            class="px-8 py-3 rounded-lg font-medium font-family-sans transition-all duration-300 min-w-[140px] text-sm
                                   {selectedFilter === category.category_name.toLowerCase() 
                                     ? 'bg-[#0D4E6D] text-white shadow-md' 
                                     : 'bg-[#A5BCC7] text-[#0D4E6D] hover:bg-[#96b1be] border border-[#0D4E6D]'}"
                            onclick={() => setFilter(category.category_name.toLowerCase())}
                        >
                            {category.category_name}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </section>
    
    <!-- Projects Grid Section -->
    <section class="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div class="max-w-7xl mx-auto">
            {#if loading}
                <!-- Loading skeleton for projects -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-12">
                    {#each Array(8) as _}
                        <div class="w-full max-w-sm">
                            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                                <div class="h-48 bg-gray-200 animate-pulse"></div>
                                <div class="p-6 space-y-3">
                                    <div class="h-6 bg-gray-200 rounded animate-pulse"></div>
                                    <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else if paginatedProjects.length === 0}
                <div class="text-center py-20">
                    <p class="text-gray-500 text-lg">Tidak ada project untuk kategori ini.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {#each paginatedProjects as project (project.portfolio_id)}
                        <div in:fade={{ duration: 300, delay: 100 }} class="h-full flex">
                            <ProjectCard project={{
                                id: project.portfolio_id,
                                title: project.project_name,
                                description: project.project_description,
                                category: project.categories ? project.categories.split(',')[0] : '',
                                image: project.image_url ? `http://localhost:3001${project.image_url}` : '/images/project_example.png',
                                link: project.project_url || '#',
                                client: project.client_name,
                                technologies: (() => {
                                    try {
                                        const techs = project.technologies ? JSON.parse(project.technologies) : [];
                                        return techs.map(tech => ({
                                            name: tech.tech_name,
                                            image: tech.icon_url ? `http://localhost:3001${tech.icon_url}` : (tech.logo_url ? `http://localhost:3001${tech.logo_url}` : null)
                                        }));
                                    } catch (e) {
                                        console.error('Error parsing technologies:', e);
                                        return [];
                                    }
                                })(),
                                problems: project.permasalahan ? [project.permasalahan] : [],
                                results: (() => {
                                    try {
                                        return project.hasil ? JSON.parse(project.hasil) : [];
                                    } catch (e) {
                                        console.error('Error parsing hasil:', e);
                                        return [];
                                    }
                                })(),
                                images: project.image_url ? [{ url: `http://localhost:3001${project.image_url}`, alt: project.project_name }] : []
                            }} />
                        </div>
                    {/each}
                </div>
            {/if}
            
            {#if !loading && filteredProjects.length > itemsPerPage}
                <div class="hidden sm:flex justify-center items-center gap-2 mt-8">
                    <button
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
                        onclick={prevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft class="w-5 h-5" />
                    </button>
                    
                    {#each Array(totalPages) as _, index}
                        {@const pageNumber = index + 1}
                        <button
                            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium font-family-sans transition-all duration-200
                                   {currentPage === pageNumber 
                                     ? 'bg-[#0D4E6D] text-white' 
                                     : 'border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white'}"
                            onclick={() => goToPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    {/each}
                    
                    <button
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
                        onclick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight class="w-5 h-5" />
                    </button>
                </div>
            {/if}
        </div>
    </section>
    
    <!-- Client Section -->
    <section class="relative bg-[#A5BCC7] py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl font-medium text-[#0D4E6D] font-family-sans">
                    Telah dipercaya lebih dari 20+ klien di seluruh Indonesia
                </h2>
            </div>
            
            <div class="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6 items-center justify-items-center mb-16">
                {#each Array(24) as _, index}
                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg shadow-sm flex items-center justify-center p-2">
                        <img 
                            src={ClientExample} 
                            alt="Client {index + 1}" 
                            class="w-full h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-200"
                        />
                    </div>
                {/each}
            </div>
        </div>
    </section>
    
    <!-- Testimonial Section -->
    <section class="relative bg-[#D7EDF5] py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl sm:text-4xl font-medium text-[#000] font-family-sans">
                    Mereka yang Telah <span class="text-[#176684] font-semibold">Mempercayai</span> Kahasolusi
                </h2>
            </div>
            
            <!-- Testimonial Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {#each currentTestimonials as testimonial, index (testimonial.feedback_id)}
                    <div class="bg-white rounded-xl p-6 shadow-lg relative flex flex-col" in:fade={{ duration: 300, delay: index * 100 }}>
                        <!-- Quote Icon - dengan radius yang lebih rounded -->
                        <div class="absolute top-4 left-4 w-10 h-10 bg-[#176684] rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609v3.441c-2.984.448-4.983 2.598-4.983 5.167v2.012h4.983v7.391h-8.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609v3.441c-3.001.448-5 2.598-5 5.167v2.012h5v7.391h-9z"/>
                            </svg>
                        </div>
                        
                        <!-- Quote Text - dengan tinggi yang konsisten -->
                        <div class="mt-12 mb-6 flex-1 flex items-start">
                            <p class="text-gray-800 text-sm leading-relaxed font-family-sans font-medium min-h-[120px] flex items-center">
                                "{testimonial.message}"
                            </p>
                        </div>
                        
                        <!-- Footer Section dengan posisi yang konsisten -->
                        <div class="mt-auto">
                            <!-- Divider Line -->
                            <div class="w-full h-px bg-gray-200 mb-4"></div>
                            
                            <!-- Author -->
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 text-sm font-family-sans">{testimonial.visitor_name}</h4>
                                    <p class="text-gray-500 text-xs font-family-sans">{testimonial.company_name || 'Client'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            
            <!-- Pagination Dots -->
            <div class="flex justify-center gap-2">
                {#each testimonialSets() as _, index}
                    <button
                        class="transition-all duration-300 rounded-full {currentTestimonialSet === index 
                            ? 'w-6 h-2 bg-[#176684]' 
                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}"
                        onclick={() => setTestimonialSet(index)}
                        aria-label="Testimonial set {index + 1}"
                    ></button>
                {/each}
            </div>
        </div>
    </section>
    
    <!-- Contact Form Section -->
    <section class="relative bg-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <!-- Left Column - Text Content -->
                <div class="space-y-6">
                    <div>
                        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#176684] font-family-sans leading-tight">
                            Kami Senang Menjadi<br />
                            Bagian dari <span class="font-bold">Kisah Sukses</span> Anda
                        </h2>
                        <!-- Underline -->
                        <div class="mt-4 w-24 h-[2px] bg-[#176684]"></div>
                    </div>
                    
                    <div class="space-y-4 text-gray-700 font-family-sans">
                        <p class="text-base leading-relaxed">
                            Setiap proyek yang kami jalankan berawal dari kepercayaan dan berakhir dengan komitmen untuk memberikan hasil terbaik. Kami percaya, tidak ada pencapaian yang lebih berharga selain melihat klien kami tumbuh bersama solusi yang kami hadirkan.
                        </p>
                        <p class="text-base leading-relaxed">
                            Tinggalkan ulasan Anda dan bantu kami terus memberikan layanan terbaik untuk semua mitra.
                        </p>
                    </div>
                </div>
                
                <!-- Right Column - Contact Form -->
                <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <!-- Success Message -->
                    {#if submitSuccess}
                        <div id="feedback-success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3" in:fade>
                            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-green-800 font-family-sans">Terima kasih atas ulasan Anda!</p>
                                <p class="text-xs text-green-700 font-family-sans mt-1">Feedback Anda sangat berarti bagi kami untuk terus memberikan layanan terbaik.</p>
                            </div>
                        </div>
                    {/if}

                    <!-- Error Message -->
                    {#if submitError}
                        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3" in:fade>
                            <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-red-800 font-family-sans">{submitError}</p>
                            </div>
                        </div>
                    {/if}

                    <form onsubmit={handleSubmit} class="space-y-6">
                        <!-- Name Fields Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-900 font-family-sans mb-2">
                                    Nama Lengkap <span class="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    bind:value={feedbackForm.visitor_name}
                                    placeholder="John Doe"
                                    required
                                    disabled={submitting}
                                    class="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg font-family-sans text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#176684] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-900 font-family-sans mb-2">
                                    Nama Perusahaan
                                </label>
                                <input 
                                    type="text" 
                                    bind:value={feedbackForm.company_name}
                                    placeholder="Kahasolusi"
                                    disabled={submitting}
                                    class="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg font-family-sans text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#176684] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                        
                        <!-- Email Field -->
                        <div>
                            <label class="block text-sm font-medium text-gray-900 font-family-sans mb-2">
                                Email <span class="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                bind:value={feedbackForm.visitor_email}
                                placeholder="JohnDoe@Kahasolusi.com"
                                required
                                disabled={submitting}
                                class="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg font-family-sans text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#176684] focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        
                        <!-- Message Field -->
                        <div>
                            <label class="block text-sm font-medium text-gray-900 font-family-sans mb-2">
                                Ulasan <span class="text-red-500">*</span>
                            </label>
                            <textarea 
                                rows="4"
                                bind:value={feedbackForm.message}
                                placeholder="Berikan ulasan Anda dan bantu kami berkembang untuk memberikan pelayan terbaik bagi mitra"
                                required
                                disabled={submitting}
                                class="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg font-family-sans text-sm placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#176684] focus:outline-none transition-all duration-200 resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
                            ></textarea>
                        </div>
                        
                        <!-- Privacy Notice -->
                        <div class="flex items-start gap-3 text-xs text-gray-500 font-family-sans">
                            <input 
                                type="checkbox" 
                                id="privacy"
                                bind:checked={feedbackForm.hide_name}
                                disabled={submitting}
                                class="mt-1 w-4 h-4 text-[#176684] bg-gray-50 border-0 rounded focus:ring-[#176684] focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <label for="privacy" class="leading-relaxed">
                                Sembunyikan nama pada ulasan
                            </label>
                        </div>
                        
                        <!-- Submit Button -->
                        <button 
                            type="submit"
                            disabled={submitting}
                            class="w-full bg-[#176684] text-white py-3 px-6 rounded-lg font-medium font-family-sans hover:bg-[#145561] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                            {#if submitting}
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mengirim...
                            {:else}
                                Kirim Ulasan
                            {/if}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
    
    <!-- CTA Section -->
    <section class="relative bg-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-[#9ACFDD4A] rounded-2xl p-8 lg:p-12 shadow-lg" style="background-color: rgba(154, 207, 221, 0.3);">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div class="flex-1">
                        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#0D4E6D] font-family-sans leading-tight">
                            Mulai Transformasi Digital<br />
                            Perusahaan Anda dengan Kahasolusi
                        </h2>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-4 lg:flex-shrink-0">
                        <button class="bg-[#0D4E6D] text-white px-6 py-3 rounded-lg font-medium font-family-sans hover:bg-[#0a3d54] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2">
                            Hubungi Kami
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"></path>
                            </svg>
                        </button>
                        <button class="bg-transparent border-2 border-[#0D4E6D] text-[#0D4E6D] px-6 py-3 rounded-lg font-medium font-family-sans hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 flex items-center gap-2">
                            Dapatkan penawaran
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>