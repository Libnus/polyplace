import React from 'react';
import '../assets/styles/main.css';

function sayHello(){
    alert("You clicked me!");
}
const RoomEdit = () => {
    return(
        <div className="roomEditor">
            <div className= "roomEditorButtons">
            <button className= "reservationButtons"onClick={sayHello}>Add Reservation</button>
            <button className= "reservationButtons"onClick={sayHello}>Edit Reservation</button>
            <button className= "reservationButtons"onClick={sayHello}>Remove Reservation</button>
       
            </div>
        </div>
    );
}

export default RoomEdit;
