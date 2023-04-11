import React from 'react';
import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import Scan from './Scan';

const RESERVATION_STYLES ={
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    background: 'rgba(52,55,60,1.0)',
    color: 'white',
    borderRadius: '5px',
    padding: '50px',
    zIndex: 1000
}

const OVERLAY_STYLES ={
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1000
}

const addHours = (date, hours) => {
    date.setHours(date.getHours() + hours)
    return date.toLocaleString(navigator.language,{hour:'2-digit', minute:'2-digit'})
}

const getDate = () => {
    return 0;
}

const Student = ({ barcode }) => {
    if(barcode.length === 0){
        barcode = "----";
    }

    return(
        <div className="reservationStudent">
            <div className="reservationStudentLeft">
                <div>Room</div>
                <div>{getDate()}</div>
            </div>
            <div className="reservationStudentRight">
                <div>{barcode}</div>
            </div>
        </div>
    );
}

const Reservation = ({ open, children ,onClose, room}) => {
    if(!open)return null;
    let students = [];

    let [barcode, setBarcode] = useState("");
    let [isScan, setIsScan] = useState(true);

    // useEffect(() =>{

    // },[barcode, isScan]);

    return (
        <>
            <Scan scan={isScan} onScan={() => setIsScan(false)} updateBarcode={(scanned) => setBarcode(scanned)} />
            <div style={OVERLAY_STYLES} />
            <div style={RESERVATION_STYLES}>
                <div className='reservationContainer'>
                    <div className='reservationTitle'>Reservation</div>
                    <div className='reservationStudents'>
                        <div className={isScan ? 'idScanFalse' : 'idScanTrue'}></div>
                        <Student barcode={barcode} />
                    </div>
            </div>
        </div>
        {children}
        </>
    );
}

export default Reservation;
