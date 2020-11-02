// .eslintrc.js
module.exports = {
  root: true,
  extends: ["prettier"],
  plugins: ["prettier"],
  settings: {
    "import/resolver": {
      node: {
        paths: ["src", "tests"]
      }
    }
  },
  env: {
    node: true,
    jest: true,
    browser: true
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true
  },
  // Declare your own eslint rules here or override rules
  rules: {
    "react/no-multi-comp": ["enabled", { ignoreStateless: true }],
    "react/sort-prop-types": 0,
    "class-methods-use-this": "off",
    "no-shadow": "off"
  }
};
