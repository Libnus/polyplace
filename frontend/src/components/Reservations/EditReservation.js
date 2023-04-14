import React from 'react';
import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import './Reservation.css';
import Scan from '../Scan/Scan';
import {Student, Form} from './AddReservation';

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

    console.log("room",room)

    let [studentInfo, setStudentInfo] = useState({first_name: room.first_name, last_name: room.last_name, email: room.email, rin: room.rin});
    let [isScan, setIsScan] = useState(false);
    let [edit, setEdit] = useState(false);

    let [submitted, setSubmitted] = useState(false);
    let [submitError, setSubmitError] = useState({
        submitError: false,
        errorMessage: ""
    });

    let endTime = new Date(room.end_time); // time the room reservation ends
    console.log("time",room.end_time);


    const getCallback = (childData) => {
        setStudentInfo({first_name: childData.first_name, last_name: childData.last_name, email: childData.email, rin: childData.rin});
        setIsScan(false);
    }

    const submitReservation = async () => {
        // reset states
        setSubmitted(false); 
        setSubmitError({submitError: false, errorMessage: ""});

        if(!isScan){
            // parse data for json
            let data = {
                room_num: room,
                first_name: studentInfo.first_name,
                last_name: studentInfo.last_name,
                rin: studentInfo.rin,
                start_time: new Date(),
                end_time: endTime
            }

            try{
                // try upload
                const response = await fetch("http://127.0.0.1:8000/reservations_api/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                const result = await response.json();
                console.log("Response:", result);
                if(response.status===409){
                    setSubmitError({submitError: true, errorMessage: result.message});
                    console.log("Error!!", result.message);
                }
                else setSubmitted(true);
            }catch(error){
                console.error("Error:", error);
                setSubmitError({submitError: true, errorMessage: "Something tragic has happened :("});
            }
        }
        return;
    }

    const showEdit = () => {
        setEdit(!edit);
    }

    console.log(room);

    return (
        <>
            <Scan scan={isScan} setBarcode={getCallback} />
            <div style={OVERLAY_STYLES} />
            <div style={RESERVATION_STYLES}>
                <div className='reservationContainer'>
                    <div className='reservationTitle'>Reservation</div>
                    <hr className={isScan ? 'idScanFalse' : 'idScanTrue'}></hr>
                    <div className='reservationStudents'>
                        <Student room={room.room_num} rin={room.rin} email={room.email} showEdit={showEdit} endTime={endTime} />
                    </div>
                    <hr className={isScan ? 'idScanFalse' : 'idScanTrue'}></hr>
                    {isScan ? <i style={{paddingLeft: "2%",paddingTop:"1%"}}>Waiting for scan...</i> : <i style={{paddingLeft:"2%", paddingTop:"1%"}}>ID scanned!</i>}
                <Form student={studentInfo} isScan={isScan} edit={edit} />
                <button className={isScan ? "waiting" : "ready"} onClick={() => submitReservation()}>Submit</button>
            </div>
        </div>
        </>
    );
}

export default EditReservation