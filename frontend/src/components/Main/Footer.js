import React from 'react';
import { BsGithub } from 'react-icons/bs';
import '../../assets/styles/main.css';

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-links">
                <a href="https://github.com/Libnus/folsom" title="Visit project GitHub" style={{color: 'black'}}><BsGithub size={40}
                    onMouseOver={({target})=>target.style.color="white"}
                    onMouseOut={({target})=>target.style.color="black"} /></a>
            </div>
            © 2023 - PolyPlace
        </div>
    );
}

export default Footer;
