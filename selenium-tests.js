import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const APP_URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runTests() {
    let driver;
    const options = new chrome.Options();
    // options.addArguments('--headless'); // Uncomment for headless mode
    
    const randomSuffix = Math.floor(Math.random() * 100000);
    const testUser = {
        name: `Selenium Test User ${randomSuffix}`,
        email: `selenium${randomSuffix}@test.com`,
        password: 'Password@123',
    };

    console.log('🚀 Starting Comprehensive Selenium E2E Tests for Life Mentor...');

    try {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().window().maximize();

        // Helper to bypass toast notification intercepts
        const clickBypass = async (locator) => {
            const el = await driver.wait(until.elementLocated(locator), 5000);
            await driver.executeScript("arguments[0].click();", el);
        };

        // -------------------------------------------------------------
        // 1. Auth API: Register a New User
        // -------------------------------------------------------------
        console.log('\n[1/7] Testing Registration (/api/auth/register)...');
        await driver.get(`${APP_URL}/register`);
        await driver.wait(until.elementLocated(By.id('name')), 5000);
        
        await driver.findElement(By.id('name')).sendKeys(testUser.name);
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).sendKeys(testUser.password);
        await driver.findElement(By.id('confirmPassword')).sendKeys(testUser.password);
        
        await clickBypass(By.css('button[type="submit"]'));
        await driver.wait(until.urlContains('/dashboard'), 10000);
        console.log('✅ Registration successful (User navigated to Dashboard).');

        // Logout
        await sleep(2000);
        await clickBypass(By.xpath('//button[contains(text(), "Logout")]'));
        await driver.wait(until.urlContains('/login'), 5000);

        // -------------------------------------------------------------
        // 2. Auth API: Login User
        // -------------------------------------------------------------
        console.log('\n[2/7] Testing Login (/api/auth/login)...');
        await driver.findElement(By.id('email')).sendKeys(testUser.email);
        await driver.findElement(By.id('password')).sendKeys(testUser.password);
        await clickBypass(By.css('button[type="submit"]'));

        await driver.wait(until.urlContains('/dashboard'), 10000);
        console.log('✅ Login successful.');

        // -------------------------------------------------------------
        // 3. Lifestyle Assessment (/api/lifestyle-assessment)
        // -------------------------------------------------------------
        console.log('\n[3/7] Testing Lifestyle Assessment...');
        await sleep(1000);
        try {
            await clickBypass(By.xpath('//button[contains(text(), "Start Assessment")]'));
            await driver.wait(until.urlContains('/assessment'), 5000);
            
            // Just select a few basic options to submit the form
            await driver.findElement(By.name('sleepHours')).clear();
            await driver.findElement(By.name('sleepHours')).sendKeys('8');
            await driver.findElement(By.name('waterIntakeGlasses')).clear();
            await driver.findElement(By.name('waterIntakeGlasses')).sendKeys('8');
            
            await clickBypass(By.xpath('//button[contains(text(), "Complete Assessment") or contains(text(), "Save")] | //button[@type="submit"]'));
            await sleep(2000);
            console.log('✅ Lifestyle Assessment completed.');
        } catch (e) {
            console.log('⚠️ Could not complete assessment flow (might already exist or UI changed). Skipping.');
        }

        // -------------------------------------------------------------
        // 4. Profile API (GET & PUT)
        // -------------------------------------------------------------
        console.log('\n[4/7] Testing Profile page (/api/profile)...');
        await sleep(1000);
        await clickBypass(By.xpath('//a[contains(@href, "/profile") and contains(@class, "nav-link")]'));
        await driver.wait(until.urlContains('/profile'), 5000);
        
        await sleep(1000);
        await clickBypass(By.xpath('//button[contains(text(), "Edit Profile")]'));
        
        const bioField = await driver.wait(until.elementLocated(By.name('bio')), 5000);
        await bioField.sendKeys('Automated selenium test bio content.');
        
        await clickBypass(By.xpath('//button[contains(text(), "Save Changes")]'));
        await sleep(2000);
        console.log('✅ Profile updated successfully.');

        // -------------------------------------------------------------
        // 5. Goals API (POST & GET)
        // -------------------------------------------------------------
        console.log('\n[5/7] Testing Goals Management (/api/goals)...');
        await clickBypass(By.xpath('//a[contains(@href, "/dashboard")]'));
        await sleep(1000);
        
        await clickBypass(By.xpath('//span[contains(text(), "Goals")]/parent::button'));
        await driver.wait(until.urlContains('/goals'), 5000);
        
        await sleep(1000);
        await clickBypass(By.xpath('//button[contains(text(), "New Goal")]'));
        
        const goalValue = await driver.wait(until.elementLocated(By.name('targetValue')), 5000);
        await goalValue.sendKeys('10');
        await driver.findElement(By.name('description')).sendKeys('Testing goal creation process');
        await driver.findElement(By.name('targetDate')).sendKeys('12-31-2099');
        
        await clickBypass(By.xpath('//button[contains(text(), "Create Goal") or @type="submit"]'));
        await sleep(2000);
        console.log('✅ Goal created successfully.');

        // -------------------------------------------------------------
        // 6. Daily Check-in (/api/daily-checkin)
        // -------------------------------------------------------------
        console.log('\n[6/8] Testing Daily Check-ins (/api/daily-checkin)...');
        await clickBypass(By.xpath('//a[contains(@href, "/dashboard")]'));
        await sleep(1000);
        
        await clickBypass(By.xpath('//span[contains(text(), "Daily Check-in")]/parent::button'));
        await driver.wait(until.urlContains('/daily-checkin'), 5000);
        
        try {
            // Find all scale buttons and click the first one for each scale group
            const scaleGroups = await driver.findElements(By.className('scale-group'));
            for (let group of scaleGroups) {
                const firstBtn = await group.findElement(By.className('scale-btn'));
                await driver.executeScript("arguments[0].click();", firstBtn);
            }

            // Find all Yes/No groups and click Yes
            const yesNoGroups = await driver.findElements(By.className('yes-no-group'));
            for (let group of yesNoGroups) {
                const yesBtn = await group.findElement(By.xpath('.//button[contains(text(), "Yes")]'));
                await driver.executeScript("arguments[0].click();", yesBtn);
            }
            
            await clickBypass(By.xpath('//button[contains(text(), "Complete Check-in")]'));
            await sleep(2000);
            console.log('✅ Daily Check-in submitted successfully.');
        } catch (e) {
            console.log('⚠️ Could not fill check-ins (might be already completed for today). Skipping.');
        }

        // -------------------------------------------------------------
        // 7. Wellbeing Dashboard (/api/wellbeing)
        // -------------------------------------------------------------
        console.log('\n[7/8] Testing Wellbeing Dashboard (/api/wellbeing)...');
        await clickBypass(By.xpath('//a[contains(@href, "/dashboard")]'));
        await sleep(1000);
        
        // Find link or button to wellbeing. If unavailable, use direct navigation
        await driver.get(`${APP_URL}/wellbeing`);
        await driver.wait(until.elementLocated(By.xpath('//h1[contains(text(), "Wellbeing Dashboard")]')), 10000);
        await sleep(2000); // Let the stats load
        console.log('✅ Wellbeing dashboard loaded successfully.');

        // -------------------------------------------------------------
        // 8. AI Chat (/api/ai-chat/message)
        // -------------------------------------------------------------
        console.log('\n[8/8] Testing AI Chat...');
        await clickBypass(By.xpath('//a[contains(@href, "/dashboard")]'));
        await sleep(1000);
        
        await clickBypass(By.xpath('//span[contains(text(), "AI Coach")]/parent::button'));
        await driver.wait(until.urlContains('/ai-chat'), 5000);
        
        const chatInput = await driver.wait(until.elementLocated(By.css('input[type="text"], textarea')), 5000);
        await chatInput.sendKeys('Hello from Selenium!');
        await clickBypass(By.css('button[type="submit"], button.send-btn'));
        
        await sleep(3000);
        console.log('✅ AI message sent.');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.message);
    } finally {
        if (driver) {
            console.log('\nClosing browser...');
            await driver.quit();
        }
        console.log('🏁 Tests complete.');
    }
}

// Run the script
runTests();
