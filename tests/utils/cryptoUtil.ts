import * as path from 'path';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import * as dotenv from 'dotenv';
import logger from './loggerUtil';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), 'envs/.env') });


/**
 * Generates a random salt of specified length.
 * @param {number} length - The length of the salt in bytes.
 * @returns {string} The generated salt as a hexadecimal string.
 */
const generateSalt = (length: number = 16): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generates a random secret key for encryption and writes it to the .env file.
 * If SECRET_KEY already exists, it updates the key with a new one.
 * @returns {string} The generated secret key.
 */
// const generateAndStoreSecretKey = (keyName: string = 'SECRET_KEY'): string => {
//   const secretKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit key (32 bytes)
//   const envFilePath = path.resolve(process.cwd(), 'envs/.env');

//   // Create .env file if it doesn't exist
//   if (!fs.existsSync(envFilePath)) {
//     fs.writeFileSync(envFilePath, '');
//     logger.info('.env file created');
//   }

//   // Load the current .env content
//   let envConfig = fs.readFileSync(envFilePath, 'utf8');

//   // Check if the specified key exists and replace it, otherwise append it
//   if (envConfig.includes(`${keyName}=`)) {
//     envConfig = envConfig.replace(new RegExp(`${keyName}=.*?\n`), `${keyName}=${secretKey}\n`);
//   } else {
//     envConfig += `${keyName}=${secretKey}\n`;
//   }

//   // Write the updated configuration back to the .env file
//   fs.writeFileSync(envFilePath, envConfig, 'utf8');
//   logger.info(`${keyName} written to .env file`);
  
//   return secretKey;
// };

  
  
/**
 * Encrypts the given plaintext using AES encryption with a randomly generated salt and IV.
 * @param {string} text - The plaintext to encrypt.
 * @param {string} secretKey - The secret key for encryption.
 * @returns {string} The encrypted ciphertext, prefixed with the salt and IV, separated by colons.
 */
export function encrypt(text: string, secretKey: string): string {
  const salt = generateSalt();
  const iv = crypto.randomBytes(16).toString('hex');

  const key = CryptoJS.PBKDF2(secretKey, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const cipherText = CryptoJS.AES.encrypt(text, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

  return `${salt}:${iv}:${cipherText}`;
}

/**
 * Decrypts the given ciphertext using AES decryption with the provided salt and IV.
 * @param {string} cipherText - The ciphertext to decrypt, including the salt and IV, separated by colons.
 * @param {string} secret_key - The secret key for decryption.
 * @returns {string} The decrypted plaintext.
 * @throws Will throw an error if decryption fails.
 */
export function decrypt(cipherText: string | undefined, secret_key: string): string {
    if (!cipherText) {
      throw new Error('cipherText is undefined or empty.');
    }
  
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
        logger.error('Invalid cipherText format. Expected format: salt:iv:encrypted');
      throw new Error('Invalid cipherText format. Expected format: salt:iv:encrypted');
    }
  
    const [salt, iv, encrypted] = parts;
  
    const key = CryptoJS.PBKDF2(secret_key, CryptoJS.enc.Hex.parse(salt), {
      keySize: 256 / 32,
      iterations: 1000,
    });
  
    const bytes = CryptoJS.AES.decrypt(encrypted, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption failed. Invalid key or ciphertext.');
    }
    return decrypted;
  }
  
