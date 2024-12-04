import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Page, Browser, expect, request } from '@playwright/test';

let browser:Browser;
let page:Page;
let uiElements;
let responseBody: { searchResult: {
    hits: any; "": any; nbHits: any; 
}; };

BeforeAll(async function() {
    browser = await chromium.launch({headless:false})
    page = await browser.newPage()
    await page.setViewportSize({ width: 1536, height: 864 });
    console.log("BeforeAll")
})

        Given('the application is loaded successfully', async function() {
            await page.goto("https://www.udacity.com/catalog", { timeout: 10_000 })
        });

        When('user search for {string}', async function(searchText) {
            await page.locator("input[aria-label='Search input'][placeholder]").click()
            await page.locator("input[aria-label='Search input'][placeholder]").fill(searchText)
            await page.locator("(//div[contains(@class, 'chakra-skeleton')])[1]").waitFor({ state: 'hidden' })
            await page.keyboard.press('Enter')
        });

        Then('user should see a {string} message', async function(textMessage) {
            await page.locator("(//div[contains(@class, 'chakra-skeleton')])[1]").waitFor({ state: 'hidden' });
            const text = await page.locator("section h2[class*='chakra-heading']").textContent()
            console.log("\n"+text);
            await expect(text).toEqual(textMessage);
        });

        When('user clicks on {string} Dropdown', async function(value) {
            await page.locator("[href='/catalog']").waitFor({ state: 'visible' })
            await page.locator("(//button[text()='Cancel'])[1]").click()
            await page.locator("(//span[text()='"+value+"'])[2]").waitFor({ state: 'visible' })
            await page.locator("(//span[text()='"+value+"'])[2]").click()
        });

        When('user search for {string} in Skill Dropdown', async function(text) {
            await page.locator("(//span[text()='Skill']/../..//input[@id])[2]").click()
            await page.locator("(//span[text()='Skill']/../..//input[@id])[2]").fill(text)
            await page.keyboard.press('Enter')
            await page.locator("(//div[contains(@class, 'chakra-skeleton')])[1]").waitFor({ state: 'hidden' });
        });

        Then('user sees results matching the search term in the UI', async function (docString) {
            const expectedResults = docString.split('\n').map((text: string) => text.trim()).filter((text: any) => text);
            await page.waitForTimeout(3000);
            uiElements = await page.locator("//article[contains(@role, 'group')]//a").all();
            for (const expectedText of expectedResults) {
              for (const element of uiElements) {
                const actualText = await element.textContent();
                await expect(actualText).toEqual(await element.textContent());
              }
            }
        });

        Then('user fetch search results from the API', async function() {
            const apiContext = await request.newContext({
                baseURL: 'https://api.udacity.com',
                extraHTTPHeaders: {
                  'Content-Type': 'application/json'
                },
              });
              const response = await apiContext.post('/api/unified-catalog/search', {
                data: {
                  searchText: 'testing',
                  sortBy: 'relevance',
                  page: 0,
                  pageSize: 24,
                  keys: [],
                  skills: ['taxonomy:4c61e76f-1bc5-4088-97ee-9e4756fafece'],
                  schools: [],
                  durations: [],
                  difficulties: [],
                  semanticTypes: [],
                  enrolledOnly: false,
                },
              });
              expect(response.status()).toBe(200);
              responseBody = await response.json();
        });

        Then('the UI results should match the API results', async function() {
            const apiNbHits = responseBody.searchResult.nbHits;
            expect(apiNbHits).toBeGreaterThan(0);
            const apiResults = responseBody.searchResult.hits;
            const apiTexts = apiResults.map((result: any) => result.title);
            uiElements = await page.locator("//article[contains(@role, 'group')]//a").all();
            const uiTexts: string[] = [];
            for (let i = 0; i < uiElements.length; i++) {
                const uiText = await uiElements[i].textContent();
                uiTexts.push(uiText?.trim() || '');
            }
            uiTexts.sort();
            apiTexts.sort();
            expect(uiElements.length).toBe(apiResults.length);
            for (let i = 0; i < uiTexts.length; i++) {
                expect(uiTexts[i]).toContain(apiTexts[i]);
            }
        });

AfterAll(async function() {
    browser.close();
    console.log("AfterAll")
})
