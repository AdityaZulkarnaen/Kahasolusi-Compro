export const corsConfig = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:4173',
    'http://localhost:3000',
    'https://kahasolusi.com'
  ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}