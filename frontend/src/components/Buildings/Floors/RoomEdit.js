import React from 'react';
import { useState } from 'react';
import '../../../assets/styles/main.css';
import AddReservation from'../../Reservations/AddReservation'
import EditReservation from '../../Reservations/EditReservation'

// handle error messages for roomEdit
const ErrorAdd = ({notSelected, roomTaken}) => {
    if(!notSelected && !roomTaken){return null;}

    if(notSelected){
        return(
            <p style={{color:"red"}}>Please select a room!</p>
        );
    }
    if(roomTaken){
        return(
            <p style={{color: "red"}}>Room taken!</p>
        );
    }
}

const RoomEdit = ({selectedRoom, isOccupied}) => {
    let [isAddReserveOpen, setIsAddReserveOpen] = useState(false);
    let [isEditReserveOpen, setIsEditReserveOpen] = useState(false);
    let [errorAdd, setErrorAdd] = useState({
        notSelected: false,
        roomTaken: false
    });
    let [errorEdit, setErrorEdit] = useState({
        notSelected: false,
        roomNotTaken: false
    });

    const addReservation = () => {
        if(selectedRoom.length === 0){
            setErrorAdd({notSelected: true});
        }
        else if(isOccupied){
            setErrorAdd({roomTaken: true});
        }
        else{
            setErrorAdd(false);
            setIsAddReserveOpen(true);
        }
    }

    const editReservation = () => {
        if(selectedRoom.length === 0){
            setErrorEdit({notSelected: true});
        }
        else if(!isOccupied){
            setErrorEdit({roomTaken: true});
        }
        else{
            setErrorEdit(false);
            setIsEditReserveOpen(true);
        }
    }

    return(
        <div className="roomEditor">
            <button onClick={() => addReservation()}>Add Reservation</button>
            <button onClick={() => editReservation()}>Edit Reservation</button>
            <ErrorAdd notSelected={errorAdd.notSelected} roomTaken={errorAdd.roomTaken} />
            <AddReservation room={selectedRoom.room_num} open={isAddReserveOpen} onClose={() => setIsAddReserveOpen(false)}/>
            <EditReservation room={selectedRoom} open={isEditReserveOpen} onClose={() => setIsEditReserveOpen(false)} />
        </div>
    );
}

export default RoomEdit;
