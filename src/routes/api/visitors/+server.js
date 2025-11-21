import { json } from '@sveltejs/kit';
import { 
	CLOUDFLARE_API_TOKEN, 
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_SITE_TAG,
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

async function testWebAnalyticsWithSite() {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const until = new Date();
    
    const dateStart = formatDateForCloudflare(since);
    const dateEnd = formatDateForCloudflare(until);
    
    
    // Test 1: Coba ambil list semua sites di account
    try {
        const restApiUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/rum/site_info`;
        const restResponse = await fetch(restApiUrl, {
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json',
            }
        });
        
        if (restResponse.ok) {
            const restData = await restResponse.json();
            console.log('Available Web Analytics Sites:', JSON.stringify(restData, null, 2));
        }
    } catch (e) {
        console.log('REST API test failed:', e.message);
    }
    
    // Test 2: GraphQL tanpa filter siteTag untuk melihat semua site
    const query = `
        query TestAnalytics($accountTag: string, $dateStart: string, $dateEnd: string) {
            viewer {
                accounts(filter: { accountTag: $accountTag }) {
                    rumPageloadEventsAdaptiveGroups(
                        filter: {
                            date_geq: $dateStart,
                            date_leq: $dateEnd
                        },
                        limit: 1000,
                        orderBy: [date_DESC]
                    ) {
                        count
                        dimensions {
                            date
                            siteTag
                        }
                    }
                }
            }
        }
    `;
    
    const data = await cloudflareGraphQL(query, {
        accountTag: CLOUDFLARE_ACCOUNT_ID,
        dateStart: dateStart,
        dateEnd: dateEnd
    });
    
    
    const rumData = data.viewer.accounts[0]?.rumPageloadEventsAdaptiveGroups || [];
    
    // Group by siteTag to see which sites have data
    const siteTags = {};
    rumData.forEach(item => {
        const tag = item.dimensions.siteTag || 'unknown';
        siteTags[tag] = (siteTags[tag] || 0) + item.count;
    });
    
    return { 
        success: true,
        availableSiteTags: Object.keys(siteTags),
        siteTagCounts: siteTags,
        configuredSiteTag: CLOUDFLARE_SITE_TAG,
        totalRecords: rumData.length,
        rawData: data
    };
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
 * GET /api/visitors?type=overview|stats|countries|test
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
			case 'test': {
				const testData = await testWebAnalyticsWithSite();
				return json({
					success: true,
					data: testData
				});
			}
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
 * Get visitor analytics overview (last 60 days) - Real data only
 */
async function getOverview() {
    const since = new Date();
    since.setDate(since.getDate() - 60);
    const until = new Date();

    const dateStart = formatDateForCloudflare(since);
    const dateEnd = formatDateForCloudflare(until);

    console.log('Fetching overview data from', dateStart, 'to', dateEnd);

    // Query menggunakan datetime untuk data realtime
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
                        limit: 10000,
                        orderBy: [date_ASC]
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
    
    console.log('Received', rumData.length, 'data points from Cloudflare');
    
    // Group by date
    const dailyMap = {};
    rumData.forEach(group => {
        const date = group.dimensions.date;
        if (!dailyMap[date]) {
            dailyMap[date] = 0;
        }
        dailyMap[date] += group.count;
    });

    // Return ONLY real pageload data from Cloudflare
    const dailyData = Object.entries(dailyMap)
        .map(([date, count]) => ({
            date: date,
            pageLoads: count  // Real metric: actual page load events
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

    console.log('Daily data range:', dailyData[0]?.date, 'to', dailyData[dailyData.length - 1]?.date);

    return json({
        success: true,
        data: {
            daily: dailyData
        }
    });
}

/**
 * Get current stats 
 */
async function getStats() {
	// Get data for all time (last 90 days - Cloudflare limit)
	const now = new Date();
	const oneYearAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

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
						limit: 10000
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
		datetimeStart: oneYearAgo.toISOString(),
		datetimeEnd: now.toISOString()
	});

	const rumData = data.viewer.accounts[0]?.rumPageloadEventsAdaptiveGroups || [];
	
	// Group by date
	const dailyMap = {};
	let totalAllTime = 0;
	rumData.forEach(group => {
		const date = group.dimensions.date;
		const count = group.count;
		if (!dailyMap[date]) {
			dailyMap[date] = 0;
		}
		dailyMap[date] += count;
		totalAllTime += count;
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
				pageLoads: todayCount  // Real metric
			},
			yesterday: {
				pageLoads: yesterdayCount  // Real metric
			},
			allTime: {
				totalPageLoads: totalAllTime,  // Real total from last 365 days
				totalDays: Object.keys(dailyMap).length  // Number of days with data
			}
		}
	});
}

/**
 * Get visitor analytics by country - Not available with current Cloudflare plan
 */
async function getCountries() {
	// Country breakdown requires Cloudflare Business/Enterprise plan
	// Return empty data to indicate feature not available
	return json({
		success: false,
		data: [],
		message: 'Geographic data requires Cloudflare Business or Enterprise plan'
	});
}
