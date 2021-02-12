/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
import React from "react";

export const DisplayState = props => (
  <div style={{ margin: "1rem 0" }}>
    <pre
      style={{
        background: "#f6f8fa",
        color: "#000",
        fontSize: ".65rem",
        padding: ".5rem"
      }}
    >
      <strong>props</strong> = {JSON.stringify(props, null, 2)}
    </pre>
  </div>
);

// Async Validation
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// How to use sleep?
// sleep(300).then(() => {
// console.log("Timeout started");
// });
