import { createDriver, openFrontend } from './helpers/browser.js';
import authTests from './tests/01-auth.test.js';
import profileTests from './tests/02-profile.test.js';
import lifestyleAssessmentTests from './tests/03-lifestyle-assessment.test.js';
import aiFeedbackTests from './tests/04-ai-feedback.test.js';
import aiChatTests from './tests/05-ai-chat.test.js';
import dailyCheckinTests from './tests/06-daily-checkin.test.js';
import goalTests from './tests/07-goals.test.js';
import wellbeingTests from './tests/08-wellbeing.test.js';
import notificationTests from './tests/09-notifications.test.js';
import publicPagesTests from './tests/10-public-pages.test.js';

const testSuites = [
  ['Public pages', publicPagesTests],
  ['Authentication', authTests],
  ['Profile', profileTests],
  ['Lifestyle Assessment', lifestyleAssessmentTests],
  ['AI Feedback', aiFeedbackTests],
  ['AI Chat', aiChatTests],
  ['Daily Check-in', dailyCheckinTests],
  ['Goals', goalTests],
  ['Wellbeing', wellbeingTests],
  ['Notifications', notificationTests]
];

const driver = await createDriver();
const ctx = { driver };
const results = [];

try {
  await openFrontend(driver, '/');

  for (const [name, fn] of testSuites) {
    const startedAt = Date.now();
    process.stdout.write(`\n▶ Running ${name} tests...\n`);

    try {
      await fn(ctx);
      const duration = ((Date.now() - startedAt) / 1000).toFixed(2);
      console.log(`✅ ${name} passed in ${duration}s`);
      results.push({ name, status: 'PASSED', duration });
    } catch (error) {
      const duration = ((Date.now() - startedAt) / 1000).toFixed(2);
      console.error(`❌ ${name} failed in ${duration}s`);
      console.error(error.stack || error.message);
      results.push({ name, status: 'FAILED', duration, error: error.message });
      process.exitCode = 1;
      break;
    }
  }
} finally {
  await driver.quit();
}

console.log('\n==============================');
console.log('Life Mentor Selenium Test Summary');
console.log('==============================');
for (const result of results) {
  console.log(`${result.status === 'PASSED' ? '✅' : '❌'} ${result.name} - ${result.status} (${result.duration}s)`);
}

if (process.exitCode === 1) {
  console.log('\nSome tests failed. Fix the failed feature first, then run again.');
} else {
  console.log('\nAll Selenium feature tests passed.');
}
