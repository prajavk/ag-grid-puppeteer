import React from "react";
import NavItem from "./NavItem";

const Header = () => (
  <div className="sticky-page-header">
    <ul className="nav nav-pills">
      <NavItem to="/testgrid">Testcase</NavItem>
      <NavItem to="/basegrid">Base Grid</NavItem>
      {/* <NavItem to="/mockgrid">Mock Grid</NavItem> */}
    </ul>
  </div>
);

export default Header;
