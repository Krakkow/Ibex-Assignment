import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 0,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on",
    launchOptions: {
      args: ["--disable-blink-features=AutomationControlled"],
      logger: {
        isEnabled: (name, severity) => severity === "error",
        log: () => {},
      },
    },
  },
});
