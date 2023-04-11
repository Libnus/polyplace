import React, { useState, useEffect } from 'react';
import '../assets/styles/main.css';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import ListFloor from '../components/ListFloor';
import RoomEdit from '../components/RoomEdit';
import Reservation from '../components/Reservation';

const Rooms = () => {

    let [floors, setFloors] = useState([])

    useEffect(() => {
        getFloors()
    },[])

    let getFloors = async () => {
        const response = await fetch('http://127.0.0.1:8000/floors_api/floors/')
        const floors = await response.json()
        console.log('DATA:', floors)
        setFloors(floors)
    }

    return(
        <>
        <div className="main">
            <RoomEdit />
            <div className="floorContainer">
                {floors.map((floor,index) => (
                    <ListFloor key={index} floor={floor} />))}
            </div>
        </div>
        </>
    );
};


export default Rooms;
