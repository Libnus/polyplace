import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/main.css';
import './Buildings.css';

const Building = ( {building} ) => {

    let navigate = useNavigate();
    const handleRouteClick = () => {
        console.log("clicked");
        navigate(`/buildings/${building}`);
    }

    return (
        <div className="buildingContainer" onClick={() => handleRouteClick()}>
            <div className="buildingImage" ></div>
            <div className="buildingLabel">
                <div className="label">{building}</div>
            </div>
        </div>
    );
}

const Buildings = ( {buildings} ) => {

    return (
        <div className="main">
            <div className="buildingsContainer">
                {buildings.map((building,index) => (
                    <Building key={index} building={building} />
                ))}
            </div>
        </div>
    );
}

export default Buildings;
