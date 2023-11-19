import React from "react";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <div className="nav">
        <NavLink to="/" className="logo">
          <div className="logo-img"></div>
          <h1 className="logo-seat">Seat</h1>
          <h1 className="logo-savvy">Savvy</h1>
        </NavLink>
        {/* <ul className="nav-links">
          <li>
            <NavLink to="/" activeclassname="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/seating" activeclassname="active">
              Seating
            </NavLink>
          </li>
          <li>
            <NavLink to="/dinner" activeclassname="active">
              Dinner
            </NavLink>
          </li>
          <li>
            <NavLink to="/submission" activeclassname="active">
              Submission
            </NavLink>
          </li>
        </ul> */}
      </div>
    </nav>
  );
};

export default Nav;
