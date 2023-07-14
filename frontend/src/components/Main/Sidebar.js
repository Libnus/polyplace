import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';
export default props => {
  return (
    <Menu right>
      <a className="menu-item" href="/">
        Home
      </a>
      <a className="menu-item" href="/rooms">
        Rooms
      </a>
      <a className="menu-item" href="/history">
        History
      </a>
      <a className="menu-item" href="/buildings">
        Buildings
      </a>
    </Menu>
  );
};