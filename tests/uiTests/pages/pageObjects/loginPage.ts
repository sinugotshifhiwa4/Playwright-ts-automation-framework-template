import { Locator, Page } from 'playwright/test';
import BasePage from '../base/basePage';
import ErrorHandler from '../../../helpers/errorHandler';

export class LoginPage extends BasePage {

    readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;
    private readonly companyLogo: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.usernameInput = page.locator(`input[name='username']`);
        this.passwordInput = page.locator(`input[name='password']`);
        this.loginButton = page.locator(`//button[contains(., 'Login')]`);
        this.errorMessage = page.locator(`//div[@role='alert']`);
        this.companyLogo = page.locator(`img[alt='company-branding']`);
    }

    async isCompanyLogoIsPresent() {

        try{
            await this.verifyElementVisible(this.companyLogo, 'Company Logo');
        } catch (error) {
            ErrorHandler.handleError(error, 'isCompanyLogoIsPresent', 'Failed to verify Company Logo');
            throw error;
        }
    }

    async fillUsername(username: string) {
        try{
            await this.fillElement(this.usernameInput, username, 'Username');
        } catch (error) {
            ErrorHandler.handleError(error, 'fillUsername', 'Failed to fill Username');
            throw error;
        }
    }

    async fillPassword(password: string) {
        try{
            await this.fillElement(this.passwordInput, password, 'Password');
        } catch (error) {
            ErrorHandler.handleError(error, 'fillPassword', 'Failed to fill Password');
            throw error;
        }
    }

    async clickLoginButton() {
        try{
            await this.clickElement(this.loginButton, 'Login Button');
        } catch (error) {
            ErrorHandler.handleError(error, 'clickLoginButton', 'Failed to click Login Button');
            throw error;
        }
    }

    async isErrorMessageVisible() {
        try{
            await this.verifyElementVisible(this.errorMessage, 'Error Message');
        } catch (error) {
            ErrorHandler.handleError(error, 'isErrorMessageVisible', 'Failed to verify Error Message');
            throw error;
        }
    }

    async isErrorMessageNotVisible() {
        try{
            await this.verifyElementNotVisible(this.errorMessage, 'Error Message');
        } catch (error) {
            ErrorHandler.handleError(error, 'isErrorMessageNotVisible', 'Failed to verify Error Message');
            throw error;
        }
    }

    async loginToApplication(username: string, password: string) {
        try{
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
        } catch (error) {
            ErrorHandler.handleError(error, 'loginToApplication', 'Failed to login to Application');
            throw error;
        }
    }

}