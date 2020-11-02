// jest-puppeteer.config.js
module.exports = {
  launch: {
    // false -  browser opens up with visual feedback
    // true  -  testcase runs in slient mode via console
    headless: false,
    slowMo: 20,
    defaultViewport: null,
    devtools: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--start-maximized",
      "--disable-infobars",
    ],
  },
  browser: "chromium",
  browserContext: "default",
};
