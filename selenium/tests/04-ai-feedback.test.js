import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assert, assertStatus, assertSuccess } from '../helpers/assert.js';
import { assessmentPayload } from '../helpers/testData.js';

async function ensureAssessment(driver, ctx, user) {
  if (ctx.assessmentId) return ctx.assessmentId;

  const create = await apiRequest(driver, {
    method: 'POST',
    path: '/lifestyle-assessment',
    token: user.token,
    body: assessmentPayload
  });
  assertSuccess(create, 'POST /api/lifestyle-assessment for AI feedback');

  const assessmentId = create.body.data?.id || create.body.data?.assessmentId;
  assert(assessmentId, `Assessment ID not found: ${JSON.stringify(create.body)}`);
  ctx.assessmentId = assessmentId;
  return assessmentId;
}

export default async function aiFeedbackTests(ctx) {
  const driver = ctx.driver;
  const user = ctx.user || await createAuthenticatedUser(driver, 'feedback');
  ctx.user = user;
  const assessmentId = await ensureAssessment(driver, ctx, user);

  await openFrontend(driver, '/ai-feedback-debug');

  const health = await apiRequest(driver, {
    method: 'GET',
    path: '/ai-feedback/health',
    token: user.token
  });
  assertStatus(health, 'GET /api/ai-feedback/health');

  const testGenerate = await apiRequest(driver, {
    method: 'POST',
    path: '/ai-feedback/test-generate',
    token: user.token
  });
  assertStatus(testGenerate, 'POST /api/ai-feedback/test-generate');

  const generate = await apiRequest(driver, {
    method: 'POST',
    path: `/ai-feedback/generate/${assessmentId}`,
    token: user.token
  });
  assertStatus(generate, 'POST /api/ai-feedback/generate/{assessmentId}');

  const getFeedback = await apiRequest(driver, {
    method: 'GET',
    path: `/ai-feedback/assessment/${assessmentId}`,
    token: user.token
  });
  assertStatus(getFeedback, 'GET /api/ai-feedback/assessment/{assessmentId}');

  const deleteFeedback = await apiRequest(driver, {
    method: 'DELETE',
    path: `/ai-feedback/assessment/${assessmentId}`,
    token: user.token
  });
  assertStatus(deleteFeedback, 'DELETE /api/ai-feedback/assessment/{assessmentId}');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await aiFeedbackTests({ driver });
    console.log('AI feedback tests passed');
  } finally {
    await driver.quit();
  }
}
