<script>
	// Team Grid Component
	import TeamCard from './TeamCard.svelte';
	import SDMDetailModal from './SDMDetailModal.svelte';
	import PersonIcon from '$lib/assets/svg/PersonDefault.svg';

	let selectedMember = null;
	let isModalOpen = false;

	// Data anggota tim (sesuaikan dengan data sebenarnya)
	const teamMembers = [
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Steve adalah "Founding Father" di Kahasolusi. Kepemimpinannya di bidang Financial Bisnis dan Human Resources membuat beliau memiliki kemampuan dalam mengatur puluhan karyawan agar tetap berada pada jalur. Beliau selalu berusaha dalam mengembangkan kompensasi, menjadi Akuntung dan Master Manajemen serta pengalaman kerja sebelumnya di berbagai lembaga keuangan korporat sangat berharga dalam membangun Kahasolusi hingga sekarang.',
			certifications: [
				'AWS Certified Solutions Architect – Associate (Amazon Web Services)',
				'Google Cloud Professional Data Engineer (Google)',
				'Microsoft Certified: Azure Data Scientist Associate',
				'Microsoft Certified: Azure Fundamentals',
				'Oracle Certified Professional: Java SE'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js, Tailwind',
				'Cloud Computing: AWS, Google Cloud Platform, Microsoft Azure',
				'Web & Mobile Development: ReactJS, VueJS, Node.js, Flutter',
				'Backend & Database: Java Spring Boot, Python Django, PostgreSQL, MongoDB',
				'DevOps & CI/CD: Docker, Kubernetes, Jenkins, GitLab CI/CD'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		},
		{
			name: 'Steve',
			position: 'Fullstack',
			image: PersonIcon,
			experience:
				'Pengalaman lebih dari 5 tahun dalam pengembangan aplikasi web dan mobile. Berpengalaman dalam mengelola proyek dari awal hingga deployment.',
			certifications: [
				'AWS Certified Solutions Architect',
				'Google Cloud Professional',
				'Microsoft Certified: Azure Fundamentals'
			],
			specializations: [
				'Full-Stack Development: JavaScript, React.js, Node.js',
				'Cloud Computing: AWS, Google Cloud Platform',
				'Web Development: ReactJS, VueJS, Node.js'
			],
			github: 'https://github.com',
			linkedin: 'https://linkedin.com'
		}
	];

	function handleMemberClick(event) {
		console.log('Member clicked in TeamGrid:', event.detail);
		selectedMember = event.detail;
		isModalOpen = true;
		console.log('Modal should open now. isModalOpen:', isModalOpen);
	}

	function closeModal() {
		console.log('Closing modal');
		isModalOpen = false;
		selectedMember = null;
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-0">
	<div
		class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8 lg:gap-x-4 lg:gap-y-20"
	>
		{#each teamMembers as member}
			<TeamCard
				name={member.name}
				position={member.position}
				image={member.image}
				{member}
				on:click={handleMemberClick}
			/>
		{/each}
	</div>
</div>

<!-- Modal -->
<SDMDetailModal member={selectedMember} isOpen={isModalOpen} on:close={closeModal} />
