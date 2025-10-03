<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import MapIndonesia from '$lib/assets/images/map_indonesia.png';
    import ClientExample from '$lib/assets/images/client_example.png';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { projects, getProjectsByCategory } from '$lib/data/projects.js';
    
    // Filter state
    let selectedFilter = 'pemerintah';
    
    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 8; 
    
    // Filtered projects 
    $: filteredProjects = getProjectsByCategory(selectedFilter);
    
    $: totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    $: startIndex = (currentPage - 1) * itemsPerPage;
    $: endIndex = startIndex + itemsPerPage;
    $: paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
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
</script>

<!-- Portfolio Container -->
<div class="relative bg-white min-h-screen">
    <!-- Header Section with Title and Map -->
    <section class="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto text-center">
            <!-- Page Title -->
            <div class="mb-16">
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-normal text-gray-900 mb-4 font-family-sans inline-block relative">
                    Portfolio Proyek.
                    <!-- Underline -->
                    <div class="absolute -bottom-6 left-0 w-full h-[2px] bg-gray-900"></div>
                </h1>
            </div>
            
            <!-- Indonesia Map -->
            <div class="relative max-w-6xl mx-auto mb-12">
                <img 
                    src={MapIndonesia} 
                    alt="Peta Indonesia" 
                    class="w-full h-auto max-h-[500px] object-contain"
                />
            </div>
        </div>
    </section>
    
    <!-- Filter Section -->
    <section class="relative px-4 sm:px-6 lg:px-8 pb-16">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-wrap justify-center gap-4 mb-16">
                <button
                    class="px-8 py-3 rounded-lg font-medium font-family-sans transition-all duration-300 min-w-[140px] text-sm
                           {selectedFilter === 'akademik' 
                             ? 'bg-[#0D4E6D] text-white shadow-md' 
                             : 'bg-[#A5BCC7] text-[#0D4E6D] hover:bg-[#96b1be] border border-[#0D4E6D]'}"
                    on:click={() => setFilter('akademik')}
                >
                    Akademik
                </button>
                <button
                    class="px-8 py-3 rounded-lg font-medium font-family-sans transition-all duration-300 min-w-[140px] text-sm
                           {selectedFilter === 'pemerintah' 
                             ? 'bg-[#0D4E6D] text-white shadow-md' 
                             : 'bg-[#A5BCC7] text-[#0D4E6D] hover:bg-[#96b1be] border border-[#0D4E6D]'}"
                    on:click={() => setFilter('pemerintah')}
                >
                    Pemerintah
                </button>
                <button
                    class="px-8 py-3 rounded-lg font-medium font-family-sans transition-all duration-300 min-w-[140px] text-sm
                           {selectedFilter === 'swasta' 
                             ? 'bg-[#0D4E6D] text-white shadow-md' 
                             : 'bg-[#A5BCC7] text-[#0D4E6D] hover:bg-[#96b1be] border border-[#0D4E6D]'}"
                    on:click={() => setFilter('swasta')}
                >
                    Swasta
                </button>
            </div>
        </div>
    </section>
    
    <!-- Projects Grid Section -->
    <section class="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-12">
                {#each paginatedProjects as project (project.id)}
                    <div in:fade={{ duration: 300, delay: 100 }}>
                        <ProjectCard {project} />
                    </div>
                {/each}
            </div>
            
            {#if filteredProjects.length === 0}
                <div class="text-center py-16">
                    <p class="text-gray-900 text-lg font-family-sans">
                        Belum ada proyek untuk kategori {selectedFilter}.
                    </p>
                </div>
            {/if}
            
            {#if filteredProjects.length > itemsPerPage}
                <div class="hidden sm:flex justify-center items-center gap-2 mt-8">
                    <button
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
                        on:click={prevPage}
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
                            on:click={() => goToPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    {/each}
                    
                    <button
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
                        on:click={nextPage}
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