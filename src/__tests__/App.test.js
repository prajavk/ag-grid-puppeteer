const gridUtils = require("../ag-grid-puppeteer");
let defaultContext;

describe("React Ag-Grid Test", () => {
  beforeAll(async () => {
    jest.setTimeout(45000 * 2);
    // await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.goto(URL, { waitUntil: "networkidle2" });
    // A reference for the default browser context
    defaultContext = browser.defaultBrowserContext();
  });

  it("case - check the header names are name, gender and age", async () => {
    const selector = "#mockGrid";
    await page.waitFor(
      (selector) => !!document.querySelector(selector),
      {},
      selector
    );
    await page.waitForSelector("#mockGrid");
    // call ag-grid utils() here
    const headerVals = ["Name", "Gender", "Age"];
    await gridUtils.allElementsTextMatch(
      page,
      "span.ag-header-cell-text",
      headerVals
    );
  });

  it("case - edit textfield  cell editor ", async () => {
    await page.waitForSelector(
      'div[row-index="0"] [col-id="checked"] .ag-selection-checkbox'
    );
    await page.click(
      'div[row-index="0"] [col-id="checked"] .ag-selection-checkbox'
    );
    // css selector for textfield editor
    await page.type('div[row-index="0"] [col-id="name"]', "React");
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitFor(1000);
    // verify each cell content
    const cells = await page.$$eval(
      'div[row-index="0"] div[col-id="name"] div[ref="eCellWrapper"] .ag-cell-value',
      (cells) => cells.map((cell) => cell.textContent)
    );
    expect(cells).toContainEqual("React");
  });

  it("case - Edit grid cell editors ", async () => {
    await page.type('div[row-index="0"] [col-id="age"]', "22");
    await page.keyboard.type(String.fromCharCode(13));

    // css selector for text area editor
    await page.waitForSelector(
      'div[row-index="0"] div[col-id="address"] div[ref="eCellWrapper"] .ag-cell-value'
    );
    await page.click(
      'div[row-index="0"] div[col-id="address"] div[ref="eCellWrapper"] .ag-cell-value'
    );
    await page.waitForSelector(
      ".ag-theme-balham > .ag-popup-editor > .ag-large-text > .ag-large-textarea > textarea"
    );

    await page.$eval(
      ".ag-theme-balham > .ag-popup-editor > .ag-large-text > .ag-large-textarea > textarea",
      (el) => el.setSelectionRange(0, el.value.length)
    );
    const textareaField = await page.$(
      ".ag-theme-balham > .ag-popup-editor > .ag-large-text > .ag-large-textarea > textarea"
    );
    await textareaField.press("Backspace");
    await textareaField.type("Edit New Address", { delay: 10 });
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitFor(1000);

    const genderCell = await page.$(
      'div[row-index="0"] div[col-id="gender"] div[ref="eCellWrapper"] span.ag-cell-value'
    );
    genderCell.click();
    await page.waitFor(1000);
    // Note - ag-grid css selectors for agRichSelectCellEditor (Not working)
    await page.waitForSelector(
      ".ag-theme-balham > .ag-popup-editor > .ag-rich-select"
    );
    await page.select(
      ".ag-theme-balham > .ag-popup-editor > .ag-rich-select > .ag-rich-select-value",
      "Female"
    );
    // Is this right selector to select new value
    await page.waitForSelector(
      ".ag-rich-select-list > .ag-virtual-list-viewport > .ag-virtual-list-container > .ag-virtual-list-item"
    );
    // await page.select(
    //   ".ag-rich-select-list > .ag-virtual-list-viewport > .ag-virtual-list-container > .ag-virtual-list-item", "Female"
    // );
  });
  afterAll(async () => {
    await defaultContext.close();
    await browser.close();
    console.log("afterAll close browser");
  });
});
