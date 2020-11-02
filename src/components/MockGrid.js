import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import GenderCellRenderer from "./util/GenderCellRenderer.js";
import { YesNoMap } from "./util/ModuleConstants";
import mockData from "./data/mockGrid.json";
class MockGrid extends Component {
  constructor(props) {
    super(props);
    this.handleColumnResized = this.handleColumnResized.bind(this);
    const gridOptions = {
      floatingFilter: true,
      rowSelection: "multiple", // allows multiple row selections
      // rowSelection: "single",
      multiSortKey: "ctrl",
      sideBar: true,
      enableBrowserTooltips: true,
      columnDefs: [
        {
          headerName: "",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          field: "checked",
          filter: false,
          editable: false,
          pinned: "left",
          enableRowGroup: false,
          width: 35
        },
        {
          field: "name",
          headerName: "Name",
          editable: true,
          sortable: true,
          pinned: "left",
          minWidth: 200,
          maxWidth: 400,
          cellClass: "cell-wrap-text", // this is very important to make the cell wrap
          enableRowGroup: true,
          sort: "asc",
          getQuickFilterText(params) {
            return params.value.name;
          },
          autoHeight: true
        },
        {
          field: "gender",
          headerName: "Gender",
          cellRenderer: "genderCellRenderer",
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            values: ["Male", "Female"],
            cellRenderer: "genderCellRenderer"
          }
        },
        {
          field: "age",
          headerName: "Age",
          type: "numberColumn",
          editable: true,
          cellEditor: "agTextCellEditor",
          valueFormatter: blankValueFormatter,
          width: 80,
          maxWidth: 100,
          minWidth: 85
        },
        {
          field: "country",
          headerName: "Country",
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: {
            cellHeight: 50,
            values: ["Ireland", "USA"]
          }
        },
        {
          field: "city",
          headerName: "City",
          cellEditor: "agRichSelectCellEditor",
          cellEditorParams: cellCellEditorParams
        },
        {
          field: "enabled",
          headerName: "Enabled",
          type: "numberColumn",
          sortable: true,
          enableRowGroup: true,
          valueFormatter: numberFormatter,
          valueParser: numberParser,
          cellRenderer: myCellRenderer,
          cellRendererParams: {
            color: "blue"
          }
        },
        {
          field: "address",
          headerName: "Address",
          cellEditor: "agLargeTextCellEditor",
          minWidth: 550
        }
      ],
      rowData: mockData,

      defaultColDef: {
        flex: 1,
        sortable: true,
        resizable: true,
        editable: true, // default disable editor
        enableRowGroup: false,
        sortingOrder: ["asc", "desc", null],
        minWidth: 120,
        autoHeight: true,
        filter: "agTextColumnFilter",
        filterParams: { clearButton: true },
        getQuickFilterText: params => {
          if (!params.column.visible) {
            return null;
          } else {
            return params.value;
          }
        }
      },
      columnTypes: {
        numberColumn: {
          maxWidth: 120,
          minWidth: 120,
          filter: "agNumberColumnFilter",
          filterParams: {
            nullComparator: {
              equals: false,
              lessThan: false,
              greaterThan: false
            },
            clearButton: true
          }
        },
        nonEditableColumn: { editable: false },
        noFilterColumn: {
          width: 100,
          columnGroupShow: "open",
          filter: false
        }
      },
      frameworkComponents: { genderCellRenderer: GenderCellRenderer }
    };
    this.state = gridOptions;
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
    this.applySortConfig();
    this.sizeToFit();
  };
  handleColumnResized = () => {
    this.gridApi.resetRowHeights();
  };

  onCellValueChanged = params => {
    var colId = params.column.getId();
    if (colId === "country") {
      var selectedCountry = params.data.country;
      var selectedCity = params.data.city;
      var allowedCities = countyToCityMap(selectedCountry);
      var cityMismatch = allowedCities.indexOf(selectedCity) < 0;
      if (cityMismatch) {
        params.node.setDataValue("city", null);
      }
    }
  };

  applySortConfig() {
    const defaultSortModel = [
      {
        colId: "name",
        sort: "asc"
      },
      {
        colId: "gender",
        sort: "asc"
      }
    ];
    this.gridApi && this.gridApi.setSortModel(defaultSortModel);
  }

  sizeToFit() {
    this.gridApi && this.gridApi.sizeColumnsToFit();
  }
  // call this to remove sidebar
  hideSidebar() {
    if (this.gridApi) {
      this.gridApi.setSideBarVisible(!this.gridApi.isSideBarVisible());
    }
  }

  render() {
    return (
      <div id="mockGrid" className="ag-grid-container ag-theme-balham">
        <AgGridReact
          rowData={this.state.rowData}
          columnDefs={this.state.columnDefs}
          defaultColDef={this.state.defaultColDef}
          frameworkComponents={this.state.frameworkComponents}
          onGridReady={this.onGridReady}
          onCellValueChanged={this.onCellValueChanged.bind(this)}
          onColumnResized={this.handleColumnResized}
          floatingFilter={this.state.floatingFilter}
          rowHeight={50}
          sideBar={this.state.sideBar}
          enterMovesDownAfterEdit={true}
          enterMovesDown={true}
          enableRangeSelection={false}
          enableCellTextSelection={true}
          enableBrowserTooltips={true}
          suppressMenuHide={false}
          suppressContextMenu={true}
          suppressRowClickSelection={true}
          singleClickEdit={true}
          stopEditingWhenGridLosesFocus={true}
          animateRows={true}
          rowSelection={this.state.rowSelection}
          columnTypes={this.state.columnTypes}
          multiSortKey={this.state.multiSortKey}
        />
      </div>
    );
  }
}

function blankValueFormatter(params) {
  const val = params.value;
  if (!val) {
    return "-";
  } else {
    return val;
  }
}

/**
 *  Cell Renderer by Property (using the api)
 */
function myCellRenderer(params) {
  const mycolor = params.value === 0 || params.value === null ? "red" : "green";
  return (
    '<span title="the tooltip" style="color: ' +
    mycolor +
    '">' +
    YesNoMap[params.value] +
    "</span>"
  );
}
function numberFormatter(params) {
  return "\xA3" + formatNumber(params.value);
}
function numberParser(params) {
  return Number(params.newValue);
}
function formatNumber(number) {
  return Math.floor(number)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function cellCellEditorParams(params) {
  var selectedCountry = params.data.country;
  var allowedCities = countyToCityMap(selectedCountry);
  return {
    values: allowedCities,
    formatValue: function(value) {
      return value + " (" + selectedCountry + ")";
    }
  };
}
function countyToCityMap(match) {
  var map = {
    Ireland: ["Dublin", "Cork", "Galway"],
    USA: ["New York", "Los Angeles", "Chicago", "Houston"]
  };
  return map[match];
}
export default MockGrid;
