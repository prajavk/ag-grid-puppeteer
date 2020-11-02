/* This Component reused for loading and No rows found cases.
 */
import React from "react";
import PropTypes from "prop-types";

function CustomLoadMask(props) {
  let content = null;
  // case1: Loading...
  if (props.isLoading) {
    content = (
      <div>
        <span> {props.loadingMessage}</span>
      </div>
    );
  }
  // case2: No records found
  if (props.noRows) {
    content = (
      <div className="xmm-loader-msg">
        <i className="fa fa-frown-o" />
        <span> {props.loadingMessage}</span>
      </div>
    );
  }
  return content;
}

export default CustomLoadMask;

CustomLoadMask.propTypes = {
  loadingMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  noRows: PropTypes.bool
};
