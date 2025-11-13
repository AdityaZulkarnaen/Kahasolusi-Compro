<script>
	import { onMount } from 'svelte';
	import { BarChart3, TrendingUp, Globe, Users } from 'lucide-svelte';

	let { data } = $props();

	let loading = $state(true);
	let error = $state(null);
	let analyticsData = $state({
		daily: [],
		stats: null,
		countries: []
	});

	// Format number with separators
	function formatNumber(num) {
		return new Intl.NumberFormat('id-ID').format(num || 0);
	}

	// Format bytes to readable size
	function formatBytes(bytes) {
		if (!bytes) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	}

	// Calculate percentage change
	function calculateChange(current, previous) {
		if (!previous) return 0;
		return ((current - previous) / previous * 100).toFixed(1);
	}

	// Get trend direction
	function getTrendDirection(change) {
		return parseFloat(change) >= 0 ? 'up' : 'down';
	}

	// Load analytics data
	async function loadAnalytics() {
		loading = true;
		error = null;

		try {
			// Fetch all analytics data in parallel from SvelteKit endpoints
			const [overviewRes, statsRes, countriesRes] = await Promise.all([
				fetch('/api/visitors?type=overview'),
				fetch('/api/visitors?type=stats'),
				fetch('/api/visitors?type=countries')
			]);

			if (!overviewRes.ok || !statsRes.ok || !countriesRes.ok) {
				throw new Error('Failed to fetch analytics data');
			}

			const [overview, stats, countries] = await Promise.all([
				overviewRes.json(),
				statsRes.json(),
				countriesRes.json()
			]);

			analyticsData = {
				daily: overview.data?.daily || [],
				stats: stats.data || null,
				countries: countries.data || []
			};
		} catch (err) {
			console.error('Analytics error:', err);
			error = err.message || 'Failed to load analytics';
		} finally {
			loading = false;
		}
	}

	// Calculate totals for period
	const periodTotals = $derived(() => {
		if (!analyticsData.daily.length) return null;

		return analyticsData.daily.reduce((acc, day) => {
			acc.requests += day.requests || 0;
			acc.pageViews += day.pageViews || 0;
			acc.uniqueVisitors += day.uniqueVisitors || 0;
			acc.bandwidth += day.bandwidth || 0;
			return acc;
		}, { requests: 0, pageViews: 0, uniqueVisitors: 0, bandwidth: 0 });
	});

	// Stats cards configuration
	const statsCards = $derived(() => {
		if (!analyticsData.stats) return [];

		const { today, yesterday } = analyticsData.stats;

		return [
			{
				title: 'Page Views',
				value: formatNumber(today.pageViews),
				change: calculateChange(today.pageViews, yesterday.pageViews),
				icon: BarChart3,
				bgColor: 'bg-blue-50',
				iconBg: 'bg-blue-500'
			},
			{
				title: 'Unique Visitors',
				value: formatNumber(today.uniqueVisitors),
				change: calculateChange(today.uniqueVisitors, yesterday.uniqueVisitors),
				icon: Users,
				bgColor: 'bg-green-50',
				iconBg: 'bg-green-500'
			},
			{
				title: 'Total Requests',
				value: formatNumber(today.requests),
				change: calculateChange(today.requests, yesterday.requests),
				icon: Globe,
				bgColor: 'bg-purple-50',
				iconBg: 'bg-purple-500'
			},
			{
				title: 'Threats Blocked',
				value: formatNumber(today.threats),
				change: calculateChange(today.threats, yesterday.threats),
				icon: TrendingUp,
				bgColor: 'bg-red-50',
				iconBg: 'bg-red-500'
			}
		];
	});

	onMount(() => {
		loadAnalytics();
	});
</script>

{#if loading}
	<div class="space-y-6">
		<!-- Stats Cards Skeleton -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each Array(4) as _}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
							<div class="h-8 bg-gray-200 rounded w-20 mb-1"></div>
							<div class="h-3 bg-gray-200 rounded w-16"></div>
						</div>
						<div class="w-12 h-12 bg-gray-200 rounded-xl"></div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Charts Skeleton -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
				<div class="h-64 bg-gray-100 rounded"></div>
			</div>
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div class="h-4 bg-gray-200 rounded w-32 mb-4"></div>
				<div class="h-64 bg-gray-100 rounded"></div>
			</div>
		</div>
	</div>
{:else if error}
	<div class="bg-red-50 border border-red-200 rounded-xl p-6">
		<div class="flex items-start gap-3">
			<div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
				<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
			</div>
			<div>
				<h3 class="font-semibold text-red-900 mb-1">Analytics Error</h3>
				<p class="text-red-700 text-sm">{error}</p>
				<p class="text-red-600 text-xs mt-2">
					Pastikan CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID, dan CLOUDFLARE_ACCOUNT_ID sudah dikonfigurasi di file .env
				</p>
				<button 
					onclick={loadAnalytics}
					class="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
				>
					Coba Lagi
				</button>
			</div>
		</div>
	</div>
{:else}
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
		{#each statsCards() as card}
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-600 text-sm font-medium mb-1">{card.title}</p>
						<p class="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
						<div class="flex items-center gap-1 text-xs">
							{#if getTrendDirection(card.change) === 'up'}
								<span class="text-green-600 font-medium">↑ {card.change}%</span>
							{:else}
								<span class="text-red-600 font-medium">↓ {card.change}%</span>
							{/if}
							<span class="text-gray-500">vs yesterday</span>
						</div>
					</div>
					<div class="w-12 h-12 {card.iconBg} rounded-xl flex items-center justify-center">
						<card.icon class="text-white w-6 h-6" />
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Charts Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
		<!-- Daily Visitors Chart -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-800 mb-4">Daily Visitors (Last 30 Days)</h2>
			<div class="h-64">
				{#if analyticsData.daily.length > 0}
					<div class="h-full flex items-end gap-1">
						{#each analyticsData.daily as day}
							{@const maxValue = Math.max(...analyticsData.daily.map(d => d.pageViews))}
							{@const heightPercent = (day.pageViews / maxValue) * 100}
							<div class="flex-1 flex flex-col items-center group relative">
								<div 
									class="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
									style="height: {heightPercent}%"
									title="{new Date(day.date).toLocaleDateString('id-ID')}: {formatNumber(day.pageViews)} views"
								></div>
								<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded mt-1 whitespace-nowrap z-10">
									<div class="font-semibold">{new Date(day.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</div>
									<div>Views: {formatNumber(day.pageViews)}</div>
									<div>Visitors: {formatNumber(day.uniqueVisitors)}</div>
								</div>
							</div>
						{/each}
					</div>
					<div class="mt-4 text-center text-xs text-gray-500">
						Total: {formatNumber(periodTotals().pageViews)} page views
					</div>
				{:else}
					<div class="h-full flex items-center justify-center text-gray-400">
						No data available
					</div>
				{/if}
			</div>
		</div>

		<!-- Top Countries -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-semibold text-gray-800 mb-4">Top Visitors by Country</h2>
			<div class="h-64 overflow-y-auto">
				{#if analyticsData.countries.length > 0}
					<div class="space-y-3">
						{#each analyticsData.countries.slice(0, 10) as country, index}
							{@const maxRequests = analyticsData.countries[0].requests}
							{@const widthPercent = (country.requests / maxRequests) * 100}
							<div class="group">
								<div class="flex items-center justify-between mb-1">
									<span class="text-sm font-medium text-gray-700 flex items-center gap-2">
										<span class="text-gray-400 text-xs">#{index + 1}</span>
										{country.country}
									</span>
									<span class="text-xs text-gray-500">
										{formatNumber(country.uniqueVisitors)} visitors
									</span>
								</div>
								<div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
									<div 
										class="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
										style="width: {widthPercent}%"
									></div>
								</div>
								<div class="text-xs text-gray-400 mt-1">
									{formatNumber(country.pageViews)} page views
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="h-full flex items-center justify-center text-gray-400">
						No country data available
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Period Summary -->
	{#if periodTotals()}
		<div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
			<h2 class="text-lg font-semibold mb-4">30-Day Summary</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<p class="text-blue-100 text-sm mb-1">Total Requests</p>
					<p class="text-2xl font-bold">{formatNumber(periodTotals().requests)}</p>
				</div>
				<div>
					<p class="text-blue-100 text-sm mb-1">Page Views</p>
					<p class="text-2xl font-bold">{formatNumber(periodTotals().pageViews)}</p>
				</div>
				<div>
					<p class="text-blue-100 text-sm mb-1">Unique Visitors</p>
					<p class="text-2xl font-bold">{formatNumber(periodTotals().uniqueVisitors)}</p>
				</div>
				<div>
					<p class="text-blue-100 text-sm mb-1">Bandwidth Used</p>
					<p class="text-2xl font-bold">{formatBytes(periodTotals().bandwidth)}</p>
				</div>
			</div>
		</div>
	{/if}
{/if}
