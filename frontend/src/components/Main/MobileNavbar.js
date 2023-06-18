
import React, { useState } from 'react';
import Hamburger from './Hamburger';
import '../Main/MobileNavbar.css'
import '../../assets/styles/main.css';
import '../Main/Hamburger.css'
const MobileNavbar = () => {


    return(

        <div className = "navigation">
            <ul>

                <li>Reservations</li>
                <li>Staff</li>
                <li>History</li>

            </ul>
            <div className = "hamburger">

                <Hamburger />
            </div>
        </div>
    );
}
export default MobileNavbar;