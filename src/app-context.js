// This context behaves like app level global state
import React from "react";
const initialState = {
  user: {
    id: "",
    name: ""
  },
  testName: "demo",
  locale: "en_US",
  localeStrings: {},

  /* Implement this handler in context provider scope */

  toggleAuth: () => {},
  toggleTestName: () => {}
};

export const AppContext = React.createContext(initialState);
export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
