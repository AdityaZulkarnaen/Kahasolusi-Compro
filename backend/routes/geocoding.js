import { Hono } from 'hono'

const geocodingRoutes = new Hono()

// GET /api/geocoding?address=... - Geocode address to coordinates
geocodingRoutes.get('/', async (c) => {
  try {
    const address = c.req.query('address')
    
    if (!address) {
      return c.json({ error: 'Address parameter is required' }, 400)
    }

    // Try multiple strategies for better results
    const searchVariants = [
      address, // Full address
      address.split(',').slice(-2).join(',').trim(), // Last 2 parts (City, Province)
      address.split(',').slice(-1).join(',').trim(), // Last part only (Province/City)
    ]

    for (const searchQuery of searchVariants) {
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        `format=json&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `countrycodes=id&` +
        `limit=1&` +
        `addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Kahasolusi-Website/1.0'
          }
        }
      )
      
      const data = await response.json()
      
      if (data && data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          display_name: data[0].display_name,
          address: data[0].address
        }
        return c.json(coords)
      }
      
      // Small delay between attempts to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    return c.json({ error: 'Address not found' }, 404)
    
  } catch (error) {
    console.error('Geocoding error:', error)
    return c.json({ error: 'Geocoding service unavailable' }, 500)
  }
})

export default geocodingRoutes
