<script>
    import Code from '$lib/assets/svg/Code.svg';
	// Technology logos - You can replace these with actual logo URLs or SVG imports
	const technologies = [
		{ name: 'Visual Studio Code', icon: 'vscode' },
		{ name: 'Angular', icon: 'angular' },
		{ name: 'React', icon: 'react' },
		{ name: 'Vue', icon: 'vue' },
		{ name: 'Flutter', icon: 'flutter' },
		{ name: 'Swift', icon: 'swift' },
		{ name: 'Kotlin', icon: 'kotlin' },
		{ name: 'Node.js', icon: 'nodejs' },
		{ name: 'Python', icon: 'python' },
		{ name: 'Java', icon: 'java' },
		{ name: '.NET', icon: 'dotnet' },
		{ name: 'PHP', icon: 'php' },
		{ name: 'Go', icon: 'go' },
		{ name: 'Ruby', icon: 'ruby' },
		{ name: 'Rust', icon: 'rust' },
		{ name: 'TypeScript', icon: 'typescript' },
		{ name: 'PostgreSQL', icon: 'postgresql' },
		{ name: 'MySQL', icon: 'mysql' },
		{ name: 'MongoDB', icon: 'mongodb' },
		{ name: 'Redis', icon: 'redis' },
		{ name: 'Docker', icon: 'docker' },
		{ name: 'Kubernetes', icon: 'kubernetes' },
		{ name: 'AWS', icon: 'aws' },
		{ name: 'Azure', icon: 'azure' }
	];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	<div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
		{#each technologies as tech}
			<div class="tech-item relative flex items-center justify-center p-6 bg-[#D7EDF5] rounded-2xl hover:bg-blue-100 transition-colors group">
				<!-- Placeholder for VS Code icon -->
				<div class="w-12 h-12 flex items-center justify-center">
                    <img src={Code} alt={tech.name}>
				</div>
				
				<!-- Bubble Chat Tooltip -->
				<div class="tooltip absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out pointer-events-none">
					<div class="bg-[#747474] text-white text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap shadow-lg">
						{tech.name}
						<!-- Triangle pointer -->
						<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#747474]"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.tech-item {
		cursor: pointer;
		position: relative;
	}

	.tooltip {
		z-index: 50;
		pointer-events: none;
	}

	/* Smooth animation for tooltip */
	.group:hover .tooltip {
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translate(0, 50%);
		}
		to {
			opacity: 1;
			transform: translate(0, 0);
		}
	}
</style>
