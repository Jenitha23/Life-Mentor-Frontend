import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assert, assertSuccess } from '../helpers/assert.js';
import { assessmentPayload, updatedAssessmentPayload } from '../helpers/testData.js';

export default async function lifestyleAssessmentTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'assessment');
  ctx.user = user;

  await openFrontend(driver, '/dashboard/assessment/create');

  const create = await apiRequest(driver, {
    method: 'POST',
    path: '/lifestyle-assessment',
    token: user.token,
    body: assessmentPayload
  });
  assertSuccess(create, 'POST /api/lifestyle-assessment');

  const assessmentId = create.body.data?.id || create.body.data?.assessmentId;
  assert(assessmentId, `Assessment ID not found: ${JSON.stringify(create.body)}`);
  ctx.assessmentId = assessmentId;

  const get = await apiRequest(driver, {
    method: 'GET',
    path: '/lifestyle-assessment',
    token: user.token
  });
  assertSuccess(get, 'GET /api/lifestyle-assessment');

  const update = await apiRequest(driver, {
    method: 'PUT',
    path: '/lifestyle-assessment',
    token: user.token,
    body: updatedAssessmentPayload
  });
  assertSuccess(update, 'PUT /api/lifestyle-assessment');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await lifestyleAssessmentTests({ driver });
    console.log('Lifestyle assessment tests passed');
  } finally {
    await driver.quit();
  }
}
