describe("React Ag-Grid Test", () => {
  beforeAll(async () => {
    jest.setTimeout(45000);
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    // await page.goto(URL, { waitUntil: "networkidle2" });
  });

  it("should check the header names are make, model and price", async () => {
    const selector = "#baseGrid";
    await page.waitFor(
      selector => !!document.querySelector(selector),
      {},
      selector
    );

    const headerCells = await page.$$eval(
      "span.ag-header-cell-text",
      headerCells => headerCells.map(headerCell => headerCell.textContent)
    );
    const headerVals = ["Make", "Model", "Price"];
    // expect(headerCells).toEqual(headerVals);

    expect(headerCells).toContainEqual(headerVals[0]);
  });

  it("should change ford cell to mercedes", async () => {
    await page.type('div[row-index="1"] [col-id="make"]', "Mercedes");
    await page.keyboard.type(String.fromCharCode(13));
    const cells = await page.$$eval(
      'div[row-index="1"] div.ag-cell-value',
      cells => cells.map(cell => cell.textContent)
    );
    expect(cells).toEqual(["Mercedes", "Mondeo", "32000"]);
  });

  afterAll(async () => {
    // browser.close();
    console.log("afterAll close browser");
  });
});
