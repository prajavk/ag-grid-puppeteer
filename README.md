# This project built to understand puppeteer API with ag-grid
Use node 10.15.0

## How to run test case using nodejs

`npm install`
`npm start`

1. First run React-app using 3000 port

2. go to **tests** folder, to run all testcases you can run cmd:
`npm run test`

## Resources
- https://pptr.dev/#?product=Puppeteer&version=v2.0.0&show=api-pagegotourl-options
- https://jestjs.io/docs/en/puppeteer

## ag-grid Testing
- https://github.com/LouisMoore-agGrid/react-jest-enzyme-ag-grid-v22
- https://github.com/AhmedAGadir/ag-grid-react-testing-library-example/
- https://github.com/seanlandsman/ag-grid-testing/blob/master/src/ag-grid.utils.ts

## puppeteer Examples

- https://www.tools4testing.com/contents/puppeteer/puppeteer-relative-xpath-by-attribute
- https://github.com/puppeteer/examples

### If your react-app using testing-lib 
- npm script should be as below, 
```
"test": "react-scripts test --verbose=false --env=jsdom-fourteen",
```

`package.json`
```
"@testing-library/jest-dom": "^4.2.4",
"@testing-library/react": "^9.3.2",
"@testing-library/user-event": "^7.1.2",
```