import React from 'react';
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <div className="nav">
        <div className="logo">
          <h1 className="logo-seat">Seat</h1>
          <h1 className="logo-savvy">Savvy</h1>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" activeclassname="active">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" activeclassname="active">
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav