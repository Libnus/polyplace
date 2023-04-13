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
    return current.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

}

const Student = ({ rin, email, showEdit }) => {
    if(rin.length === 0){
        email="----@rpi.edu"
        rin = "----";
    }

    return(
        <div className="reservationStudent">
            <div className="reservationStudentLeft">
                <div style={{paddingBottom: '5%', fontWeight:'bold'}}>Room</div>
                <div style={{paddingBottom: '2'}}>{getDate()}</div>
                <div style={{fontWeight: 'lighter'}}><i>Expires @{getRoomTime()}</i></div>
            </div>
            <div className="reservationStudentRight">
                <div style={{fontWeight: 'bold'}}>{email}</div>
                <div style={{paddingBottom: "4%"}}>{rin}</div>
                <div><button onClick={() => {showEdit()}}><u style={{color: 'lightblue'}}>Edit</u></button></div>
            </div>
        </div>
    );
}

const Reservation = ({ open, children ,onClose, room}) => {
    if(!open)return null;
    let students = [];

    let [barcode, setBarcode] = useState({first_name: '', last_name: '', email: '', rin: ''});
    let [isScan, setIsScan] = useState(true);
    let [edit, setEdit] = useState(false);

    // useEffect(() =>{

    // },[barcode, isScan]);
    //
    //

    const getCallback = (childData) => {
        setBarcode({first_name: childData.first_name, last_name: childData.last_name, email: childData.email, rin: childData.rin});
        setIsScan(false);
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
                        <Student rin={barcode.rin} email={barcode.email} showEdit={showEdit} />
                    </div>
                    <hr className={isScan ? 'idScanFalse' : 'idScanTrue'}></hr>
                    {isScan ? <i style={{paddingLeft: "2%",paddingTop:"1%"}}>Waiting for scan...</i> : <i style={{paddingLeft:"2%", paddingTop:"1%"}}>ID scanned!</i>}
                <Form barcode={barcode} isScan={isScan} edit={edit} />
            </div>
        </div>
        {children}
        </>
    );
}

export default Reservation;
