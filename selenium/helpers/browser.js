import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import { config } from '../config.js';

export async function createDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1440,1000');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--no-sandbox');

  if (config.headless) {
    options.addArguments('--headless=new');
  }

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

export async function openFrontend(driver, path = '/') {
  await driver.get(`${config.frontendUrl}${path}`);
}

export async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
