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
      selector => !!document.querySelector(selector),
      {},
      selector
    );
    await page.waitForSelector("#mockGrid");
    // call ag-grid utils() to verify header values here
    const headerVals = ["Name", "Gender", "Age"];
    await gridUtils.allElementsTextMatch(
      page,
      "span.ag-header-cell-text",
      headerVals
    );
  });

  it("case - Edit first row with checkbox, textfield  cell editors ", async () => {
    // css selector to find checkbox editor
    await page.waitForSelector(
      'div[row-index="0"] [col-id="checked"] .ag-selection-checkbox'
    );
    await page.click(
      'div[row-index="0"] [col-id="checked"] .ag-selection-checkbox'
    );
    // css selector to find  textfield editor
    await page.type('div[row-index="0"] [col-id="name"]', "React");
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitFor(1000);
    // verify each cell content
    const cells = await page.$$eval(
      'div[row-index="0"] div[col-id="name"] div[ref="eCellWrapper"] .ag-cell-value',
      cells => cells.map(cell => cell.textContent)
    );
    expect(cells).toContainEqual("React");
  });

  it("case - Edit first row with dropdown, text area cell editors ", async () => {
    await page.type('div[row-index="0"] [col-id="age"]', "22");
    await page.keyboard.type(String.fromCharCode(13));

    // css selector to find text area editor
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
      el => el.setSelectionRange(0, el.value.length)
    );
    const textareaField = await page.$(
      ".ag-theme-balham > .ag-popup-editor > .ag-large-text > .ag-large-textarea > textarea"
    );
    await textareaField.press("Backspace");
    await textareaField.type("Edit Textarea Address", {
      delay: 10
    });
    await page.keyboard.type(String.fromCharCode(13));
    await page.waitFor(1000);

    // css selector to click on gender cell
    const genderCell = await page.$(
      'div[row-index="0"] div[col-id="gender"] div[ref="eCellWrapper"] span.ag-cell-value'
    );
    genderCell.click();
    await page.waitFor(1000);

    // Note - ag-grid css selectors to find agRichSelectCellEditor
    await page.waitForSelector(
      ".ag-theme-balham > .ag-popup-editor > .ag-rich-select"
    );

    const selectValue = "Gender";
    // Works - if part of string matched with value
    // const [linkHandler] = await page.$x(
    //   `//div[@class='ag-rich-select-list']//div[@class='ag-virtual-list-viewport']//div[@class='ag-virtual-list-container']//div[@class='ag-virtual-list-item']//div[@class='ag-rich-select-row']//span[contains(., '${selectValue}')]`
    // );

    // Works - to match exact string with item value
    const [linkHandler] = await page.$x(
      `//div[@class='ag-virtual-list-container']//div[@class='ag-virtual-list-item']//div[@class='ag-rich-select-row']//span[text()='${selectValue}']`
    );
    if (linkHandler) {
      await linkHandler.click();
    }
    await page.waitFor(1000);
    // Is css selector to select item value - not working?
    // await page.select(
    //   ".ag-rich-select-list > .ag-virtual-list-viewport > .ag-virtual-list-container > .ag-virtual-list-item", "Female"
    // );

    // Is css selector to select the second item from the dropdown (Female) - not working?
    // await page.click(
    //   ".ag-theme-balham > .ag-popup-editor > .ag-rich-select .ag-virtual-list-item:nth-of-type(2) .ag-rich-select-row"
    // );
  });
  afterAll(async () => {
    await defaultContext.close();
    await browser.close();
    console.log("afterAll close browser");
  });
});
