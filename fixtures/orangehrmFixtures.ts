import { test as baseTest } from "@playwright/test";

import { LoginPage } from "../tests/uiTests/pages/pageObjects/loginPage";

type pages = {
  
    loginPage: LoginPage;

};

const testPages = baseTest.extend<pages>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

});

export const test = testPages;
export const expect = baseTest.expect;
