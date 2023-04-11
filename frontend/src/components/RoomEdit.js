import React from 'react';
import { useState } from 'react';
import '../assets/styles/main.css';
import Reservation from'../components/Reservation'

const RoomEdit = () => {
    let [isAddReserveOpen, setIsAddReserveOpen] = useState(false)

    return(
        <div className="roomEditor">
            <button onClick={() => setIsAddReserveOpen(true)}>Add Reservation</button>

            <Reservation open={isAddReserveOpen} onClose={() => setIsAddReserveOpen(false)}>
                hallo welt!
            </Reservation>

        </div>
    );
}

export default RoomEdit;
