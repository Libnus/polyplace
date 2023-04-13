import React from 'react';
import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import './Reservation.css';
import Scan from './Scan';

const RESERVATION_STYLES ={
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    background: 'rgba(52,55,60,1.0)',
    color: 'white',
    borderRadius: '5px',
    paddingTop: '20px',
    width: '50%',
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

const EditReservation = ({ room, open, onClose }) => {
    if(!open) return null;

    let [barcode, setBarcode] = useState({first_name: '', last_name: '', email: '', rin: ''});
    let [isScan, setIsScan] = useState(false);
    let [edit, setEdit] = useState(false);

    let [submitted, setSubmitted] = useState(false);
    let [submitError, setSubmitError] = useState({
        submitError: false,
        errorMessage: ""
    });

    let endTime = room.end_time; // time the room reservation ends

    const showEdit = () => {
        setEdit(!edit);
    }

    return (
        <>
            <Scan scan={isScan} setBarcode={getCallback} />
            <div style={OVERLAY_STYLES} />
            <div style={RESERVATION_STYLES}>
                <div className='reservationContainer'>
                    <div className='reservationTitle'>Reservation</div>
                    <hr className={isScan ? 'idScanFalse' : 'idScanTrue'}></hr>
                    <div className='reservationStudents'>
                        <Student room={room} rin={barcode.rin} email={barcode.email} showEdit={showEdit} endTime={endTime} />
                    </div>
                    <hr className={isScan ? 'idScanFalse' : 'idScanTrue'}></hr>
                    {isScan ? <i style={{paddingLeft: "2%",paddingTop:"1%"}}>Waiting for scan...</i> : <i style={{paddingLeft:"2%", paddingTop:"1%"}}>ID scanned!</i>}
                <Form barcode={barcode} isScan={isScan} edit={edit} />
                <button className={isScan ? "waiting" : "ready"} onClick={() => submitReservation()}>Submit</button>
                {submitted ? <h3 className="submitSuc">Submitted</h3> : submitError.submitError && <h3 className="submitError">Error!!! {submitError.errorMessage}</h3>}
            </div>
        </>
    );
}
