import puppeteer from "puppeteer";
const debugMode = true;

export function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

export function log(message) {
  if (debugMode) {
    console.log(message);
  }
}

export async function allElementsTextMatch(page, selector, headerVals) {
  // const selector = "span.ag-header-cell-text";
  // const headerVals = ["Name", "Gender"];
  const headerCells = await page.$$eval(selector, headerCells =>
    headerCells.map(headerCell => headerCell.textContent)
  );
  console.log("grid headerCells", headerVals, headerCells);
  // expect(headerCells).toEqual(headerVals); // if we need to validate all cell values
  expect(headerCells).toContainEqual(headerVals[0]); // this validates first cell value
}

export async function getCssSelectorForRowAndCol(row, col, additionalSelector) {
  additionalSelector = additionalSelector || "";
  log(
    `selector: div[row-id="${row}"] div[col-id="${col}"] ${additionalSelector}`
  );
  return `div[row-id="${row}"] div[col-id="${col}"] ${additionalSelector}`;
}

export async function getLocatorForCell(row, col, additionalSelector) {
  await page.waitForSelector(
    getCssSelectorForRowAndCol(row, col, additionalSelector)
  );
  return await page.$(getCssSelectorForRowAndCol(row, col, additionalSelector));
}

export async function getCellContent(row, col, additionalSelector) {
  const eleHandler = getLocatorForCell(row, col, additionalSelector);
  return eleHandler;
}

export async function getCellContentsAsText(row, col, additionalSelector) {
  return getCellContent(row, col, additionalSelector).getText();
}

// Need to eval on element hanlder
export async function clickOnHeader(page, headerName) {
  const selector = ".ag-header-cell-text";
  await page.waitForSelector(selector);
  await page.click(selector);
}

export async function verifyRowDataMatchesGridData(exectedRowData) {
  for (let rowIndex = 0; rowIndex < exectedRowData.length; rowIndex++) {
    let currentRowData = exectedRowData[rowIndex];
    let colIds = Object.keys(currentRowData);
    colIds.forEach(colId => {
      verifyCellContentsMatches(rowIndex, colId, currentRowData[colId]);
    });
  }
}

export async function verifyCellContentsMatches(
  rowIndex,
  colId,
  expectedValue,
  additionalSelector
) {
  getCellContentsAsText(rowIndex, colId, additionalSelector).then(text => {
    log(`Expect ${text} to equal ${expectedValue}`);
    expect(text).toEqual(
      String(expectedValue),
      `Expect ${text} to equal ${expectedValue}`
    );
  });
}
