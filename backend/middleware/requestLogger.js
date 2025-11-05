export const requestLogger = async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const url = c.req.url
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - Started`)
  
  await next()
  
  const duration = Date.now() - start
  const status = c.res.status
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status} (${duration}ms)`)
}