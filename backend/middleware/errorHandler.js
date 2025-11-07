export const errorHandler = (err, c) => {
  console.error('Unhandled error:', err)
  
  return c.json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  }, 500)
}

export const notFoundHandler = (c) => {
  return c.json({
    error: 'Not Found',
    message: `Route ${c.req.method} ${c.req.path} not found`,
    timestamp: new Date().toISOString()
  }, 404)
}