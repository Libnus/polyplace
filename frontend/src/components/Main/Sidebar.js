import React from "react";
import { slide as Menu } from "react-burger-menu";
import "./Sidebar.css";
import { FaHome, FaCalendarAlt, FaUsers, FaHistory, FaSignOutAlt} from "react-icons/fa";

const SideBar = () => {
  return (
    <>    
    <Menu right>
      <div style = {{background: "#c93135", border: "none", borderBottom:"2px solid white", fontWeight: "bold", fontSize: "31px", padding:"15px", position:"relative"}}>Polyplace</div>
      <div style = {{background: "#c93135", margin:"0", border: "none"}}/>
      <a className="menu-item" href="/">
        <FaHome style = {{color:"white", paddingRight:"3px"}} />
        Home
      </a>
      <a className="menu-item" href="/rooms">
        <FaUsers style = {{color:"white",paddingRight:"3px"}}/>
        Rooms
      </a>
      <a className="menu-item" href="/history">
        <FaHistory style = {{color:"white",paddingRight:"3px"}}/>
        History
      </a>
      <a className="menu-item" href="/buildings">
        <FaCalendarAlt style = {{color:"white",paddingRight:"3px"}}/>
        Buildings
      </a>

      <div style = {{background: "#c93135", border: "none", borderBottom:"2px solid white",  padding:"15px", position:"relative"}}></div>
      <div style = {{background: "#c93135", marginBottom:"0%", border: "none"}}/>
      <a className="menu-item" href="/">
        <FaSignOutAlt style = {{color:"white",paddingRight:"3px", alignItems:"center"}}/>
        Logout
      </a>
    </Menu>
    </>

  );
};

export default SideBar;
