import { openFrontend } from '../helpers/browser.js';
import { apiRequest, createAuthenticatedUser } from '../helpers/apiClient.js';
import { assert, assertStatus, assertSuccess } from '../helpers/assert.js';
import { sevenDaysAgo, today } from '../helpers/testData.js';

export default async function dailyCheckinTests(ctx) {
  const driver = ctx.driver;
  const user = await createAuthenticatedUser(driver, 'dailycheckin');

  await openFrontend(driver, '/daily-checkin');

  const questions = await apiRequest(driver, {
    method: 'GET',
    path: '/daily-checkin/questions',
    token: user.token
  });
  assertSuccess(questions, 'GET /api/daily-checkin/questions');
  assert(Array.isArray(questions.body.data) && questions.body.data.length > 0, 'Daily check-in questions should not be empty');

  const firstQuestion = questions.body.data[0];
  const categoryName = firstQuestion.category || 'MOOD';

  const categoryQuestions = await apiRequest(driver, {
    method: 'GET',
    path: `/daily-checkin/questions/category/${categoryName}`,
    token: user.token
  });
  assertSuccess(categoryQuestions, 'GET /api/daily-checkin/questions/category/{category}');

  const single = await apiRequest(driver, {
    method: 'POST',
    path: '/daily-checkin/single',
    token: user.token,
    body: {
      questionId: firstQuestion.id,
      answer: '4',
      metadata: '{}'
    }
  });
  assertStatus(single, 'POST /api/daily-checkin/single');

  const secondUser = await createAuthenticatedUser(driver, 'dailycheckinbatch');
  const batchResponses = questions.body.data.slice(0, Math.min(questions.body.data.length, 3)).map((question) => ({
    questionId: question.id,
    answer: question.questionType === 'YES_NO' ? 'YES' : '4',
    metadata: '{}'
  }));

  const batch = await apiRequest(driver, {
    method: 'POST',
    path: '/daily-checkin/batch',
    token: secondUser.token,
    body: { responses: batchResponses }
  });
  assertStatus(batch, 'POST /api/daily-checkin/batch');

  const todayResult = await apiRequest(driver, {
    method: 'GET',
    path: '/daily-checkin/today',
    token: secondUser.token
  });
  assertSuccess(todayResult, 'GET /api/daily-checkin/today');

  const dateResult = await apiRequest(driver, {
    method: 'GET',
    path: `/daily-checkin/date/${today()}`,
    token: secondUser.token
  });
  assertSuccess(dateResult, 'GET /api/daily-checkin/date/{date}');

  const analytics = await apiRequest(driver, {
    method: 'GET',
    path: `/daily-checkin/analytics?startDate=${sevenDaysAgo()}&endDate=${today()}`,
    token: secondUser.token
  });
  assertSuccess(analytics, 'GET /api/daily-checkin/analytics');

  const alerts = await apiRequest(driver, {
    method: 'GET',
    path: '/daily-checkin/alerts',
    token: secondUser.token
  });
  assertSuccess(alerts, 'GET /api/daily-checkin/alerts');

  const streak = await apiRequest(driver, {
    method: 'GET',
    path: '/daily-checkin/streak',
    token: secondUser.token
  });
  assertSuccess(streak, 'GET /api/daily-checkin/streak');

  const responseId = todayResult.body.data?.[0]?.id || batch.body.data?.[0]?.id;
  if (responseId) {
    const deleteResponse = await apiRequest(driver, {
      method: 'DELETE',
      path: `/daily-checkin/responses/${responseId}`,
      token: secondUser.token
    });
    assertStatus(deleteResponse, 'DELETE /api/daily-checkin/responses/{responseId}');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await dailyCheckinTests({ driver });
    console.log('Daily check-in tests passed');
  } finally {
    await driver.quit();
  }
}
