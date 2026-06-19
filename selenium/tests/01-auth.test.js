import { By, until } from 'selenium-webdriver';
import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser, loginUser, registerUser } from '../helpers/apiClient.js';
import { assert, assertStatus, assertSuccess } from '../helpers/assert.js';
import { config } from '../config.js';

export default async function authTests(ctx) {
  const driver = ctx.driver;
  const email = `auth.${Date.now()}@example.com`;
  const password = config.password;

  await openFrontend(driver, '/register');
  await driver.wait(until.elementLocated(By.name('name')), config.defaultTimeoutMs);
  await driver.findElement(By.name('name')).sendKeys('Auth Selenium User');
  await driver.findElement(By.name('email')).sendKeys(email);
  await driver.findElement(By.name('password')).sendKeys(password);
  await driver.findElement(By.name('confirmPassword')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeoutMs);

  const login = await apiRequest(driver, {
    method: 'POST',
    path: '/auth/login',
    body: { email, password }
  });
  assertSuccess(login, 'POST /api/auth/login');

  const token = login.body.data?.token || login.body.data?.accessToken;
  assert(token, 'POST /api/auth/login should return JWT token');

  const validate = await apiRequest(driver, {
    method: 'POST',
    path: '/auth/validate-token',
    token
  });
  assertSuccess(validate, 'POST /api/auth/validate-token');

  const forgot = await apiRequest(driver, {
    method: 'POST',
    path: '/auth/forgot-password',
    body: { email }
  });
  assertStatus(forgot, 'POST /api/auth/forgot-password');

  const reset = await apiRequest(driver, {
    method: 'POST',
    path: '/auth/reset-password',
    body: {
      token: 'invalid-selenium-token',
      newPassword: 'NewPassword@123',
      confirmPassword: 'NewPassword@123'
    }
  });
  assertStatus(reset, 'POST /api/auth/reset-password');

  const logout = await apiRequest(driver, {
    method: 'POST',
    path: '/auth/logout',
    token
  });
  assertStatus(logout, 'POST /api/auth/logout');

  ctx.user = await createAuthenticatedUser(driver, 'shared');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await authTests({ driver });
    console.log('Auth tests passed');
  } finally {
    await driver.quit();
  }
}
