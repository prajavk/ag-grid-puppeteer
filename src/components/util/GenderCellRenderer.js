import React, { Component } from "react";

export default class GenderCellRenderer extends Component {
  render() {
    return <span>{this.props.value}</span>;
  }
}
