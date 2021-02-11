import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

class TestcaseGrid extends Component {
  constructor(props) {
    super(props);
    this.onSearchBoxChanged = this.onSearchBoxChanged.bind(this);
    this.state = {
      gridState: null,
      searchKey: "",
      columnDefs: [
        {
          field: "athlete",
          filter: "agSetColumnFilter",
          filterParams: {
            buttons: ["clear"]
          }
        },
        {
          field: "age",
          filter: "agNumberColumnFilter",
          maxWidth: 100
        },
        {
          field: "country",
          filter: "agSetColumnFilter",
          filterParams: {
            buttons: ["clear"]
          }
        },
        {
          field: "year",
          maxWidth: 100
        },

        { field: "sport" },
        {
          field: "gold",
          filter: "agNumberColumnFilter",
          filterParams: {
            includeBlanksInEquals: false,
            includeBlanksInLessThan: false,
            includeBlanksInGreaterThan: false,
            buttons: ["clear"]
          }
        },
        {
          field: "silver",
          filter: "agNumberColumnFilter"
        },
        {
          field: "bronze",
          filter: "agNumberColumnFilter"
        },
        {
          field: "total",
          filter: "agNumberColumnFilter"
        }
      ],
      defaultColDef: {
        floatingFilter: true, // true - enable column header filters
        flex: 1,
        sortable: true,
        resizable: true,
        editable: false, // default disable editor
        enableRowGroup: false,
        sortingOrder: ["asc", "desc", null],
        minWidth: 120,
        filter: "agTextColumnFilter",
        filterParams: {
          buttons: ["clear"]
        },
        getQuickFilterText: params => {
          if (!params.column.visible) {
            return null;
          } else {
            return params.value;
          }
        }
      },
      multiSortKey: "ctrl",
      components: {},
      frameworkComponents: {},
      statusBar: {
        statusPanels: [
          {
            statusPanel: "agTotalAndFilteredRowCountComponent",
            align: "left"
          },
          {
            statusPanel: "agFilteredRowCountComponent"
          },
          {
            statusPanel: "agSelectedRowCountComponent",
            align: "left"
          }
        ]
      },
      // true - use browser default tooltip instead of ag-grid tooltip
      enableBrowserTooltips: true,
      rowSelection: "single",
      sideBar: {
        toolPanels: [
          {
            id: "columns",
            labelDefault: "Columns",
            labelKey: "columns",
            iconKey: "columns",
            toolPanel: "agColumnsToolPanel",
            toolPanelParams: {
              suppressPivots: true,
              suppressPivotMode: true,
              suppressValues: true,
              suppressRowGroups: true
            }
          },
          {
            id: "filters",
            labelDefault: "Filters",
            labelKey: "filters",
            iconKey: "filter",
            toolPanel: "agFiltersToolPanel"
          }
        ],
        hiddenByDefault: false
      },
      rowData: null
    };
  }
  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      "GET",
      "https://www.ag-grid.com/example-assets/olympic-winners.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
    this.applySortConfig();
  };

  clearFilters = () => {
    this.gridApi.setFilterModel(null);
    this.gridApi.setQuickFilter("");
  };
  applySortConfig() {
    const defaultSortModel = [
      {
        colId: "athlete",
        sortIndex: 0,
        sort: "asc"
      },
      {
        colId: "age",
        sortIndex: 1,
        sort: "asc"
      }
    ];
    this.assignColumnState(defaultSortModel);
  }
  assignColumnState = defaultSortModel => {
    this.gridColumnApi &&
      this.gridColumnApi.applyColumnState({
        state: defaultSortModel,
        defaultState: {
          // important to say 'null' as undefined means 'do nothing'
          sort: null
        }
      });
  };
  saveGridState = () => {
    const { searchKey } = this.state;
    if (this.gridApi && this.gridColumnApi) {
      const gridState = {
        colState: this.gridColumnApi.getColumnState(),
        pivotState: this.gridColumnApi.isPivotMode(),
        filterState: this.gridApi.getFilterModel(),
        searchKey
      };
      console.log("save state", gridState);
      this.setState({
        gridState
      });
    }

    var savedFilterModel = this.gridApi.getFilterModel();
    var keys = Object.keys(savedFilterModel);
    var savedFilters = keys.length > 0 ? keys.join(", ") : "(none)";
    document.querySelector("#savedFilters").innerHTML = savedFilters;
  };

  restoreState = () => {
    // this.gridApi.setFilterModel(this.state.savedFilterModel);
    const {
      colState,
      filterState,
      pivotState,
      searchKey
    } = this.state.gridState;
    if (colState && this.gridApi && this.gridColumnApi) {
      this.gridColumnApi.setColumnState(colState);
      this.gridColumnApi.setPivotMode(pivotState);
      this.assignColumnState(colState);
      this.gridApi.setFilterModel(filterState);
      console.log(
        "get state",
        this.state.gridState,
        this.gridApi.getFilterModel()
      );
      this.setState(
        {
          searchKey
        },
        prevState => {
          this.gridApi.setQuickFilter(searchKey);
          console.log(
            "after state",

            this.gridApi.getFilterModel()
          );
        }
      );
    }
  };
  destroyFilter = () => {
    this.gridApi.destroyFilter("athlete");
  };
  // Quick filter handler
  onSearchBoxChanged = event => {
    if (event) {
      event.preventDefault();
    }
    if (this.gridApi) {
      const searchKey = document.querySelector("#page-search-box").value;
      this.gridApi.setQuickFilter(searchKey);
      this.setState({
        searchKey
      });
    }
  };
  render() {
    return (
      <div className="example-wrapper">
        <div>
          <div className="button-group">
            <button onClick={() => this.saveGridState()}>Save State</button>
            <button onClick={() => this.restoreState()}>Restore State</button>

            <button onClick={() => this.clearFilters()}>Reset All</button>
            <button onClick={() => this.destroyFilter()}>Destroy Filter</button>
          </div>
        </div>
        <div>
          <div className="button-group">
            Saved Filters: <span id="savedFilters">(none)</span>
            <span className="xmm-input-search float-right">
              <input
                type="text"
                id="page-search-box"
                className="xmm-input"
                placeholder={"Search"}
                onInput={this.onSearchBoxChanged}
                autoComplete="off"
              />
            </span>
          </div>
        </div>

        <div id="filterGrid" className="ag-grid-container ag-theme-balham">
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            onGridReady={this.onGridReady}
            rowData={this.state.rowData}
            sideBar={this.state.sideBar}
            statusBar={this.state.statusBar}
            components={this.state.components}
            frameworkComponents={this.state.frameworkComponents}
            animateRows={true}
            floatingFilter={this.state.floatingFilter}
            multiSortKey={this.state.multiSortKey}
            enableRangeSelection={false}
            enableCellTextSelection={true}
            enableBrowserTooltips={true}
            // rowHeight={50}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default TestcaseGrid;
