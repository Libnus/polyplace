import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/main.css';
import './Buildings.css';

<<<<<<< HEAD
const BuildingContainer = ( {building} ) => {
=======
const Building = ( {building} ) => {

>>>>>>> 6a713d5 (buildings stylesheet)
    let navigate = useNavigate();
    const handleRouteClick = () => {
        console.log("clicked");
        navigate(`/buildings/${building}`);
    }

    return (
        <div className="buildingContainer" onClick={() => handleRouteClick()}>
<<<<<<< HEAD
            <div className="buildingImage" style={{backgroundImage: `url(/${building.replace(/\s/g,'')}.png)`}}></div>
=======
            <div className="buildingImage" ></div>
>>>>>>> 6a713d5 (buildings stylesheet)
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
