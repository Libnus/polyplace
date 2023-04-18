import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/main.css';

// ============================ STYLES ============================

const buildingsContainer = {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: '2%',
    paddingTop: '4%',
};

const buildingContainer = {
    height: '30%',
    width: '40%',
    marginLeft: '2%',
    marginRight: '2%',
    marginBottom: '2%',
    position: 'relative',
    backgroundColor: 'white',
};

const buildingImage = {
    height: '100%',
    backgroundColor: 'gray',
};

const buildingLabel = {
    position: 'absolute',
    height: '25%',
    width: '100%',
    zIndex: '1000',
    bottom: '0',
    backgroundColor: '#c93135',
};


// ============================ BUILDINGS ============================

const Building = ( {building} ) => {

    let navigate = useNavigate();
    const handleRouteClick = () => {
        console.log("clicked");
        navigate(`/buildings/${building}`);
    }

    return (
        <div style={buildingContainer} onClick={() => handleRouteClick()}>
            <div style={buildingImage} >{building}</div>
            <div style={buildingLabel}>hi</div>
        </div>
    );
}

const Buildings = ( {buildings} ) => {

    return (
        <div className="main">
            <div style={buildingsContainer}>
                {buildings.map((building,index) => (
                    <Building key={index} building={building} />
                ))}
            </div>
        </div>
    );
}

export default Buildings;
