import { test as baseTest } from "@playwright/test";

import { GoRestServices } from "../tests/apiTests/services/goRestServices";

type goRestApiServices = {
  goRestServices: GoRestServices;
};

const testServices = baseTest.extend<goRestApiServices>({
  goRestServices: async ({page}, use) => {
    await use(new GoRestServices(page));
  },
});

export const test = testServices;
export const expect = baseTest.expect;
