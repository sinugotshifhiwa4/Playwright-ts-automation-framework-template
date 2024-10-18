import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import logger from './loggerUtil';

class SecretKeyGenerator {
  /**
   * Generates a secret key and stores it in the .env file.
   * @param {string} keyName - The name of the key to store in the .env file (default is 'SECRET_KEY').
   * @returns {string} The generated secret key.
   */
  static generateAndStoreSecretKey(keyName: string = 'SECRET_KEY'): string {
    const secretKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit key (32 bytes)
    const envFilePath = path.resolve(process.cwd(), 'envs/.env');

    // Create .env file if it doesn't exist
    if (!fs.existsSync(envFilePath)) {
      fs.writeFileSync(envFilePath, '');
      logger.info('.env file created');
    }

    // Load the current .env content
    let envConfig = fs.readFileSync(envFilePath, 'utf8');

    // Check if the specified key exists and replace it, otherwise append it
    if (envConfig.includes(`${keyName}=`)) {
      envConfig = envConfig.replace(new RegExp(`${keyName}=.*?\n`), `${keyName}=${secretKey}\n`);
    } else {
      envConfig += `${keyName}=${secretKey}\n`;
    }

    // Write the updated configuration back to the .env file
    fs.writeFileSync(envFilePath, envConfig, 'utf8');
    logger.info(`${keyName} written to .env file`);

    return secretKey;
  }
}

export default SecretKeyGenerator;
