import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assertStatus, assertSuccess } from '../helpers/assert.js';

export default async function notificationTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'notifications');
  ctx.user = user;

  await openFrontend(driver, '/notifications');

  const list = await apiRequest(driver, {
    method: 'GET',
    path: '/notifications',
    token: user.token
  });
  assertSuccess(list, 'GET /api/notifications');

  const unread = await apiRequest(driver, {
    method: 'GET',
    path: '/notifications/unread-count',
    token: user.token
  });
  assertSuccess(unread, 'GET /api/notifications/unread-count');

  const firstNotificationId = list.body.data?.[0]?.id;
  if (firstNotificationId) {
    const read = await apiRequest(driver, {
      method: 'POST',
      path: `/notifications/${firstNotificationId}/read`,
      token: user.token
    });
    assertStatus(read, 'POST /api/notifications/{notificationId}/read');
  } else {
    console.log('No notification found, single mark-read endpoint skipped for this run.');
  }

  const readAll = await apiRequest(driver, {
    method: 'POST',
    path: '/notifications/read-all',
    token: user.token
  });
  assertStatus(readAll, 'POST /api/notifications/read-all');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await notificationTests({ driver });
    console.log('Notification tests passed');
  } finally {
    await driver.quit();
  }
}
