<script>
	import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-svelte';
	import LogoWhite from '$lib/assets/svg/LogoWhite.svg';

	const navLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Tentang Kami', href: '/#tentang-kami' },
		{ name: 'Layanan', href: '/#layanan' },
		{ name: 'Portofolio', href: '/portofolio' },
		{ name: 'Teknologi', href: '/#teknologi' }
	];

	const socialLinks = [
		{ icon: Instagram, href: '#', label: 'Instagram' },
		{ icon: Facebook, href: '#', label: 'Facebook' },
		{ icon: Linkedin, href: '#', label: 'LinkedIn' },
		{ icon: Youtube, href: '#', label: 'YouTube' }
	];
</script>

<footer class="bg-[#023F53] text-white py-8 px-6 md:px-12 lg:px-24">
	<div class="max-w-7xl mx-auto">
		<!-- Top Section: Copyright and Navigation -->
		<div
			class="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-white"
		>
			<!-- Copyright -->
			<div class="flex items-center gap-3">
				<img src={LogoWhite} alt="Kaha Solution Logo" class="h-8 w-auto" />
			</div>

			<!-- Navigation Links -->
			<nav class="flex flex-wrap justify-center items-center gap-6 md:gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm md:text-base hover:text-gray-300 transition-colors duration-200"
					>
						{link.name}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Bottom Section: Social Media Icons -->
		<div class="flex justify-between items-end">
			<p class="text-sm md:text-base">© Copyright 2025 - Kahasolusi</p>
			<div class="flex justify-center items-center gap-6 pt-6">
				{#each socialLinks as social}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						class="hover:opacity-70 transition-opacity duration-200"
						aria-label={social.label}
					>
						<svelte:component this={social.icon} size={24} />
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
