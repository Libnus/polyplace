import React from 'react';
import '../assets/styles/main.css';

const History = () => {


    let getData = async ()  =>{
        const response = await fetch('http://127.0.0.1:8000/reservation_api/');
        const reservations = await response.json();
        console.log(reservations);
    }


    return(
        <div className="main">



        </div>
    );
};

export default History;
