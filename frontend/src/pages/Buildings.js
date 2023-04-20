import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes,BrowserRouter, Route, Link } from 'react-router-dom';
import Test from './Test';
import '../assets/styles/main.css';
import './Buildings.css';

const BuildingContainer = ( {building} ) => {
    let navigate = useNavigate();
    const handleRouteClick = () => {
        console.log("clicked");
        navigate(`/buildings/${building.replace(/\s/g, '')}`);
    }

    return (
        <div className="buildingContainer" onClick={() => handleRouteClick()}>
            <div className="buildingImage" style={{backgroundImage: `url(/${building.replace(/\s/g,'')}.png)`}}></div>
            <div className="buildingLabel">
                <div className="label">{building}</div>
            </div>
        </div>
    );
}

const Buildings = ( {buildings} ) => {

    //const buildings= ["Amos Eaton","Folsom Library", "Colonie","DCC"];

    return (
        <>
        <div className="main">
            <div className="buildingsContainer">
                {buildings.map((building,index) => (
                    <BuildingContainer key={index} building={building} />
                ))}
            </div>
        </div>
        </>
    );
}

export default Buildings;
