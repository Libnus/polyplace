import React, { useState } from 'react';
import '../../assets/styles/main.css'

const Navbar = () => {

    let [sidebarData, setSidebarData] = useState([
        {
            title: 'Rooms',
            path: '/rooms',
            cName: 'nav-text'
        },
        {
            title: 'History',
            path: '/history',
            cName: 'nav-text'
        },
    ]);

    return(
        <>
            <div className="sidenav center">
                {sidebarData.map(p =>(
                    <div className={"navelement " + (window.location.pathname === p.path ? 'onPageNav' : '')} >
                        <a href={p.path}>{p.title}</a>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Navbar;
