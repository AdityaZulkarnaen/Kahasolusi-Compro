import { Hono } from 'hono';

const analytics = new Hono();

// Cloudflare GraphQL endpoint
const CLOUDFLARE_GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

/**
 * Format date to YYYY-MM-DD for Cloudflare API
 */
function formatDateForCloudflare(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * Helper function to make Cloudflare GraphQL requests
 */
async function cloudflareGraphQL(query, variables = {}) {
	const token = process.env.CLOUDFLARE_API_TOKEN;
	
	if (!token) {
		throw new Error('CLOUDFLARE_API_TOKEN not configured');
	}

	const response = await fetch(CLOUDFLARE_GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables
		})
	});

	if (!response.ok) {
		throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	
	if (data.errors) {
		throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
	}

	return data.data;
}

/**
 * Get visitor analytics overview
 * GET /api/analytics/overview
 */
analytics.get('/overview', async (c) => {
	try {
		const zoneId = process.env.CLOUDFLARE_ZONE_ID;
		
		if (!zoneId) {
			return c.json({ 
				error: 'CLOUDFLARE_ZONE_ID not configured' 
			}, 500);
		}

		// Get data for last 30 days
		const since = new Date();
		since.setDate(since.getDate() - 30);
		const until = new Date();

		const query = `
			query GetAnalyticsOverview($zoneTag: string!, $since: string!, $until: string!) {
				viewer {
					zones(filter: { zoneTag: $zoneTag }) {
						httpRequests1dGroups(
							limit: 30
							filter: { date_geq: $since, date_leq: $until }
							orderBy: [date_ASC]
						) {
							date: dimensions {
								date
							}
							sum {
								requests
								pageViews
								threats
								bytes
							}
							uniq {
								uniques
							}
						}
					}
				}
			}
		`;

		const data = await cloudflareGraphQL(query, {
			zoneTag: zoneId,
			since: formatDateForCloudflare(since),
			until: formatDateForCloudflare(until)
		});

		const httpRequests = data.viewer.zones[0]?.httpRequests1dGroups || [];

		return c.json({
			success: true,
			data: {
				daily: httpRequests.map(group => ({
					date: group.date.date,
					requests: group.sum.requests,
					pageViews: group.sum.pageViews,
					uniqueVisitors: group.uniq.uniques,
					threats: group.sum.threats,
					bandwidth: group.sum.bytes
				}))
			}
		});

	} catch (error) {
		console.error('Analytics overview error:', error);
		return c.json({ 
			error: error.message || 'Failed to fetch analytics overview' 
		}, 500);
	}
});

/**
 * Get visitor analytics by country
 * GET /api/analytics/countries
 */
analytics.get('/countries', async (c) => {
	try {
		// Country breakdown requires Cloudflare Business/Enterprise plan
		// Return sample data for demonstration
		const countries = [
			{
				country: 'Indonesia',
				requests: 8500,
				pageViews: 6500,
				uniqueVisitors: 3200
			},
			{
				country: 'United States',
				requests: 1200,
				pageViews: 950,
				uniqueVisitors: 450
			},
			{
				country: 'Singapore',
				requests: 800,
				pageViews: 620,
				uniqueVisitors: 280
			},
			{
				country: 'Malaysia',
				requests: 450,
				pageViews: 350,
				uniqueVisitors: 180
			},
			{
				country: 'Australia',
				requests: 320,
				pageViews: 250,
				uniqueVisitors: 120
			},
			{
				country: 'Japan',
				requests: 280,
				pageViews: 220,
				uniqueVisitors: 95
			},
			{
				country: 'Thailand',
				requests: 210,
				pageViews: 165,
				uniqueVisitors: 75
			},
			{
				country: 'Philippines',
				requests: 180,
				pageViews: 140,
				uniqueVisitors: 65
			},
			{
				country: 'South Korea',
				requests: 150,
				pageViews: 115,
				uniqueVisitors: 55
			},
			{
				country: 'Others',
				requests: 310,
				pageViews: 240,
				uniqueVisitors: 110
			}
		];

		return c.json({
			success: true,
			data: countries,
			note: 'This is sample data. Country breakdown requires Cloudflare Business/Enterprise plan.'
		});

	} catch (error) {
		console.error('Analytics countries error:', error);
		return c.json({ 
			error: error.message || 'Failed to fetch analytics by country' 
		}, 500);
	}
});

/**
 * Get visitor analytics by browser
 * GET /api/analytics/browsers
 */
analytics.get('/browsers', async (c) => {
	try {
		const zoneId = process.env.CLOUDFLARE_ZONE_ID;
		
		if (!zoneId) {
			return c.json({ 
				error: 'CLOUDFLARE_ZONE_ID not configured' 
			}, 500);
		}

		// Get data for last 7 days
		const since = new Date();
		since.setDate(since.getDate() - 7);
		const until = new Date();

		const query = `
			query GetAnalyticsByBrowser($zoneTag: string!, $since: string!, $until: string!) {
				viewer {
					zones(filter: { zoneTag: $zoneTag }) {
						httpRequests1dGroups(
							limit: 10000
							filter: { date_geq: $since, date_leq: $until }
						) {
							dimensions {
								clientRequestHTTPHost
								clientRequestUserAgent
							}
							sum {
								requests
							}
						}
					}
				}
			}
		`;

		const data = await cloudflareGraphQL(query, {
			zoneTag: zoneId,
			since: formatDateForCloudflare(since),
			until: formatDateForCloudflare(until)
		});

		const httpRequests = data.viewer.zones[0]?.httpRequests1dGroups || [];

		return c.json({
			success: true,
			data: {
				total: httpRequests.length,
				message: 'Browser analytics available with extended plan'
			}
		});

	} catch (error) {
		console.error('Analytics browsers error:', error);
		return c.json({ 
			error: error.message || 'Failed to fetch analytics by browser' 
		}, 500);
	}
});

/**
 * Get current stats summary
 * GET /api/analytics/stats
 */
analytics.get('/stats', async (c) => {
	try {
		const zoneId = process.env.CLOUDFLARE_ZONE_ID;
		
		if (!zoneId) {
			return c.json({ 
				error: 'CLOUDFLARE_ZONE_ID not configured' 
			}, 500);
		}

		// Get data for today and yesterday for comparison
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const query = `
			query GetAnalyticsStats($zoneTag: string!, $since: string!, $until: string!) {
				viewer {
					zones(filter: { zoneTag: $zoneTag }) {
						httpRequests1dGroups(
							limit: 2
							filter: { date_geq: $since, date_leq: $until }
							orderBy: [date_DESC]
						) {
							date: dimensions {
								date
							}
							sum {
								requests
								pageViews
								threats
							}
							uniq {
								uniques
							}
						}
					}
				}
			}
		`;

		const data = await cloudflareGraphQL(query, {
			zoneTag: zoneId,
			since: formatDateForCloudflare(yesterday),
			until: formatDateForCloudflare(today)
		});

		const groups = data.viewer.zones[0]?.httpRequests1dGroups || [];
		
		const todayStats = groups[0] || { sum: {}, uniq: {} };
		const yesterdayStats = groups[1] || { sum: {}, uniq: {} };

		return c.json({
			success: true,
			data: {
				today: {
					requests: todayStats.sum.requests || 0,
					pageViews: todayStats.sum.pageViews || 0,
					uniqueVisitors: todayStats.uniq.uniques || 0,
					threats: todayStats.sum.threats || 0
				},
				yesterday: {
					requests: yesterdayStats.sum.requests || 0,
					pageViews: yesterdayStats.sum.pageViews || 0,
					uniqueVisitors: yesterdayStats.uniq.uniques || 0,
					threats: yesterdayStats.sum.threats || 0
				}
			}
		});

	} catch (error) {
		console.error('Analytics stats error:', error);
		return c.json({ 
			error: error.message || 'Failed to fetch analytics stats' 
		}, 500);
	}
});

export default analytics;
