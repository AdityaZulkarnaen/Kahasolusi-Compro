<script>
	import { onMount } from 'svelte';
	import { 
		Users, 
		FolderOpen, 
		Code, 
		FileText, 
		Search
	} from 'lucide-svelte';
	
	// Data dummy untuk stats cards
	const statsCards = [
		{
			title: 'SDM',
			value: '12',
			icon: Users,
			bgColor: 'bg-purple-50',
			iconBg: 'bg-purple-500'
		},
		{
			title: 'Portofolio Proyek',
			value: '20',
			icon: FolderOpen,
			bgColor: 'bg-orange-50',
			iconBg: 'bg-orange-500'
		},
		{
			title: 'Tech Stack',
			value: '25',
			icon: Code, 
			bgColor: 'bg-green-50',
			iconBg: 'bg-green-500'
		},
		{
			title: 'File Media',
			value: '55',
			icon: FileText,
			bgColor: 'bg-red-50',
			iconBg: 'bg-red-500'
		}
	];
</script>

<svelte:head>
	<title>Dashboard - Kahasolusi</title>
</svelte:head>

<!-- Header -->
<header class="bg-white border-b border-gray-200 px-6 py-4">
	<div class="flex items-center justify-between">
		<!-- Left side: Title -->
		<div class="flex items-center gap-4">
			<h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
			
			<!-- Search Bar -->
			<div class="relative hidden sm:block">
				<input
					type="text"
					placeholder="Search"
					class="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64 lg:w-80"
				/>
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
			</div>
		</div>
		
		<!-- Right side: User Profile -->
		<div class="flex items-center gap-3">
			<!-- Mobile Search Button -->
			<button class="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
				<Search class="w-5 h-5 text-gray-600" />
			</button>
			
			<!-- User Profile -->
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center">
					<span class="text-white font-medium text-sm">LH</span>
				</div>
				<div class="text-right hidden sm:block">
					<p class="font-medium text-gray-800">Lilis Haria</p>
					<p class="text-sm text-gray-500">Admin</p>
				</div>
			</div>
		</div>
	</div>
</header>

<!-- Dashboard Content -->
<div class="p-6">
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		{#each statsCards as card}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
						<p class="text-3xl font-bold text-gray-800">{card.value}</p>
					</div>
					<div class="w-12 h-12 {card.iconBg} rounded-xl flex items-center justify-center">
						<svelte:component this={card.icon} class="text-white w-6 h-6" />
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Analytics Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Monthly Visitor -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-800 mb-4">Monthly Visitor</h2>
			<div class="h-64 flex items-center justify-center text-gray-500">
				<p>Chart akan ditambahkan nanti</p>
			</div>
		</div>

		<!-- Visitor by Provinces -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-800 mb-4">Visitor by Provinces</h2>
			<div class="h-64 flex items-center justify-center text-gray-500">
				<p>Map chart akan ditambahkan nanti</p>
			</div>
		</div>
	</div>

	<!-- Visitor Overview -->
	<div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-lg font-semibold text-gray-800">Visitor Overview</h2>
			<select class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
				<option>October</option>
				<option>September</option>
				<option>August</option>
			</select>
		</div>
		<div class="h-80 flex items-center justify-center text-gray-500">
			<p>Overview chart akan ditambahkan nanti</p>
		</div>
	</div>
</div>