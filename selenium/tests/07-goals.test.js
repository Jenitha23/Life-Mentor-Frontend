import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assert, assertStatus, assertSuccess } from '../helpers/assert.js';
import { goalPayload, tomorrow } from '../helpers/testData.js';

export default async function goalTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'goals');
  ctx.user = user;

  await openFrontend(driver, '/goals');

  const create = await apiRequest(driver, {
    method: 'POST',
    path: '/goals',
    token: user.token,
    body: goalPayload()
  });
  assertSuccess(create, 'POST /api/goals');

  const goalId = create.body.data?.id || create.body.data?.goalId;
  assert(goalId, `Goal ID not found: ${JSON.stringify(create.body)}`);

  const all = await apiRequest(driver, {
    method: 'GET',
    path: '/goals',
    token: user.token
  });
  assertSuccess(all, 'GET /api/goals');

  const active = await apiRequest(driver, {
    method: 'GET',
    path: '/goals/active',
    token: user.token
  });
  assertSuccess(active, 'GET /api/goals/active');

  const overdue = await apiRequest(driver, {
    method: 'GET',
    path: '/goals/overdue',
    token: user.token
  });
  assertSuccess(overdue, 'GET /api/goals/overdue');

  const byId = await apiRequest(driver, {
    method: 'GET',
    path: `/goals/${goalId}`,
    token: user.token
  });
  assertSuccess(byId, 'GET /api/goals/{goalId}');

  const update = await apiRequest(driver, {
    method: 'PUT',
    path: `/goals/${goalId}`,
    token: user.token,
    body: {
      goalType: 'SLEEP',
      targetValue: 9,
      targetDate: tomorrow(),
      description: 'Updated Selenium goal'
    }
  });
  assertSuccess(update, 'PUT /api/goals/{goalId}');

  const progress = await apiRequest(driver, {
    method: 'PATCH',
    path: '/goals/progress',
    token: user.token,
    body: {
      goalId,
      currentValue: 5,
      notes: 'Progress updated by Selenium'
    }
  });
  assertStatus(progress, 'PATCH /api/goals/progress');

  const complete = await apiRequest(driver, {
    method: 'POST',
    path: `/goals/${goalId}/complete`,
    token: user.token
  });
  assertStatus(complete, 'POST /api/goals/{goalId}/complete');

  const deleteGoal = await apiRequest(driver, {
    method: 'DELETE',
    path: `/goals/${goalId}`,
    token: user.token
  });
  assertStatus(deleteGoal, 'DELETE /api/goals/{goalId}');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await goalTests({ driver });
    console.log('Goal tests passed');
  } finally {
    await driver.quit();
  }
}
