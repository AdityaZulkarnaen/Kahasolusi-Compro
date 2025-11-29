<script>
    import { onMount } from 'svelte';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import { portfolioAPI } from '$lib/api.js';
    
    // Slider state
    let currentSlide = 0;
    let slidesContainer;
    let isAutoPlaying = true;
    let autoPlayInterval;
    let screenSize = 'desktop';
    let featuredProjects = [];
    let loading = true;
    let error = null;
    
    // infinity loop
    $: infiniteProjects = [
        ...featuredProjects.slice(-2), 
        ...featuredProjects,
        ...featuredProjects.slice(0, 2) 
    ];
    
    $: actualSlide = currentSlide + 2;
    
    function goToSlide(index) {
        if (index >= 0 && index < featuredProjects.length) {
            currentSlide = index;
            updateSliderPosition();
        }
    }
    
    // Slide berikutnya
    function nextSlide() {
        currentSlide = (currentSlide + 1) % featuredProjects.length;
        updateSliderPosition();
    }
    
    // Slide sebelumnya
    function prevSlide() {
        currentSlide = currentSlide === 0 ? featuredProjects.length - 1 : currentSlide - 1;
        updateSliderPosition();
    }
    
    function updateSliderPosition() {
        if (slidesContainer) {
            // Responsif card width dan gap berdasarkan screen size
            let cardWidth, gap;
            
            if (window.innerWidth < 640) {
                // Untuk mobile S, gunakan 85% dari viewport width
                cardWidth = Math.floor(window.innerWidth * 0.85);
                gap = 12;
                screenSize = 'mobile';
            } else if (window.innerWidth < 1024) {
                cardWidth = 340;
                gap = 24;
                screenSize = 'tablet';
            } else {
                cardWidth = 380;
                gap = 32;
                screenSize = 'desktop';
            }
            
            const centerIndex = 2; 
            const targetIndex = centerIndex + currentSlide;
            const moveDistance = targetIndex * (cardWidth + gap);
            
            slidesContainer.style.transform = `translate3d(calc(50% - ${cardWidth/2}px - ${moveDistance}px), 0, 0)`;
        }
    }
    
    // Handle infinite loop transitions
    function handleInfiniteLoop() {
        if (currentSlide < 0) {
            currentSlide = featuredProjects.length - 1;
        } else if (currentSlide >= featuredProjects.length) {
            currentSlide = 0;
        }
    }
    
    // Auto play functionality
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying) {
                nextSlide();
            }
        }, 4000);
    }
    
    function stopAutoPlay() {
        isAutoPlaying = false;
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    function resumeAutoPlay() {
        isAutoPlaying = true;
        startAutoPlay();
    }
    
    onMount(() => {
        // Fetch featured portfolios from API
        async function loadFeaturedProjects() {
            try {
                loading = true;
                const response = await portfolioAPI.getFeatured(6);
                
                // Transform API data to match component structure
                featuredProjects = response.map(project => {
                    // Parse technologies JSON string
                    let technologies = [];
                    if (project.technologies) {
                        try {
                            technologies = typeof project.technologies === 'string' 
                                ? JSON.parse(project.technologies) 
                                : project.technologies;
                        } catch (e) {
                            console.error('Failed to parse technologies:', e);
                            technologies = [];
                        }
                    }
                    
                    return {
                        id: project.portfolio_id,
                        title: project.project_name,
                        description: project.project_description,
                        image: project.image_url ? `http://localhost:3001${project.image_url}` : '/placeholder-project.jpg',
                        category: project.categories || 'Uncategorized',
                        technologies: technologies
                    };
                });
                
                loading = false;
                
                // Initialize slider after data is loaded
                setTimeout(() => {
                    updateSliderPosition();
                }, 100);
                
                startAutoPlay();
            } catch (err) {
                console.error('Failed to load featured projects:', err);
                error = 'Gagal memuat data portfolio';
                loading = false;
            }
        }
        
        loadFeaturedProjects();

        const handleResize = () => {
            setTimeout(() => {
                updateSliderPosition();
            }, 100);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            window.removeEventListener('resize', handleResize);
        };
    });
</script>

<!-- Jejak Karya Section -->
<section class="relative bg-white py-20 overflow-hidden">
    <div class="w-full px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16 max-w-7xl mx-auto">
            <p class="text-[#176684] text-sm font-medium font-family-sans tracking-wide uppercase mb-2">
                OUR LATEST PROJECTS
            </p>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 font-family-sans">
                Jejak Karya Kami
            </h2>
            <p class="mt-6 text-gray-600 text-base font-family-sans max-w-3xl mx-auto leading-relaxed">
                Dari instansi pemerintah hingga sektor swasta, Kahasolusi telah dipercaya untuk 
                mengerjakan beragam proyek teknologi. Setiap karya kami dirancang dengan standar 
                kualitas tinggi, menekankkan pada user experience dan performa.
            </p>
        </div>
        
        <!-- Slider Container -->
        <div class="relative w-full overflow-x-hidden">
            {#if loading}
                <!-- Loading State -->
                <div class="flex items-center justify-center py-24">
                    <div class="text-center">
                        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#176684] mb-4"></div>
                        <p class="text-gray-600 font-family-sans">Memuat portfolio...</p>
                    </div>
                </div>
            {:else if error}
                <!-- Error State -->
                <div class="flex items-center justify-center py-24">
                    <div class="text-center">
                        <p class="text-red-600 font-family-sans mb-4">{error}</p>
                        <button 
                            class="text-[#176684] hover:underline font-family-sans"
                            on:click={() => window.location.reload()}
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            {:else if featuredProjects.length === 0}
                <!-- Empty State -->
                <div class="flex items-center justify-center py-24">
                    <div class="text-center">
                        <p class="text-gray-600 font-family-sans">Belum ada portfolio featured</p>
                    </div>
                </div>
            {:else}
            <!-- Navigation Buttons -->
            <button 
                class="absolute left-2 sm:left-4 lg:left-8 top-[40%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#176684] hover:bg-[#176684] hover:text-white transition-all duration-200 hover:scale-105"
                on:click={prevSlide}
                on:mouseenter={stopAutoPlay}
                on:mouseleave={resumeAutoPlay}
                aria-label="Previous slide"
            >
                <ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button 
                class="absolute right-2 sm:right-4 lg:right-8 top-[40%] sm:top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#176684] hover:bg-[#176684] hover:text-white transition-all duration-200 hover:scale-105"
                on:click={nextSlide}
                on:mouseenter={stopAutoPlay}
                on:mouseleave={resumeAutoPlay}
                aria-label="Next slide"
            >
                <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <!-- Slides Wrapper -->
            <div class="overflow-hidden px-4 sm:px-12 lg:px-16 py-8 sm:py-12">
                <div 
                    bind:this={slidesContainer}
                    class="flex gap-3 sm:gap-6 lg:gap-8 transition-transform duration-700 ease-in-out"
                    role="group"
                    aria-label="Project slider"
                    on:mouseenter={stopAutoPlay}
                    on:mouseleave={resumeAutoPlay}
                >
                    {#each infiniteProjects as project, index}
                        {@const isCenter = index === actualSlide}
                        {@const isAdjacent = Math.abs(index - actualSlide) === 1}
                        {@const originalIndex = index >= 2 && index < infiniteProjects.length - 2 ? index - 2 : 
                                               index < 2 ? featuredProjects.length - (2 - index) : 
                                               index - infiniteProjects.length + 2}
                        
                        <div 
                            class="flex-shrink-0 bg-white overflow-hidden transition-all duration-700 ease-in-out cursor-pointer
                                   w-[85vw] sm:w-[340px] lg:w-[380px] {isCenter ? 'scale-100 sm:scale-110 opacity-100 shadow-lg rounded-xl sm:rounded-2xl z-10' : 
                                            isAdjacent ? 'scale-75 sm:scale-90 opacity-50 sm:opacity-70 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl blur-[1px] sm:blur-[2px]' : 
                                            'scale-60 opacity-20 sm:opacity-40 shadow-sm sm:shadow-md rounded-md sm:rounded-lg blur-[2px] sm:blur-[4px]'}"
                            on:click={() => !isCenter && goToSlide(originalIndex)}
                            on:keydown={(e) => e.key === 'Enter' && !isCenter && goToSlide(originalIndex)}
                            role="button"
                            tabindex="0"
                            aria-label="View {project.title}"
                        >
                            <!-- Project Image -->
                            <div class="relative h-40 sm:h-48 lg:h-52 bg-gradient-to-br from-[#176684] to-[#0D4E6D] overflow-hidden">
                                <img 
                                    src={project.image} 
                                    alt={project.title}
                                    class="w-full h-full object-cover"
                                />
                                <!-- Overlay for better text readability -->
                                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            
                            <!-- Project Content -->
                            <div class="p-4 sm:p-5 lg:p-6">
                                <h3 class="{isCenter ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'} font-semibold text-gray-900 font-family-sans mb-2 sm:mb-3">
                                    {project.title}
                                </h3>
                                
                                <p class="text-gray-600 {isCenter ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} font-family-sans leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                                    {project.description}
                                </p>
                                
                                <!-- Tech Stack Icons -->
                                {#if project.technologies && project.technologies.length > 0}
                                <div class="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    {#each project.technologies.slice(0, 5) as tech}
                                        <div class="{isCenter ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} bg-gradient-to-br from-[#176684] to-[#0D4E6D] rounded flex items-center justify-center overflow-hidden" title={tech.tech_name}>
                                            {#if tech.icon_url || tech.logo_url}
                                                <img 
                                                    src={tech.icon_url ? `http://localhost:3001${tech.icon_url}` : `http://localhost:3001${tech.logo_url}`} 
                                                    alt={tech.tech_name}
                                                    class="{isCenter ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} object-contain"
                                                />
                                            {:else}
                                                <span class="text-white text-xs font-medium">{tech.tech_name.substring(0, 2).toUpperCase()}</span>
                                            {/if}
                                        </div>
                                    {/each}
                                    {#if project.technologies.length > 5}
                                        <div class="{isCenter ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} bg-gray-200 rounded flex items-center justify-center">
                                            <span class="text-gray-600 text-xs font-medium">+{project.technologies.length - 5}</span>
                                        </div>
                                    {/if}
                                </div>
                                {:else}
                                <!-- Default tech stack if no technologies assigned -->
                                <div class="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    <!-- HTML5 Icon -->
                                    <div class="{isCenter ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} bg-[#E34F26] rounded flex items-center justify-center">
                                        <svg class="{isCenter ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
                                        </svg>
                                    </div>
                                    
                                    <!-- CSS3 Icon -->
                                    <div class="{isCenter ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} bg-[#1572B6] rounded flex items-center justify-center">
                                        <svg class="{isCenter ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
                                        </svg>
                                    </div>
                                    
                                    <!-- JavaScript Icon -->
                                    <div class="{isCenter ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-7 h-7 sm:w-8 sm:h-8'} bg-[#F7DF1E] rounded flex items-center justify-center">
                                        <svg class="{isCenter ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} text-black" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                                        </svg>
                                    </div>
                                </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
            {/if}
        </div>
        
        <!-- View All Button -->
        <div class="text-center mt-12 max-w-7xl mx-auto">
            <a 
                href="/portofolio"
                class="inline-flex items-center gap-2 bg-[#176684] text-white px-8 py-3 rounded-lg font-medium font-family-sans hover:bg-[#145561] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
                Pelajari Selengkapnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"></path>
                </svg>
            </a>
        </div>
    </div>
</section>

<style>
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>