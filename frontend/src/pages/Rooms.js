import React, { useState, useEffect } from 'react';
import '../assets/styles/main.css';
import Box from '@mui/material/Box';
import ListFloor from '../components/Buildings/Floors/ListFloor';
import RoomEdit from '../components/Buildings/Floors/RoomEdit';

const Rooms = () => {

    let [floors, setFloors] = useState([]);
    let [selectedRoom, setSelectedRoom] = useState({
        room_num: "",
        first_name: "",
        last_name: "",
        end_time: "",
        rin: "",
        email: "",
    });

    const getRoomSelected = (room) => {
        setSelectedRoom({...selectedRoom,
                         room_num: room.room_num,
                         first_name:room.first_name,
                         last_name:room.last_name,
                         end_time:room.end_time,
                         rin:room.rin,
                         email:room.email});
    }

    useEffect(() => {
        getFloors();
    },[]);


    let getFloors = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/floors_api/floors/')
        const floors = await response.json()

        setFloors(floors)

    }

    return(
        <>
        <div className="main">
            <RoomEdit selectedRoom={selectedRoom} isOccupied={true ? selectedRoom.first_name.length > 0 : false}/>
            <div className="floorContainer">
                {floors.map((floor,index) => (
                    <ListFloor key={index} floor={floor} getRoomSelected={getRoomSelected}/>))}
            </div>
        </div>
        </>
    );
};


export default Rooms;
