import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assertStatus, assertSuccess } from '../helpers/assert.js';
import { sevenDaysAgo, today } from '../helpers/testData.js';

export default async function wellbeingTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'wellbeing');
  ctx.user = user;

  await openFrontend(driver, '/wellbeing');

  const summary = await apiRequest(driver, {
    method: 'GET',
    path: '/wellbeing/summary',
    token: user.token
  });
  assertStatus(summary, 'GET /api/wellbeing/summary');

  const alerts = await apiRequest(driver, {
    method: 'GET',
    path: '/wellbeing/alerts',
    token: user.token
  });
  assertSuccess(alerts, 'GET /api/wellbeing/alerts');

  const trends = await apiRequest(driver, {
    method: 'GET',
    path: `/wellbeing/trends?startDate=${sevenDaysAgo()}&endDate=${today()}`,
    token: user.token
  });
  assertStatus(trends, 'GET /api/wellbeing/trends');

  const recommendations = await apiRequest(driver, {
    method: 'GET',
    path: '/wellbeing/recommendations',
    token: user.token
  });
  assertStatus(recommendations, 'GET /api/wellbeing/recommendations');

  const firstAlertId = alerts.body.data?.[0]?.id;
  if (firstAlertId) {
    const resolve = await apiRequest(driver, {
      method: 'POST',
      path: `/wellbeing/alerts/${firstAlertId}/resolve`,
      token: user.token
    });
    assertStatus(resolve, 'POST /api/wellbeing/alerts/{alertId}/resolve');
  } else {
    console.log('No active wellbeing alert found, resolve endpoint skipped for this run.');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await wellbeingTests({ driver });
    console.log('Wellbeing tests passed');
  } finally {
    await driver.quit();
  }
}
