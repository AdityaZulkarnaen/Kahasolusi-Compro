import { json } from '@sveltejs/kit';
import { 
	CLOUDFLARE_API_TOKEN, 
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_SITE_TAG 
} from '$env/static/private';

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
	if (!CLOUDFLARE_API_TOKEN) {
		throw new Error('CLOUDFLARE_API_TOKEN not configured');
	}

	const response = await fetch(CLOUDFLARE_GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
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
 * GET /api/visitors?type=overview|stats|countries
 */
export async function GET({ url }) {
	const type = url.searchParams.get('type') || 'overview';

	try {
		if (!CLOUDFLARE_ACCOUNT_ID) {
			return json({ 
				error: 'CLOUDFLARE_ACCOUNT_ID not configured' 
			}, { status: 500 });
		}
		
		if (!CLOUDFLARE_SITE_TAG) {
			return json({ 
				error: 'CLOUDFLARE_SITE_TAG not configured' 
			}, { status: 500 });
		}

		// Handle different types of analytics requests
		switch (type) {
			case 'overview':
				return await getOverview();
			case 'stats':
				return await getStats();
			case 'countries':
				return await getCountries();
			default:
				return json({ error: 'Invalid type parameter' }, { status: 400 });
		}

	} catch (error) {
		console.error(`Analytics ${type} error:`, error);
		return json({ 
			error: error.message || `Failed to fetch analytics ${type}` 
		}, { status: 500 });
	}
}

/**
 * Get visitor analytics overview (last 30 days)
 */
async function getOverview() {
	// Get data for last 30 days
	const since = new Date();
	since.setDate(since.getDate() - 30);
	const until = new Date();

	const query = `
		query ($accountTag: string, $siteTag: string, $datetimeStart: string, $datetimeEnd: string) {
			viewer {
				accounts(filter: { accountTag: $accountTag }) {
					rumPageloadEventsAdaptiveGroups(
						filter: {
							siteTag: $siteTag,
							datetime_geq: $datetimeStart,
							datetime_leq: $datetimeEnd
						},
						limit: 1000
					) {
						count
						dimensions {
							date
						}
					}
				}
			}
		}
	`;

	const data = await cloudflareGraphQL(query, {
		accountTag: CLOUDFLARE_ACCOUNT_ID,
		siteTag: CLOUDFLARE_SITE_TAG,
		datetimeStart: since.toISOString(),
		datetimeEnd: until.toISOString()
	});

	const rumData = data.viewer.accounts[0]?.rumPageloadEventsAdaptiveGroups || [];
	
	// Group by date
	const dailyMap = {};
	rumData.forEach(group => {
		const date = group.dimensions.date;
		if (!dailyMap[date]) {
			dailyMap[date] = 0;
		}
		dailyMap[date] += group.count;
	});

	return json({
		success: true,
		data: {
			daily: Object.entries(dailyMap).map(([date, count]) => ({
				date,
				pageViews: count,
				visits: count,
				uniqueVisitors: count
			}))
		}
	});
}

/**
 * Get current stats (today vs yesterday)
 */
async function getStats() {
	// Get data for last 2 days
	const now = new Date();
	const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

	const query = `
		query ($accountTag: string, $siteTag: string, $datetimeStart: string, $datetimeEnd: string) {
			viewer {
				accounts(filter: { accountTag: $accountTag }) {
					rumPageloadEventsAdaptiveGroups(
						filter: {
							siteTag: $siteTag,
							datetime_geq: $datetimeStart,
							datetime_leq: $datetimeEnd
						},
						limit: 1000
					) {
						count
						dimensions {
							date
						}
					}
				}
			}
		}
	`;

	const data = await cloudflareGraphQL(query, {
		accountTag: CLOUDFLARE_ACCOUNT_ID,
		siteTag: CLOUDFLARE_SITE_TAG,
		datetimeStart: twoDaysAgo.toISOString(),
		datetimeEnd: now.toISOString()
	});

	const rumData = data.viewer.accounts[0]?.rumPageloadEventsAdaptiveGroups || [];
	
	// Group by date
	const dailyMap = {};
	rumData.forEach(group => {
		const date = group.dimensions.date;
		if (!dailyMap[date]) {
			dailyMap[date] = 0;
		}
		dailyMap[date] += group.count;
	});
	
	// Get today and yesterday dates
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	
	const todayDate = formatDateForCloudflare(today);
	const yesterdayDate = formatDateForCloudflare(yesterday);
	
	const todayCount = dailyMap[todayDate] || 0;
	const yesterdayCount = dailyMap[yesterdayDate] || 0;

	return json({
		success: true,
		data: {
			today: {
				pageViews: todayCount,
				uniqueVisitors: todayCount,
				visits: todayCount
			},
			yesterday: {
				pageViews: yesterdayCount,
				uniqueVisitors: yesterdayCount,
				visits: yesterdayCount
			}
		}
	});
}

/**
 * Get visitor analytics by country
 */
async function getCountries() {
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

	return json({
		success: true,
		data: countries,
		note: 'This is sample data. Country breakdown requires Cloudflare Business/Enterprise plan.'
	});
}
