import { test as setup } from "../../../../fixtures/orangehrmFixtures";
import logger from "../../../utils/loggerUtil";
import ENV from '../../../utils/env';

// Setup function to handle authenticated session for future tests
setup(`Authenticated`, async ({ page, loginPage }) => {
    
    // Step 1: Navigate to the application's login page using the URL from the environment configuration.
    await page.goto(ENV.URL!);

    // Step 2: Check if the Company logo is displayed on the login page.
    // This verifies that the page has loaded correctly.
    await loginPage.isCompanyLogoIsPresent();
    
    // Step 3: Log in to the application using environment credentials (email and password).
    // These credentials are decrypted securely before use.
    await loginPage.loginToApplication(ENV.USERNAME!, ENV.PASSWORD!);
   
    // Step 4: Ensure the login was successful by verifying the absence of any error messages.
    // This checks if the welcome text or dashboard is visible post-login.
    await loginPage.isErrorMessageNotVisible();
    
    // Log successful login for debugging or audit purposes.
    logger.info(`Login Successful`);

    // Step 5: Save the authentication state (session) to a JSON file.
    // This file is used in future tests to avoid repeated logins, improving overall test performance.
    await page.context().storageState({ path: `.auth/login.json` });

    // Log the completion of session setup and successful saving of the state for reuse.
    logger.info(`Session setup completed and saved`);
});
