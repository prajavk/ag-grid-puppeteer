import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import TestcaseGrid from "./components/TestcaseGrid";
// import MockGrid from "./components/MockGrid";
import BaseGrid from "./components/BaseGrid";
import Header from "./Header";
import { AppContext } from "./app-context";
import { sleep } from "./components/util/helper";

// Add Ag-grid License here at App level
import "ag-grid-enterprise";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testGridState: {
        colState: null,
        filterState: null,
        sortState: null,
        pivotState: null,
        searchKey: ""
      }
    };
  }
  updateTestGridState = testGridState => {
    sleep(1000).then(() => {
      console.log("[App context] state >>", testGridState);
      this.setState({
        testGridState
      });
    });
  };
  render() {
    /* set localstate to context here */
    const contextValue = {
      qsParams: window.location.search,
      testName: "testapp",
      testGridState: this.state.testGridState,
      updateTestGridState: this.updateTestGridState
    };
    return (
      <div className="main-layout">
        <AppContext.Provider value={contextValue}>
          <div id="wrapper">
            <Header />
          </div>
          <div className="page-wrapper">
            <Switch>
              <Route exact path="/testgrid" component={TestcaseGrid} />
              <Route exact path="/basegrid" component={BaseGrid} />
              {/* <Route exact path="/mockgrid" component={MockGrid} /> */}
            </Switch>
          </div>
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
