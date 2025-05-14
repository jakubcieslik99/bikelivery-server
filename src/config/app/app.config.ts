export default () => ({
  app: {
    env: process.env.ENV || 'development',
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  cors: { apiUrl: process.env.API_URL || '', appUrl: process.env.APP_URL || '' },

  throttlers: [
    { name: 'short', limit: 3, ttl: 2 * 1000 },
    { name: 'long', limit: 55, ttl: 60 * 1000 },
  ],

  cookieSession: { secret: process.env.COOKIE_SESSION_SECRET, maxAge: 180 * 24 * 60 * 60 * 1000 },

  jwt: {
    accessToken: { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: 10 * 60 },
    refreshToken: { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: 180 * 24 * 60 * 60 },
  },

  googleDirections: { apiKey: process.env.GOOGLE_DIRECTIONS_API_KEY },
});
