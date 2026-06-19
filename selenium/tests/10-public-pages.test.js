import { By, until } from 'selenium-webdriver';
import { openFrontend } from '../helpers/browser.js';
import { config } from '../config.js';
import { assert } from '../helpers/assert.js';

const publicRoutes = ['/', '/about', '/features', '/pricing', '/contact', '/terms', '/privacy', '/login', '/register', '/forgot-password'];

export default async function publicPagesTests(ctx) {
  const driver = ctx.driver;

  for (const route of publicRoutes) {
    await openFrontend(driver, route);
    await driver.wait(until.elementLocated(By.css('body')), config.defaultTimeoutMs);
    const bodyText = await driver.findElement(By.css('body')).getText();
    assert(bodyText.length > 0, `${route} should render visible content`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { createDriver } = await import('../helpers/browser.js');
  const driver = await createDriver();
  try {
    await publicPagesTests({ driver });
    console.log('Public page tests passed');
  } finally {
    await driver.quit();
  }
}
