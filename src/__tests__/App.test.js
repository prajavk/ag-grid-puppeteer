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

  it("should check the header names are make, model and price", async () => {
    const selector = "#mockGrid";
    await page.waitFor(
      selector => !!document.querySelector(selector),
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

  it("case - rename text  of Name cell ", async () => {
    await page.type('div[row-index="0"] [col-id="name"]', "React");
    await page.keyboard.type(String.fromCharCode(13));
    const cells = await page.$$eval(
      'div[row-index="0"] div.ag-cell-value',
      cells => cells.map(cell => cell.textContent)
    );
    // expect(cells).toEqual(["React", "Male", "13"]); // Need to give all cell values of row
    expect(cells).toContainEqual("React"); // why error?
  });

  it("case - edit other editors cells ", async () => {
    // use ag-grid utils
    await page.waitForSelector('[row-index="0"] [col-id="gender"] .ag-react-container div');
    await page.click(
      '[row-index="0"] [col-id="gender"] .ag-react-container div'
    );
  }); 
  afterAll(async () => {
    await defaultContext.close();
    await browser.close();
    console.log("afterAll close browser");
  });
});
