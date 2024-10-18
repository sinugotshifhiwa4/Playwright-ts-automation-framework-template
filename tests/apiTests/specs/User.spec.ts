import { test } from "../../../fixtures/goRestFixtures";
import logger from "../../utils/loggerUtil";

test.describe("User Test Suite", () => {

    test("Create User", async ({ goRestServices }) => {

        await goRestServices.createNewUser();
        logger.info("Successfully created a new user.");
    });
});