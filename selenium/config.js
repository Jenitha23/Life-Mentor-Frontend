export const config = {
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:8080/api',
  headless: process.env.HEADLESS !== 'false',
  slowMoMs: Number(process.env.SLOW_MO_MS || 0),
  defaultTimeoutMs: Number(process.env.DEFAULT_TIMEOUT_MS || 15000),
  password: process.env.TEST_PASSWORD || 'Password@123',
  reusableEmail: process.env.TEST_EMAIL || '',
  reusableName: process.env.TEST_NAME || 'Selenium Test User'
};
