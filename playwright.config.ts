import { defineConfig, devices } from '@playwright/test';
import { OrtoniReportConfig } from "ortoni-report";


// Set Ortoni report config
const reportConfig: OrtoniReportConfig = {
  preferredTheme: "dark",
  filename: "ortoni-report",
  authorName: "Tshifhiwa Sinugo",
  projectName: "Playwright Automation Framework Template",
  testType: "Release 1.0",
  title: "Ortoni Report By Tshifhiwa Sinugo",
  logo: process.cwd() + "/companyLogo/playwright-logo.png",
  base64Image: true,
  folderPath: "reports",
  showProject: true
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 50 * 1000,
  expect : {
    timeout: 50 * 1000,
  },
  testDir: './tests',
  globalSetup: './tests/utils/globalSetup',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ['allure-playwright'], ['ortoni-report', reportConfig], ['dot']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

     // define a setup project
    //  {
    //   name: "setup",
    //   use: { ...devices["Desktop Chrome"] },
    //   testMatch: /.*\.setup\.ts/,
    // },
    // {
    //   name: "chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     // set storage state for tests
    //     storageState: ".auth/login.json",
    //   },
    //   // declare that the `setup` project is a dependency
    //   dependencies: ["setup"],
    // },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     // set storage state for tests
    //     storageState: ".auth/login.json",
    //   },
    //   // declare that the `setup` project is a dependency
    //   dependencies: ["setup"],
    // },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //     // set storage state for tests
    //     storageState: ".auth/login.json",
    //   },
    //   // declare that the `setup` project is a dependency
    //   dependencies: ["setup"],
    // },
    // {
    //   name: "Edge",
    //   use: {
    //     ...devices["Desktop Edge"],
    //     channel: "msedge",
    //     // set storage state for tests
    //     storageState: ".auth/login.json",
    //   },
    //   // declare that the `setup` project is a dependency
    //   dependencies: ["setup"],
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
