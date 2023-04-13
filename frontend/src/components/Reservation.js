import React from 'react';
import { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import './Reservation.css'
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

const addHours = (date, hours) => {
    date.setHours(date.getHours() + hours)
    return date.toLocaleString(navigator.language,{hour:'2-digit', minute:'2-digit'})
}

const getDate = () => {
    return new Date().toDateString();

}

const Form = ( props ) => {
    console.log("edit",props.edit)
    if(props.edit){
        return (
            <form className="reservationForm">
                <div className="reservationFormName">
                    <div className="infoBox">
                        <span className="infoText">First Name: </span>
                        { props.isScan ? (<input type="text" className="inputText" placeholder="Enter first name..."></input>)
                          : (<input type="text" className="inputText" value={props.barcode.first_name}></input>)
                        }
                    </div>
                    <div className="infoBox">
                        <span className="infoText">Last Name: </span>
                        { props.isScan ? (<input type="text" className="inputText" placeholder="Enter last name..."></input>)
                          : (<input type="text" className="inputText" value={props.barcode.last_name}></input>)
                        }
                    </div>
                </div>
                <div className="reservationFormName">
                    <div className="infoBox">
                        <span className="infoText">RIN#: </span>
                        { props.isScan ? (<input type="text" className="inputText" placeholder="Enter RIN..."></input>)
                          : (<input type="text" className="inputText" value={props.barcode.rin}></input>)
                        }
                    </div>
                    <div className="infoBox">
                        <span className="infoText">Email: </span>
                        { props.isScan ? (<input type="text" className="inputText" placeholder="Enter email..."></input>)
                          : (<input type="text" className="inputText" value={props.barcode.email}></input>)
                        }
                    </div>
                </div>
            </form>
        );
    }
    else{
        return (<form className="reservationForm"></form>);
    }
}

const getRoomTime = () => {
    let current = new Date();
    let hour = current.getHours();
    current.setHours(hour+2)
    return current;
}

const Student = ({room, rin, email, endTime, showEdit }) => {
    if(rin.length === 0){
        email="----@rpi.edu"
        rin = "----";
    }

    return(
        <div className="reservationStudent">
            <div className="reservationStudentLeft">
                <div style={{paddingBottom: '5%', fontWeight:'bold'}}>Room {room}</div>
                <div style={{paddingBottom: '2%'}}>{getDate()}</div>
                <div style={{fontWeight: 'lighter'}}><i>Expires @{endTime.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})}</i></div>
            </div>
            <div className="reservationStudentRight">
                <div style={{fontWeight: 'bold'}}>{email}</div>
                <div style={{paddingBottom: "4%"}}>{rin}</div>
                <div><button onClick={() => {showEdit()}}><u style={{color: 'lightblue'}}>Edit</u></button></div>
            </div>
        </div>
    );
}

const Submit = ({waiting, submitReservation, submitted, submitError}) => {

    return (
        <>
        <button className={waiting ? "waiting" : "ready"} onClick={submitReservation()}>Submit</button>
        {submitted ? <h3 className="submitSuc">Submitted</h3> : submitError && <h3 className="submitError">Error!!!</h3>}
        </>
    );
}

const Reservation = ({ room, open, children ,onClose}) => {
    if(!open) return null;

    // check that use has actually selected a room

    let students = [];

    let [barcode, setBarcode] = useState({first_name: '', last_name: '', email: '', rin: ''});
    let [isScan, setIsScan] = useState(true);
    let [edit, setEdit] = useState(false);

    let [submitted, setSubmitted] = useState(false);
    let [submitError, setSubmitError] = useState({
        submitError: false,
        errorMessage: ""
    });


    let endTime = getRoomTime(); // time the room reservation ends

    const getCallback = (childData) => {
        setBarcode({first_name: childData.first_name, last_name: childData.last_name, email: childData.email, rin: childData.rin});
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
                first_name: barcode.first_name,
                last_name: barcode.last_name,
                rin: barcode.rin,
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
        </div>
        {children}
        </>
    );
}

export default Reservation;
