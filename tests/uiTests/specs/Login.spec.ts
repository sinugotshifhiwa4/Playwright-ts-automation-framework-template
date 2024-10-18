import { test } from "../../../fixtures/orangehrmFixtures";
import ENV from "../../utils/env";

test.describe.only("Login Test Suite", () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigateTo(ENV.URL!);
        await loginPage.isCompanyLogoIsPresent();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test(`Login to Application`, async ({ loginPage }) => {
        await loginPage.loginToApplication(ENV.USERNAME!, ENV.PASSWORD!);
        await loginPage.isErrorMessageNotVisible();
    });

    test(`Login with Invalid Credentials`, async ({ loginPage }) => {
        await loginPage.loginToApplication(ENV.USERNAME!, 'password');
        await loginPage.isErrorMessageVisible();
    });
});