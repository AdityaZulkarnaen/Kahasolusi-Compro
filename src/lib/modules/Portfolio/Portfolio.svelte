<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import MapIndonesia from '$lib/assets/images/map_indonesia.png';
    import ProjectCard from '$lib/components/ProjectCard.svelte';
    import { projects, getProjectsByCategory } from '$lib/data/projects.js';
    
    // Filter state
    let selectedFilter = 'pemerintah';
    
    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 8; // 2 rows x 4 columns for desktop
    
    // Filtered projects based on selected filter - using helper function from data file
    $: filteredProjects = getProjectsByCategory(selectedFilter);
    
    // Pagination calculations
    $: totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    $: startIndex = (currentPage - 1) * itemsPerPage;
    $: endIndex = startIndex + itemsPerPage;
    $: paginatedProjects = filteredProjects.slice(startIndex, endIndex);
    
    function setFilter(filter) {
        selectedFilter = filter;
        currentPage = 1; // Reset pagination when filter changes
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
                <!-- Location pins are already in the image -->
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
            <!-- Projects Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center mb-12">
                {#each paginatedProjects as project (project.id)}
                    <div in:fade={{ duration: 300, delay: 100 }}>
                        <ProjectCard {project} />
                    </div>
                {/each}
            </div>
            
            <!-- Empty state if no projects -->
            {#if filteredProjects.length === 0}
                <div class="text-center py-16">
                    <p class="text-gray-900 text-lg font-family-sans">
                        Belum ada proyek untuk kategori {selectedFilter}.
                    </p>
                </div>
            {/if}
            
            <!-- Pagination - Hidden on mobile -->
            {#if filteredProjects.length > itemsPerPage}
                <div class="hidden sm:flex justify-center items-center gap-2 mt-8">
                    <!-- Previous Button -->
                    <button
                        class="flex items-center justify-center w-10 h-10 rounded-lg border border-[#0D4E6D] text-[#0D4E6D] hover:bg-[#0D4E6D] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0D4E6D]"
                        on:click={prevPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft class="w-5 h-5" />
                    </button>
                    
                    <!-- Page Numbers -->
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
                    
                    <!-- Next Button -->
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
</div>