import SecretKeyGenerator from "../utils/secretKeyGenerator";
import ErrorHandler from "../helpers/errorHandler";


/**
 * Generates a secret key using the SecretKeyGenerator class and stores it in the .env file.
 * If an error occurs during key generation, it is handled by the ErrorHandler.
 */
function generateKey(): string | undefined {
    try {
        return SecretKeyGenerator.generateAndStoreSecretKey('UAT_SECRET_KEY');
    } catch (error) {
        ErrorHandler.handleError(error, `generateKey`, `Failed to generate secret key`);
    }
}

// Execute the key generation when this file is run
generateKey();
