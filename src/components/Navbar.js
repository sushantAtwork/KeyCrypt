import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Navbar.css';





function Navbar() {

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/feature" className="navbar-link">Feature</Link>
        </li>
        <li className="navbar-item">
          <Link to="/support" className="navbar-link">Support</Link>
        </li>
        <li className="navbar-item">
          <Link to="/signup" className="navbar-link">Signup</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

