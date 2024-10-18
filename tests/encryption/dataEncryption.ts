import * as fs from "fs";
import * as path from "path";
import { encrypt } from "../utils/cryptoUtil";
import logger from "../utils/loggerUtil";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), "envs/.env") });

export default class DataEncryption {
  private configDir: string;
  private envFilePath: string;
  private secretKey: string;

  constructor() {
    // Define the directory where environment files are stored
    this.configDir = path.join(process.cwd(), "envs");

    // Define the path for the specific environment file (e.g., .env.uat)
    this.envFilePath = path.join(this.configDir, ".env.uat");

    // Retrieve or generate the secret key
    this.secretKey = this.getSecretKey();
  }

  // Getter method to fetch the UAT_SECRET_KEY from environment variables
  private getSecretKey(): string {
    const secretKey = process.env.UAT_SECRET_KEY;
    if (!secretKey) {
      throw new Error(`UAT_SECRET_KEY not found in .env file`);
    }
    return secretKey;
  }
  /**
   * Encrypts the contents of the specified environment file by encrypting
   * the values for each key-value pair.
   */
  public encryptEnvParameters(): void {
    try {
      // Read the content of the environment file as a string
      const envFileContent = fs.readFileSync(this.envFilePath, "utf8");

      // Split the content by line and map over each line to encrypt the value part
      const lines = envFileContent.split("\n");
      const encryptedLines = lines.map((line) => {
        // Split each line into key and value
        const [key, value] = line.split("=");
        // If a value exists, encrypt it; otherwise, leave the line as-is
        return value ? `${key}=${encrypt(value.trim(), this.secretKey)}` : line;
      });

      // Write the encrypted content back to the environment file
      fs.writeFileSync(this.envFilePath, encryptedLines.join("\n"), "utf8");

      // Count how many variables were encrypted
      const encryptedCount = lines.filter((line) => line.includes("=")).length;

      // Get the relative path from the current directory to the .env.uat file
      const relativePath = path.relative(process.cwd(), this.envFilePath);

      // Log the completion message with detailed information
      logger.info(
        `Encryption complete. Successfully encrypted ${encryptedCount} variable(s) in the ${relativePath} file.`
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Failed to encrypt env file: ${this.envFilePath}. Error: ${error.message}`
        );
      } else {
        logger.error(
          `Failed to encrypt env file: ${this.envFilePath}. Unknown error: ${error}`
        );
      }
      throw error;
    }
  }
}

/**
 * Runs the data encryption process to encrypt environment parameters in the .env.uat file.
 *
 * The process will read the content of the .env.uat file, split it by line, map over each line to encrypt
 * the value part, and write the encrypted content back to the .env.uat file.
 *
 * If any error occurs during the process, it will be logged and re-thrown.
 */
function runEncryption(): void {
  try {
    const dataEncryption = new DataEncryption();
    
    // Encrypt environment parameters
    dataEncryption.encryptEnvParameters();
    
    console.log(`Data encryption process completed successfully.`);
  } catch (error) {
    console.error("An error occurred during the encryption process:", error);
  }
}

// Execute the encryption process
runEncryption();