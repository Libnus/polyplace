import React, { createContext, useContext, useState } from 'react';

const SubmitContext = React.createContext();

const useSubmitContext = () => useContext(SubmitContext);

const SubmitProvider = ({ children }) => {
    const [submitError, setError] = useState({
        submitError: null,
        errorMessage: ""
    });

    // make the create reservation api call
    const submitReservation = async (event) => {
        let error = false;
        let message = ""
        try{
            const data = {
                room: event.room_num,
                first_name: event.first_name,
                last_name: event.last_name,
                rin: event.rin,
                start_time: event.start_time,
                end_time: event.end_time
            };

            // try upload
            const response = await fetch("http://127.0.0.1:8000/reservations_api/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if(response.status===409){
                error = true;
                message=result.message;
                console.error("error!!!", result.message);
            }
        } catch(error){
            error = true;
            message = "something tragic has happened :(";
            console.error("error:", error);
        }

        setError({submitError: error, errorMessage: message});
        // if(error === false){
        //     setEventCreated(false);
        //     createdEvent.created_event = false;
        //     setCreatedEvent(null);
        // }
        return true;
    };

    const contextValue = {
        submitReservation,
        submitError,
    };

    return <SubmitContext.Provider value={contextValue}>{children}</SubmitContext.Provider>
};

export {SubmitProvider, useSubmitContext};
