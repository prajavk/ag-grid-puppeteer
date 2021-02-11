import React, { Component } from "react";
// import MockGrid from "./components/MockGrid";
import TestcaseGrid from "./components/TestcaseGrid";

// Add Ag-grid License here at App level
import "ag-grid-enterprise";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id="wrapper">
        <div className="page-wrapper">
          <TestcaseGrid />
        </div>
      </div>
    );
  }
}

export default App;
