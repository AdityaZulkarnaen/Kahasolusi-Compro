<script>
	import { onMount } from 'svelte';
	import { BarChart3, TrendingUp, Globe, Users } from 'lucide-svelte';
	import { Chart, registerables } from 'chart.js';

	// Register Chart.js components
	Chart.register(...registerables);

	let { data } = $props();

	let loading = $state(true);
	let error = $state(null);
	let analyticsData = $state({
		daily: [],
		stats: null,
		countries: []
	});
	let dailyChart = null;
	let overviewChart = null;

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

			// Render chart after data is loaded
			setTimeout(() => {
				renderDailyChart();
				renderOverviewChart();
			}, 100);
		} catch (err) {
			console.error('Analytics error:', err);
			error = err.message || 'Failed to load analytics';
		} finally {
			loading = false;
		}
	}

	// Render daily visitors chart
	function renderDailyChart() {
		const canvas = document.getElementById('dailyVisitorsChart');
		if (!canvas || !analyticsData.daily.length) return;

		// Destroy existing chart
		if (dailyChart) {
			dailyChart.destroy();
		}

		const ctx = canvas.getContext('2d');
		
		const labels = analyticsData.daily.map(day => {
			const date = new Date(day.date);
			return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
		});

		// Only use real data from Cloudflare
		const pageLoadsData = analyticsData.daily.map(day => day.pageLoads || 0);

		dailyChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Page Loads',
						data: pageLoadsData,
						borderColor: 'rgb(59, 130, 246)',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						fill: true,
						tension: 0.4,
						pointRadius: 3,
						pointHoverRadius: 5,
						borderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: 'top',
						labels: {
							usePointStyle: true,
							padding: 15,
							font: {
								size: 12
							}
						}
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						titleFont: {
							size: 13
						},
						bodyFont: {
							size: 12
						},
						padding: 12,
						callbacks: {
							label: function(context) {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								label += formatNumber(context.parsed.y);
								return label;
							}
						}
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							maxRotation: 45,
							minRotation: 45,
							font: {
								size: 10
							}
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							color: 'rgba(0, 0, 0, 0.05)'
						},
						ticks: {
							callback: function(value) {
								return formatNumber(value);
							},
							font: {
								size: 11
							}
						}
					}
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false
				}
			}
		});
	}

	// Render overview all-time chart (same style as daily chart)
	function renderOverviewChart() {
		const canvas = document.getElementById('overviewChart');
		if (!canvas || !analyticsData.daily.length) return;

		// Destroy existing chart
		if (overviewChart) {
			overviewChart.destroy();
		}

		const ctx = canvas.getContext('2d');
		
		const labels = analyticsData.daily.map(day => {
			const date = new Date(day.date);
			return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
		});

		// Only use real data from Cloudflare
		const pageLoadsData = analyticsData.daily.map(day => day.pageLoads || 0);

		overviewChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Page Loads',
						data: pageLoadsData,
						borderColor: 'rgb(59, 130, 246)',
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						fill: true,
						tension: 0.4,
						pointRadius: 3,
						pointHoverRadius: 5,
						borderWidth: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: 'top',
						labels: {
							usePointStyle: true,
							padding: 15,
							font: {
								size: 12
							}
						}
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						titleFont: {
							size: 13
						},
						bodyFont: {
							size: 12
						},
						padding: 12,
						callbacks: {
							label: function(context) {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								label += formatNumber(context.parsed.y);
								return label;
							}
						}
					}
				},
				scales: {
					x: {
						grid: {
							display: false
						},
						ticks: {
							maxRotation: 45,
							minRotation: 45,
							font: {
								size: 10
							}
						}
					},
					y: {
						beginAtZero: true,
						grid: {
							color: 'rgba(0, 0, 0, 0.05)'
						},
						ticks: {
							callback: function(value) {
								return formatNumber(value);
							},
							font: {
								size: 11
							}
						}
					}
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false
				}
			}
		});
	}

	// Calculate totals for period
	const periodTotals = $derived(() => {
		if (!analyticsData.daily.length) return null;

		return analyticsData.daily.reduce((acc, day) => {
			acc.pageLoads += day.pageLoads || 0;
			return acc;
		}, { pageLoads: 0 });
	});

	// Stats cards configuration - Real data only
	const statsCards = $derived(() => {
		if (!analyticsData.stats) return [];

		const { today, yesterday, allTime } = analyticsData.stats;
		const totals = periodTotals();

		// Calculate average page loads per day
		const avgPageLoadsPerDay = totals ? Math.round(totals.pageLoads / analyticsData.daily.length) : 0;

		return [
			{
				title: 'Total Page Loads',
				subtitle: 'Last 3 month',
				value: formatNumber(allTime?.totalPageLoads || 0),
				change: calculateChange(today.pageLoads || 0, yesterday.pageLoads || 0),
				icon: Globe,
				bgColor: 'bg-blue-50',
				iconBg: 'bg-blue-500'
			},
			{
				title: 'Today',
				subtitle: 'Page Loads',
				value: formatNumber(today.pageLoads || 0),
				change: calculateChange(today.pageLoads || 0, yesterday.pageLoads || 0),
				icon: BarChart3,
				bgColor: 'bg-green-50',
				iconBg: 'bg-green-500'
			},
			{
				title: 'Days Tracked',
				subtitle: 'With Data',
				value: formatNumber(allTime?.totalDays || 0),
				change: '0',
				icon: TrendingUp,
				bgColor: 'bg-purple-50',
				iconBg: 'bg-purple-500'
			},
			{
				title: 'Daily Average',
				subtitle: 'Last 60 Days',
				value: formatNumber(avgPageLoadsPerDay),
				change: '0',
				icon: Users,
				bgColor: 'bg-orange-50',
				iconBg: 'bg-orange-500'
			}
		];
	});

	onMount(() => {
		loadAnalytics();
		
		// Cleanup on unmount
		return () => {
			if (dailyChart) {
				dailyChart.destroy();
			}
			if (overviewChart) {
				overviewChart.destroy();
			}
		};
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
					<div class="flex-1">
						<div class="flex items-baseline gap-2 mb-1">
							<p class="text-gray-800 text-sm font-semibold">{card.title}</p>
							{#if card.subtitle}
								<span class="text-gray-400 text-xs">({card.subtitle})</span>
							{/if}
						</div>
						<p class="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
						<div class="flex items-center gap-1 text-xs">
							{#if getTrendDirection(card.change) === 'up'}
								<span class="text-green-600 font-medium">↑ {card.change}%</span>
							{:else}
								<span class="text-red-600 font-medium">↓ {card.change}%</span>
							{/if}
							<span class="text-gray-500">vs yesterday</span>
						</div>
					</div>
					<div class="w-12 h-12 {card.iconBg} rounded-xl flex items-center justify-center flex-shrink-0">
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
			<h2 class="text-lg font-semibold text-gray-800 mb-4">Daily Page Loads (Last 60 Days)</h2>
			{#if analyticsData.daily.length > 0}
				<div class="h-72">
					<canvas id="dailyVisitorsChart"></canvas>
				</div>
				<div class="mt-4 text-center text-xs text-gray-500">
					Total: {formatNumber(periodTotals().pageLoads)} page loads from Cloudflare Web Analytics
				</div>
			{:else}
				<div class="h-72 flex items-center justify-center text-gray-400">
					No data available
				</div>
			{/if}
		</div>	
		<!-- Overview All-Time Chart -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold text-gray-800">Visitor Overview All Time</h2>
				<span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
					Last {analyticsData.daily.length} days
				</span>
			</div>
			{#if periodTotals()}
				<div class="h-64">
					<canvas id="overviewChart"></canvas>
				</div>
				<div class="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
					<div class="text-center">
						<p class="text-xs text-gray-500 mb-1">Avg per Day</p>
						<p class="text-lg font-bold text-gray-800">
							{formatNumber(Math.round(periodTotals().pageLoads / analyticsData.daily.length))}
						</p>
					</div>
					<div class="text-center">
						<p class="text-xs text-gray-500 mb-1">Total Days</p>
						<p class="text-lg font-bold text-gray-800">
							{analyticsData.daily.length}
						</p>
					</div>
				</div>
			{:else}
				<div class="h-64 flex items-center justify-center text-gray-400">
					No data available
				</div>
			{/if}
		</div>
	</div>

	<!-- Period Summary
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
	{/if} -->
{/if}
