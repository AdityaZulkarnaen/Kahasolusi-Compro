<script>
    import { onMount } from 'svelte';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    import { projects } from '$lib/data/projects.js';
    
    // Slider state
    let currentSlide = 0;
    let slidesContainer;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    const featuredProjects = projects.slice(0, 6);
    
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
            const cardWidth = 380;
            const gap = 32;
            
           
            const centerIndex = 2; 
            const targetIndex = centerIndex + currentSlide;
            
            const moveDistance = targetIndex * (cardWidth + gap);
            
            slidesContainer.style.transform = `translate3d(calc(50% - 190px - ${moveDistance}px), 0, 0)`;
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

        setTimeout(() => {
            updateSliderPosition();
        }, 100);
        
        startAutoPlay();
        
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
        <div class="relative w-ful">
            <!-- Navigation Buttons -->
            <button 
                class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#176684] hover:bg-[#176684] hover:text-white transition-all duration-200 hover:scale-105"
                on:click={prevSlide}
                on:mouseenter={stopAutoPlay}
                on:mouseleave={resumeAutoPlay}
                aria-label="Previous slide"
            >
                <ChevronLeft class="w-6 h-6" />
            </button>
            
            <button 
                class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#176684] hover:bg-[#176684] hover:text-white transition-all duration-200 hover:scale-105"
                on:click={nextSlide}
                on:mouseenter={stopAutoPlay}
                on:mouseleave={resumeAutoPlay}
                aria-label="Next slide"
            >
                <ChevronRight class="w-6 h-6" />
            </button>
            
            <!-- Slides Wrapper -->
            <div class="overflow-hidden px-4 sm:px-16 py-12">
                <div 
                    bind:this={slidesContainer}
                    class="flex gap-8 transition-transform duration-700 ease-in-out"
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
                                   w-[380px] {isCenter ? 'scale-110 opacity-100 shadow-lg rounded-2xl z-10' : 
                                            isAdjacent ? 'scale-90 opacity-70 shadow-lg rounded-xl blur-[2px]' : 
                                            'scale-75 opacity-40 shadow-md rounded-lg blur-[4px]'}"
                            on:click={() => !isCenter && goToSlide(originalIndex)}
                            on:keydown={(e) => e.key === 'Enter' && !isCenter && goToSlide(originalIndex)}
                            role="button"
                            tabindex="0"
                            aria-label="View {project.title}"
                        >
                            <!-- Project Image -->
                            <div class="relative h-52 bg-gradient-to-br from-[#176684] to-[#0D4E6D] overflow-hidden">
                                <img 
                                    src={project.image} 
                                    alt={project.title}
                                    class="w-full h-full object-cover"
                                />
                                <!-- Overlay for better text readability -->
                                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            
                            <!-- Project Content -->
                            <div class="p-6">
                                <h3 class="{isCenter ? 'text-2xl' : 'text-xl'} font-semibold text-gray-900 font-family-sans mb-3">
                                    {project.title}
                                </h3>
                                
                                <p class="text-gray-600 {isCenter ? 'text-base' : 'text-sm'} font-family-sans leading-relaxed mb-4 line-clamp-3">
                                    {project.description}
                                </p>
                                
                                <!-- Tech Stack Icons -->
                                <div class="flex items-center gap-2 mb-4">
                                    <!-- HTML5 Icon -->
                                    <div class="{isCenter ? 'w-10 h-10' : 'w-8 h-8'} bg-[#E34F26] rounded flex items-center justify-center">
                                        <svg class="{isCenter ? 'w-6 h-6' : 'w-5 h-5'} text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
                                        </svg>
                                    </div>
                                    
                                    <!-- CSS3 Icon -->
                                    <div class="{isCenter ? 'w-10 h-10' : 'w-8 h-8'} bg-[#1572B6] rounded flex items-center justify-center">
                                        <svg class="{isCenter ? 'w-6 h-6' : 'w-5 h-5'} text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
                                        </svg>
                                    </div>
                                    
                                    <!-- JavaScript Icon -->
                                    <div class="{isCenter ? 'w-10 h-10' : 'w-8 h-8'} bg-[#F7DF1E] rounded flex items-center justify-center">
                                        <svg class="{isCenter ? 'w-6 h-6' : 'w-5 h-5'} text-black" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
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