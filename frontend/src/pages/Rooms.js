import React, { useState, useEffect } from 'react';
import '../assets/styles/main.css';
import { useGridApiRef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import ListFloor from '../components/ListFloor';
import RoomEdit from '../components/RoomEdit';
import Reservation from '../components/Reservation';

const Rooms = ({getRoomSelected}) => {

    let [floors, setFloors] = useState([]);
    let selected = "";

    const getRoomSelected = (room_num) => {
        selected = room_num;
    }

    useEffect(() => {
        getFloors();
    },[]);

    const addReservationCall = () => {
        return 0;
    }

    let getFloors = async () => {
        const response = await fetch('http://127.0.0.1:8000/floors_api/floors/')
        const floors = await response.json()

        console.log('DATA:', floors)
        setFloors(floors)

    }

    return(
        <>
        <div className="main">
            <RoomEdit addReservationCall={addReservationCall(selected)}/>
            <div className="floorContainer">
                {floors.map((floor,index) => (
                    <ListFloor key={index} floor={floor} getRoomSelected={getRoomSelected}/>))}
            </div>
        </div>
        </>
    );
};


export default Rooms;
