import React from 'react';
import { useState } from 'react';
import '../assets/styles/main.css';
import Reservation from'../components/Reservation'

const Error = ({error}) => {
    if(!error){return null;}

    return(
        <p style={{color:"red"}}>Please select a room!</p>
    );
}

const RoomEdit = ({selectedRoom}) => {
    let [isAddReserveOpen, setIsAddReserveOpen] = useState(false)
    let [errorAdd, setErrorAdd] = useState(false)

    const addReservation = () => {
        if(selectedRoom.length === 0){
            setErrorAdd(true);
        }
        else{
            setErrorAdd(false);
            setIsAddReserveOpen(true);
        }
    }

    return(
        <div className="roomEditor">
            <button onClick={() => addReservation()}>Add Reservation</button>
            <Error error={errorAdd} />
            <Reservation room={selectedRoom} open={isAddReserveOpen} onClose={() => setIsAddReserveOpen(false)}>
                hallo welt!
            </Reservation>

        </div>
    );
}

export default RoomEdit;
