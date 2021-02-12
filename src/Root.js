import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import App from "./App";

const Root = props => (
  <BrowserRouter className="main-layout">
    <div>
      <Route path="/" component={App} />
    </div>
  </BrowserRouter>
);
export default Root;
