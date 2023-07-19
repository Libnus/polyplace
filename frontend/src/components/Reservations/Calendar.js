import React from 'react';
import { useState, useEffect, useRef, useReducer, useContext } from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { SubmitProvider, useSubmitContext } from './SubmitContext';
import { RoomContext } from '../../pages/Building';
import './Calendar.css';
import '../../assets/styles/main.css';

// options for toLocaleString function in the javascript date class
// gets the actual weekday string from an int returned from getDay()
const options = {weekday: 'long'};

// =========== HELPERS

// given an weekOffset, get the start of the week and the end of the week
// example: current date is Sat. July 15th. If weekOffset is set to 1, go forward one week and grab the start and end dates of that week
// NOTE that the weekStarts on Monday for reservations and the week ends on Friday (for now)
const getWeek = (weekOffset) => {
    const start = new Date();
    start.setDate(start.getDate()+weekOffset*7);

    start.setDate(start.getDate()-start.getDay())

    const end = new Date();
    end.setDate(start.getDate()+6);

    return [start, end];
}

// takes a reservation time and returns the position (margin and height) for rendering
const getPosition = (startTime,endTime) => {
    let marginTop = 19 + (startTime.getHours()-8)*50;
    marginTop += startTime.getMinutes()*0.83333333333;

    //let height = (endTime.getHours()-startTime.getHours()) * 50; //150

    const endTimeMinutes = (endTime.getHours()*60) + endTime.getMinutes();
    const startTimeMinutes = (startTime.getHours()*60) + startTime.getMinutes();

    console.log("well well", endTimeMinutes-startTimeMinutes);
    let height = (endTimeMinutes-startTimeMinutes)*0.83333333333;

    return [marginTop, height];
}

// given a pixel position and a given day, calculate the time in that day from the pixel
const getTimeFromPosition = (pixel, date) => {
    console.log("pixel from getTimefromPos", pixel);
    pixel -= 19;
    const time = new Date(date.getTime());
    const hours = Math.floor(((pixel) / 50) + 8); // use same formula as getting position ((hours - 8)*50) + 20
                                                        // where 8 is the starting time of the calendar, 50 is one hour, and 20 is the starting offset of the calendar

    time.setHours(hours);
    pixel -= ((hours-8)*50); // get minutes alone without hours margin and 20 offset
    const minutes = Math.ceil(pixel / 0.83333333333);
    console.log("calculated minutes", minutes);
    time.setMinutes(minutes);
    return time;
}

// from a weekday, determine the marginLeft position on the screen
const getDayMargin = (weekday) => {
    console.log(weekday);
    const dayElement = document.getElementById(weekday);


    if(dayElement !== null) return weekday * dayElement.clientWidth;
};

// check to see if an inputted date is past an hour and minute
// because javascript date library is bad
const isTimePast = (date, hour, minute) => {
    const check = new Date(date.getTime());
    check.setHours(hour);
    check.setMinutes(minute);

    return date >= check;
};

const isTimeEqual = (date, hour, minute) => {
    return date.getHours() === hour && date.getMinutes() === minute;
};

// ============================================

//TODO delete event with backspace/delete button
const eventReducer = (state, action) => {
    switch(action.type){
        case 'updateStartTime': {
            return{
                ...state,
                start_time: action.value,
            };
        }
        case 'updateEndTime': {
            return{
                ...state,
                end_time: action.value,
            };
        }
        case 'updateEventName': {
            return{
                ...state,
                event_name: action.value,
            };
        }
        case 'updateCreatedEvent': {
            return{
                ...state,
                created_event: action.value,
            };
        }
        case 'updateID': {
            return{
                ...state,
                id: action.value,
            }
        }
        default: {
            return state;
        }
    }
}


const calculateEditorPosition = (position, weekday) => {
    const newPosition = {...position};
    if(position[0]+300 >= window.innerHeight){
        newPosition[0] = window.innerHeight - 300;
    }
    //magic number ;)
    if((160+228+280)+getDayMargin(weekday) > window.innerWidth){
        newPosition[1] = -240;
    }
    return newPosition;
}

// calendar event editor
// this allows the user to edit event details like time and in the future day. This window also allows the user to confirm their reservation
// TODO allow date to be edited and it will move day
const EventEdit = ( { marginTop , thisEvent, setEdit, dispatch, checkCollisions, removeEvent, updateEvents } ) => {
    const [startDateString, setDateString] = useState('');
    const [startTimeString, setStartString] = useState('');
    const [endTimeString, setEndString] = useState('');

    const [originalStartTime, setStart] = useState(null);
    const [originalEndTime, setEnd]= useState(null);

    const [thisEventError, setError] = useState(false);
    const [submitSuccess, setSuccess] = useState(null);

    // calculate position of the editor relative to the screen width and height
    // position one is the marginTop of the event editor and the second position is the marginLeft value
    const [position, setPosition] = useState(calculateEditorPosition([marginTop, 160], thisEvent.start_time.getDay()));
    //const [position, setPosition] = useState([marginTop, 160]);

    useEffect(() => {
        const newPosition = calculateEditorPosition(position, thisEvent.start_time.getDay());
        setPosition(newPosition);
    },[thisEvent]);

    const { submitReservation, updateReservation, deleteReservation, submitError } = useSubmitContext();

    const handleSubmit = async () => {
        let submitted = false;
        if(thisEvent.created_event){
            submitted = await submitReservation(thisEvent);
            if(submitted) {
                updateEvents(thisEvent.id, submitted)
                dispatch({type: 'updateCreatedEvent', value: false});
                dispatch({type: 'updateID', value: submitted});
                setEdit(false);
            }
        }
        else{ // otherwise we are updating an existing event
            submitted = updateReservation(thisEvent);
            if(submitted){ // if success then update the eventEditor style
                setSuccess(true);
                setTimeout(() => {
                   setSuccess(null);
                }, 400)
            }
            else{
                setSuccess(false);
                setTimeout(() => {
                    setSuccess(null);
                }, 400)
            }
        }
        submitted = false;
        setError(!submitted);
    };

    const handleClose = async (event) => {
        // if the event has been created make an api call to delete it
        console.log("handle close ");
        if(!thisEvent.created_event) {
            console.log("id", thisEvent.id);
            const response = await deleteReservation(thisEvent.id);
            console.log("response", response);
            if(!response) return; // there was an error
        }
        console.log("removing event");
        removeEvent(thisEvent);
    };

    useEffect(() => {

        setDateString(`${thisEvent.start_time.getFullYear()}-${('0' + (thisEvent.start_time.getMonth()+1)).slice(-2)}-${thisEvent.start_time.getDate()}`);
        setStartString(`${('0' + thisEvent.start_time.getHours()).slice(-2)}:${('0'+thisEvent.start_time.getMinutes()).slice(-2)}`);
        setEndString(`${('0' + thisEvent.end_time.getHours()).slice(-2)}:${('0'+ thisEvent.end_time.getMinutes()).slice(-2)}`);

    },[thisEvent]);

    // useEffect(() => {
    //     if(thisEvent.start_time.getDay() === 6) setMargin(-240);
    // },[thisEvent.start_time, thisEvent.end_time]);

    const handleFocus = () => {
        setStart(new Date(thisEvent.start_time.getTime()));
        setEnd(new Date(thisEvent.end_time.getTime()));
    }

    const handleNameUpdate = (event) => {
        let newName = event.target.value;
        if(newName.length === 0) newName = "Reservation";
        dispatch({type: "updateEventName", value: newName})
    };

    const checkTimes = (newStart, newEnd) => {
        if(isTimePast(newEnd, 21, 1)){
            newEnd.setHours(21); newEnd.setMinutes(0);
            newStart.setHours(20); newStart.setMinutes(0);
        }

        else if(!isTimePast(newStart, 8, 0)){
            newStart.setHours(8); newStart.setMinutes(0);
            newEnd.setHours(9); newStart.setMinutes(0);
        }

        return [newStart, newEnd];
    };

    const handleStartChange = (event) => {
        if(event.target.value !== ""){
            let newStart = new Date(thisEvent.start_time.getTime());
            let newEnd = new Date(thisEvent.end_time.getTime());

            newStart.setHours(parseInt(event.target.value.slice(0,2)));
            newStart.setMinutes(parseInt(event.target.value.slice(3)));

            if(isTimePast(newStart, 21, 0)) {
                console.log("invalid hour", newStart);
                newStart.setHours(newStart.getHours()-12); // same for if they entered something greater than 8 pm (snap to -12). if hour is 11 pm they probably meant 11 am
                console.log("invalid hour after", newStart);
            }
            else if(!isTimePast(newStart, 8, 0)) newStart.setHours(newStart.getHours()+12);

            if(isTimePast(newStart, newEnd.getHours(), newEnd.getMinutes())){
                //newEnd = new Date(newStart.getTime() + (originalEndTime - originalStartTime));
                newEnd = new Date(newStart.getTime() + 60*60*1000); // 1 hour
            }

            // chcek to make sure end time is valid
            [newStart, newEnd] = checkTimes(newStart, newEnd);

            setStartString(`${('0' + newStart.getHours()).slice(-2)}:${('0'+newStart.getMinutes()).slice(-2)}`);
            setEndString(`${('0' + newEnd.getHours()).slice(-2)}:${('0'+ newEnd.getMinutes()).slice(-2)}`);

            console.log('eventStartTme', newStart, event.target.value);

            dispatch({type: 'updateStartTime', value: newStart});
            dispatch({type: 'updateEndTime', value: newEnd});
        }
    };

    const handleEndChange = (event) => {
        if(event.target.value !== ""){
            let newEnd = new Date(thisEvent.end_time.getTime());
            let newStart = new Date(thisEvent.start_time.getTime());

            newEnd.setHours(parseInt(event.target.value.slice(0,2)));
            newEnd.setMinutes(parseInt(event.target.value.slice(3)));

            if(isTimePast(newEnd, 21, 0) && !isTimeEqual(newEnd, 21, 0)) newEnd.setHours(newEnd.getHours()-12); // same for if they entered something greater than 8 pm (snap to -12). if hour is 11 pm they probably meant 11 am
            else if(!isTimePast(newEnd, 8, 0) && !isTimeEqual(newEnd, 8, 0)) newEnd.setHours(newEnd.getHours()+12);

            if(isTimePast(newStart, newEnd.getHours(), newEnd.getMinutes())){
                newStart = new Date(newStart.getTime() - 60*60*1000);
            }

            // check times are valid
            [newStart, newEnd] = checkTimes(newStart, newEnd);

            setStartString(`${('0' + newStart.getHours()).slice(-2)}:${('0'+newStart.getMinutes()).slice(-2)}`);
            setEndString(`${('0' + newEnd.getHours()).slice(-2)}:${('0'+ newEnd.getMinutes()).slice(-2)}`);

            // still check that the hour is valid though
            dispatch({type: 'updateEndTime', value: newEnd});
            dispatch({type: 'updateStartTime', value: newStart});
        }
    };

    const handleTimeStartChangeBlur = (event) => {
        let newStart = new Date(thisEvent.start_time.getTime());
        let newEnd = new Date(thisEvent.end_time.getTime());
        // check if the time is equal to the start time exactly. If so, go back one hour ahead
        // NOTE careful because 1 hour might be in another reservation
        // literally 10 minutes later i got this bug: TODO fix note above ;)
        if(thisEvent.start_time.getHours() === thisEvent.end_time.getHours() && thisEvent.start_time.getMinutes() === thisEvent.end_time.getMinutes()){
            newStart.setHours(newStart.getHours() + 1);
            dispatch({type: 'updateStartTime', value: newStart});
        }
        if(checkCollisions(thisEvent.start_time, thisEvent.end_time)){
            newStart = new Date(originalStartTime.getTime());
            newEnd = new Date(originalEndTime.getTime());
            dispatch({type: 'updateStartTime', value: newStart});
            dispatch({type: 'updateEndTime', value: newEnd});
        }

        setStartString(`${('0' + newStart.getHours()).slice(-2)}:${('0'+ newStart.getMinutes()).slice(-2)}`);
        setEndString(`${('0' + newEnd.getHours()).slice(-2)}:${('0'+ newEnd.getMinutes()).slice(-2)}`);
    };

    const handleTimeEndChangeBlur = (event) => {
        let newEnd = new Date(thisEvent.end_time.getTime());
        let newStart = new Date(thisEvent.start_time.getTime());

        if(thisEvent.start_time.getHours() === thisEvent.end_time.getHours() && thisEvent.start_time.getMinutes() === thisEvent.end_time.getMinutes()){
            newEnd.setHours(newEnd.getHours() + 1);
            dispatch({type: 'updateEndTime', value: newEnd});
        }
        if(checkCollisions(thisEvent.start_time, thisEvent.end_time)){
            newEnd = new Date(originalEndTime.getTime());
            newStart = new Date(originalStartTime.getTime());
            dispatch({type: 'updateStartTime', value: newStart});
            dispatch({type: 'updateEndTime', value: newEnd});
        }

        setStartString(`${('0' + newStart.getHours()).slice(-2)}:${('0'+ newStart.getMinutes()).slice(-2)}`);
        setEndString(`${('0' + newEnd.getHours()).slice(-2)}:${('0'+ newEnd.getMinutes()).slice(-2)}`);
    };


    return (
        <div class={"eventEditor " + (submitSuccess === true ? "success" : "") + (submitSuccess === false ? "error" : "")} style={{marginTop: `${position[0]-27}px`, marginLeft: `${position[1]}px`}}>
            <div class="bar">
                <div className="eventTitle" >
                    Reservation {thisEventError && <div className="eventError">{submitError.errorMessage}</div>}
                </div>
                <input className="details" defaultValue={thisEvent.event_name} onBlur={(event) => handleNameUpdate(event)} />

                <div className="dateWrapper">
                    <div className="formField" style={{fontSize: "10pt"}}>Date:</div>
                    <input className="date" type="date" id="start" name="reserveStart" defaultValue={startDateString} min={startDateString} max="2023-07-29"/>
                </div>

                <div className="times">
                    <div className="start">
                        <div className="formField">Start Time</div>
                        <input className="time" type="time" id="startTime" name="startTime" value={startTimeString} onFocus={handleFocus} onChange={(event) => handleStartChange(event)} onBlur={(event) => handleTimeStartChangeBlur(event)}/>
                    </div>
                    <div class="end">
                        <div className="formField">End Time</div>
                        <input className="time" type="time" id="endTime" name="endTime" value={endTimeString} onFocus={handleFocus} onChange={(event) => handleEndChange(event)} onBlur={(event) => handleTimeEndChangeBlur(event)}/>
                    </div>
                </div>
                <div className="calendarBar" style={{marginLeft: '70%',marginTop: '15%'}}>
                    <div className="calendarButton" onClick={handleClose}><AiOutlineCloseCircle color="red" size={25} /></div>
                    <div className="calendarButton" style={{marginRight: "5%"}} onClick={handleSubmit}><AiOutlineCheckCircle color="green" size={25} /></div>
                </div>
            </div>
        </div>
    );
};

// calendar event card
const CalendarEvent = ( { eventData, day, position, colors, removeEvent , updateEvents} ) => {
    const [thisEvent, dispatch] = useReducer(eventReducer,eventData);
    const [editEvent, setEdit] = useState(false); // are we editing event details

    const room = useContext(RoomContext);

    let isDragging = false; // check if the user is currently dragging an event

    //const [startTime, setStartTime] = useState(new Date(thisEvent.start_time.getTime()));
    //const [endTime, setEndTime] = useState(new Date(thisEvent.end_time.getTime()));

    const handleRemove = (event) => {
        setEdit(false);
        removeEvent(event);
    }

    const sensitivity = 15;

    // fetch the current time, if the current day is not this calendar events set day then default the current time to 8 am
    let currTime = new Date();
    if (currTime.getDate() < day.getDate()) {
        currTime.setDate(day.getDate());
        currTime.setHours(8);
        currTime.setMinutes(0);
        currTime.setSeconds(0);
    }

    const refBox = useRef(null);
    const refTop = useRef(null);
    const refBottom = useRef(null);
    const refMiddle = useRef(null);

    // NOTE: please leave this EVIL function here
    // i would like to preserve this function in as a reminder of how simple life
    // is if you don't ever try to make a website

    // convert from px to int for height calculations
    // const convertMargin = (num) => {
    //     return Math.floor((num)/25)*25;
    // }

    // ---- please continue with your day now ----



    // check if inputted event collides with another event
    const checkCollisions = (startTime, endTime, returnEvent=false) => {
        const position = getPosition(startTime, endTime);
        const marginTop = position[0];
        const height = position[1];

        const end = marginTop+height;

        const events = document.getElementsByClassName(day.getDate() + " eventCard");
        const resizeableElement = refBox.current;

        for(let i = 0; i < events.length; i++){
            if(events[i] !== resizeableElement){
                const eventStyle = getComputedStyle(events[i]);
                const eventTop = parseFloat(eventStyle.marginTop);
                const eventHeight = parseFloat(eventStyle.height);

                const eventEnd = eventTop + eventHeight;

                if(eventTop < end && eventEnd > marginTop) {
                    console.log("collision found", eventTop, end, eventEnd, marginTop);
                    if(returnEvent) return events[i];
                    return true;
                }
            }
        }
        if(returnEvent) return null;
        return false; // event does not collide with other events
    }

    // get the max and min height our div can be to avoid collisions with other events and not allow users to schedule a reservation during another time.
    const getMaxMinHeights = () => {
        const resizeableElement = refBox.current;

        const position = getPosition(thisEvent.start_time, thisEvent.end_time);
        let marginTop = position[0];

        const events = document.getElementsByClassName(day.getDate() + " eventCard");

        // also define max and min margins for looping and we will set heights after. This is so there is no confusion between heights and margin calculations during iteration
        let maxMargin = getPosition(currTime, currTime)[0];
        let minMargin = 669;

        // TODO move to checkCollisions method
        // loop over all events from this day
        // if we find a margin (represents time in the day) that is before us then we consider updating maxHeight to avoid collisions
        for(let i = 0; i < events.length; i++){
            if(events[i] !== resizeableElement){
                const eventStyle = getComputedStyle(events[i]);
                const eventTop = parseFloat(eventStyle.marginTop); // the top margin of the event aka the "position" or "time" in the day the event is

                // if the event is "later" than our current max and the event is actually before us then update maxMargin to be the margin of the event + the events height
                if(eventTop >= maxMargin && eventTop < marginTop) maxMargin = eventTop + parseFloat(eventStyle.height);

                // if the event margin is lower or "later" than the current minHeight then update minHeight to be event the marginTop of that event - our marginTop
                if(eventTop <= minMargin && eventTop > marginTop) minMargin = eventTop;
            }
        }
        //console.log("ododoodod", marginTop, maxMargin,minMargin);

        let minTime = getTimeFromPosition(maxMargin, day);
        let maxTime = getTimeFromPosition(minMargin,day);

        return [minTime, maxTime];
    }

    // on first render
    useEffect(() => {
        if(thisEvent.created_event){
            let startTime = new Date(thisEvent.start_time);
            let endTime = new Date(thisEvent.end_time);

            // calculate what the max and min are
            let [minTime, maxTime] = getMaxMinHeights();

            // check if there are events during this hour already
            if(startTime < minTime) {
                startTime = minTime;
            }
            if(endTime > maxTime) {
                endTime = maxTime;
            }
            else{
                endTime = new Date(startTime.getTime() + 3600000);
            }

            // set the time to conform to those events
            dispatch({type: 'updateStartTime', value: startTime});
            dispatch({type: 'updateEndTime', value: endTime});
        }
    },[]);

    // when the event changes
    useEffect(() => {
        if(thisEvent.created_event) setEdit(true);

        const resizeableElement = refBox.current;

        const position = getPosition(thisEvent.start_time, thisEvent.end_time);
        resizeableElement.style.marginTop = `${position[0]}px`;
        resizeableElement.style.height = `${position[1]}px`;

        // if currently colliding, change style
        if(checkCollisions(thisEvent.start_time, thisEvent.end_time)){
            resizeableElement.style.marginLeft = '10px';
            resizeableElement.style.zIndex = '3000';
            resizeableElement.style.width = '95%';
            resizeableElement.style.opacity = '0.75';
        }
        else { // otherwise make sure we are in original style with no collisions
            resizeableElement.style.marginLeft = '0px';
            resizeableElement.style.zIndex = '2000';
            resizeableElement.style.width = '100%';
            if(!isDragging) resizeableElement.style.opacity = '1.0';
        }
    },[thisEvent]);

    useEffect(() => {
        if(thisEvent.user_event){
            const resizeableElement = refBox.current;

            let startTime = new Date(thisEvent.start_time.getTime());
            let endTime = new Date(thisEvent.end_time.getTime());


            let minTime = new Date(currTime.getTime());
            let maxTime = new Date(thisEvent.end_time.getTime());
            maxTime.setHours(21);

            let listenerEventStartTimer = 0; // capture time between events which we can use to tell between clicks, holds, double clicks etc.

            let originalStartTime = startTime;
            let originalEndTime = endTime;
            let y = null;


            const updateEventTime = () => {
                console.log("updating event time");

                dispatch({type: 'updateStartTime', value: startTime});
                dispatch({type: 'updateEndTime', value: endTime});
            };


            // TOP RESIZE
            const onMouseMoveTopResize = (event) => {
                if(event.clientY % sensitivity === 0){
                    const dy = (event.clientY) - y;
                    //const originalHeight = height;
                    //height -= dy*25;
                    startTime.setMinutes(startTime.getMinutes() + (dy*30));

                    if(startTime < minTime){
                        startTime = new Date(minTime.getTime());
                        console.log("blocked", startTime);
                    }
                    if(endTime.getHours() - startTime.getHours() < 1){
                        startTime = new Date(minTime.getTime());
                    }

                    //update event time
                    updateEventTime();
                }
                y = event.clientY;
            };

            const onMouseUpTopResize = (event) => {
                document.removeEventListener("mousemove", onMouseMoveTopResize);
                document.removeEventListener("mouseup", onMouseUpTopResize);
            };

            const onMouseDownTopResize = (event) => {
                [minTime, maxTime] = getMaxMinHeights();

                console.log("miniest of th emin",minTime);

                y = event.clientY;
                const styles = window.getComputedStyle(resizeableElement);

                resizeableElement.style.top = null;
                resizeableElement.style.bottom = styles.bottom;

                document.addEventListener("mousemove", onMouseMoveTopResize);
                document.addEventListener("mouseup", onMouseUpTopResize);
            };

            // BOTTOM RESIZE
            const onMouseMoveBottomResize = (event) => {
                let updateTime = true;
                if(event.clientY % sensitivity === 0){
                    let dy = (event.clientY) - y;
                    endTime.setMinutes(endTime.getMinutes() + (dy*30));

                    if(endTime > maxTime){
                        endTime = new Date(maxTime.getTime());
                        updateTime = false;
                    }
                    if(endTime.getHours() - startTime.getHours() < 1){
                        endTime = new Date(maxTime.getTime());
                        updateTime = false;
                    }

                    //update event time
                    if(updateTime){
                        updateEventTime(startTime, endTime);
                    }
                }
                y = event.clientY;
            };

            const onMouseUpBottomResize = (event) => {
                document.removeEventListener("mousemove", onMouseMoveBottomResize)
                document.removeEventListener("mouseup", onMouseUpBottomResize);
            };

            const onMouseDownBottomResize = (event) =>{
                [minTime, maxTime] = getMaxMinHeights();
                y = event.clientY;

                console.log("bottomeresize click",minTime, maxTime);

                // get styles
                const styles = window.getComputedStyle(resizeableElement);
                resizeableElement.style.top = styles.top;
                resizeableElement.style.bottom = null;

                // event listeners
                document.addEventListener("mousemove", onMouseMoveBottomResize);
                document.addEventListener("mouseup", onMouseUpBottomResize);
            };

            // GRAB EVENT
            const onMouseMoveMiddleResize = (event) => {
                const eventY = event.clientY;

                const dy = (eventY) - y;
                if(eventY % 10 === 0){
                    //marginTop += dy*25;
                    startTime.setMinutes(startTime.getMinutes() + dy*30);
                    endTime.setMinutes(endTime.getMinutes() + dy*30);

                    if(startTime >= minTime && endTime <= maxTime){ // TODO bug? maxTime & minTime updated from previous state, but useEffect may reset the data value
                        //resizeableElement.style.marginTop = `${marginTop}px`;
                        //update event time
                        updateEventTime();
                    }
                    else if(startTime < minTime){
                        console.log("end",startTime, minTime);
                        startTime.setHours(minTime.getHours());
                        startTime.setMinutes(minTime.getMinutes());
                        endTime.setTime(startTime.getTime()+(originalEndTime.getTime() - originalStartTime.getTime()));
                        console.log("end",endTime);

                        updateEventTime();
                    }
                    else{
                        startTime.setMinutes(startTime.getMinutes() + dy*30);
                        endTime.setMinutes(endTime.getMinutes() + dy*30);
                    }

                }
                y = event.clientY;



            };
            //const throttleMouseMove = onMouseMoveMiddleResize();

            const onMouseUpMiddleResize = (event) => {
                // check if we can actually move there
                // if we can move it, otherwise jump event back to original location
                if(checkCollisions(startTime, endTime)){
                    startTime = new Date(originalStartTime.getTime());
                    endTime = new Date(originalEndTime.getTime());
                    //resizeableElement.style.marginTop = `${marginTop}px`;
                    updateEventTime();
                }

                // reset styles
                resizeableElement.style.opacity = '1.0';
                resizeableElement.style.borderTopRightRadius = '0px';
                resizeableElement.style.borderBottomRightRadius = '0px';
                resizeableElement.style.marginLeft = '0px';
                resizeableElement.style.width = '100%';

                isDragging = false;

                document.removeEventListener("mousemove", onMouseMoveMiddleResize);
                document.removeEventListener("mouseup", onMouseUpMiddleResize);
            };

            // TODO give different style to events being dragged
            const onMouseDownMiddleResize = (event) => {
                y = event.clientY;
                console.log(minTime, currTime);

                originalStartTime = new Date(startTime.getTime());
                originalEndTime = new Date(endTime.getTime());

                isDragging = true;

                // styles
                resizeableElement.style.top = null;
                resizeableElement.style.bottom = null;

                // change style of event
                resizeableElement.style.opacity = '0.75';
                resizeableElement.style.zIndex = '3000';
                resizeableElement.style.borderTopRightRadius = '15px';
                resizeableElement.style.borderBottomRightRadius = '15px';

                // event listeners
                document.addEventListener("mousemove", onMouseMoveMiddleResize);
                document.addEventListener("mouseup", onMouseUpMiddleResize);
            };

            const onMouseUpEvent = (event) => {
                const endTime = new Date();

                // if we only clicked
                if(thisEvent.user_event && endTime-listenerEventStartTimer <= 200) {
                    setEdit(!editEvent);
                }

                listenerEventStartTimer = 0;
                document.removeEventListener("mouseup",onMouseUpEvent);
            };

            const onMouseDownEvent = (event) => {
                listenerEventStartTimer = new Date();

                document.addEventListener("mouseup", onMouseUpEvent);
            };

            const editEventRef = refBox.current;
            editEventRef.addEventListener("mousedown", onMouseDownEvent);
            const resizerTop = refTop.current;
            resizerTop.addEventListener("mousedown", onMouseDownTopResize);
            const resizerBottom = refBottom.current;
            resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
            const resizerMiddle = refMiddle.current;
            resizerMiddle.addEventListener("mousedown", onMouseDownMiddleResize);


            return () => {
                editEventRef.removeEventListener("mousedown", onMouseDownEvent);
                resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
                resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
                resizerMiddle.removeEventListener("mousedown", onMouseDownMiddleResize);
            }
        }
    },[thisEvent, editEvent]);

    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(colors.background);
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue(colors.border);

    let opacity = 1.0;
    if( thisEvent.end_time < (new Date())) {
        opacity=0.5; // if the event has passed
    }
    else if(thisEvent.created_event) opacity=0.4; // otherwise, it could be a created event

    return (
        <>
            {editEvent && <EventEdit marginTop={getPosition(thisEvent.start_time,thisEvent.end_time)[0]} thisEvent={thisEvent} setEdit={setEdit} dispatch={dispatch} checkCollisions={checkCollisions} removeEvent={handleRemove} updateEvents={updateEvents}/>}
            <div className={day.getDate() + " eventCard"} ref={refBox} style={{marginTop:position[0], height:position[1],  backgroundColor:`rgba(${backgroundColor}, ${opacity})`, borderLeft: `6px solid rgba(${borderColor}, ${opacity})`}}>
            <div className="resizeTop" ref={refTop}></div>
            <div className="resizeMiddle" ref={refMiddle}></div>
                <div className="labels">
                    Room {room.room_num}
                </div>
                <div className="location">
                    {room.location}
                </div>
                <div className="reserveName">
                    {thisEvent.first_name} {thisEvent.lastName}
                </div>
                <div className="time">
                    {thisEvent.start_time.toLocaleTimeString([],{hour: 'numeric', minute:'2-digit'})}-{thisEvent.end_time.toLocaleTimeString([],{hour: 'numeric', minute:'2-digit'})}
                </div>
            <div className="resizeBottom" ref={refBottom}></div>
        </div>
        </>
    );

}

const Hour = ({ hour, day, createEvent, last }) => {
    const handleClick = () => {
        createEvent(hour);
    };

    // check if the hour has passed
    // TODO more advanced checking. For example, if we are still in the hour allow user to create the event but at the current min
    let passed = false;
    day.setHours(hour);
    day.setMinutes(0);
    if(new Date() > day) passed = true;

    return (
        <div className={` ${last ? "hourLast" : "hour"} ${passed ? "notClickable" : ""}`} onClick={() => !passed ? handleClick() : undefined}></div>
    );
}

const TimeMarker = () => {
    const marginTop = getPosition(new Date(), new Date())[0]-9;

    return (
        <div className="timeMarkerWrapper" style={{marginTop:`${marginTop}px`}}>
            <div className="timeMarkerCircle"></div>
            <hr className="timeMarkerLine"></hr>
        </div>
    );
}

const Day = ( {dayIndex, events, addCreatedEvent, removeEvent , updateEvents} ) => {
    const capitalize = (s) => {
        return s[0].toUpperCase() + s.slice(1);
    }

    const room = useContext(RoomContext);

    // check if today's date matches this day component
    const day = new Date();
    day.setDate(dayIndex);

    const currTime = new Date()
    const isToday = currTime.getDate() === day.getDate() && !isTimePast(currTime, 21, 1) && isTimePast(currTime, 7, 59);
    const weekday = day.toLocaleDateString(undefined, options).toLowerCase()

    const last = weekday === "saturday";


    const handleCreate = (hour) => {
        let startTime = new Date();
        startTime.setDate(dayIndex);
        startTime.setHours(hour);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
    
        let endTime = new Date();
        endTime.setDate(dayIndex);
        endTime.setHours(hour+1);
        endTime.setMinutes(0);
        endTime.setSeconds(0);

        // NOTE: keep in mind that once this data is passed into the CalendarEvent component, changes to this instance will not update in the child (obviosuly).
        // This is here to create initial values for the calendar event but events have their own copy of the data and keep track of it themselves.
        //
        // we use quite a few values to define an event. It needs an id, the maxTime, and minTime this event can have (to avoid collisions)
        // we also need data relating to the user as well as start and end time
        // lastly, we keep track of whether the event has just been created (thus not submitted) and whether it is a userEvent (uesr can edit it)
        const newEvent = {
            id: Math.round(Math.random()*10000), // the reservation has not been submitted yet so we simply define the id as the number of events in this day (surely this wont have conflicts)

            day: weekday,
            room_num: room.room_num,
            event_name: "Reservation",
            first_name: "Linus",
            last_name: "Zwaka",
            email: "zwakal@rpi.edu", // temp email
            rin: "662017350",
            start_time: startTime,
            end_time: endTime,


            user_event: true,
            created_event: true,
        }
        
        addCreatedEvent(newEvent);
    }

    const getColor = (index,eventsIndex) => {
        const color = index % eventsIndex;
        return {
            background: "--color-background-" + color,
            border: "--color-border-" + color
        };
    }

    return(
        <div className="day" id={day.getDay()}>
            {isToday && <TimeMarker />}
            {events.map((event,index) => (
                <CalendarEvent
                    key={event.id}
                    eventData={event}
                    day={day}
                    position={getPosition(event.start_time, event.end_time)}
                    colors={getColor(index,5)}
                    removeEvent={removeEvent}
                    updateEvents={updateEvents}
                />
            ))}
            <div className="dayLabel">{capitalize(weekday)}</div>
            <Hour hour={8}  day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={9}  day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={10} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={11} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={12} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={13} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={14} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={15} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={16} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={17} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={18} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={19} day={day} last={last} createEvent={handleCreate}/>
            <Hour hour={20} day={day} last={last} createEvent={handleCreate}/>
        </div>
    );
}

// creates a week dictionary to store events in
// takes in the week start date (sunday)
const createWeek = (weekStart) => {
    const week = {};
    for(let i = 0; i < 7; i++){
        week[weekStart.getDate()+i] = [];
    }

    return week;
}

const Calendar = ( { room, week, events, addCreatedEvent, updateEventsId, removeEvent } ) => {

    useEffect(() => {
        console.log("calendar created with events", events);
    },[events])

    return (
        <div className="calendarContainer">
            <div className="calendarTimes">
                <div className="calendarTime">8 AM</div>
                <div className="calendarTime">9 AM</div>
                <div className="calendarTime">10 AM</div>
                <div className="calendarTime">11 AM</div>
                <div className="calendarTime">12 PM</div>
                <div className="calendarTime">1 PM</div>
                <div className="calendarTime">2 PM</div>
                <div className="calendarTime">3 PM</div>
                <div className="calendarTime">4 PM</div>
                <div className="calendarTime">5 PM</div>
                <div className="calendarTime">6 PM</div>
                <div className="calendarTime">7 PM</div>
                <div className="calendarTime">8 PM</div>
            </div>

            {Object.entries(events).map(([dayKey,value]) => (
                <Day key={dayKey} room={room} dayIndex={dayKey} events={value} addCreatedEvent={addCreatedEvent} removeEvent={removeEvent} updateEvents={updateEventsId} />
            ))}
        </div>
    );
}


const CalendarView = ( { handleOpen } ) => {

    // don't be confused by the jank code below...
    // calendarIndex specifies the "calendar index" the page is currently rendering while weekString is the string associated with that calendar index
    // when use selects left or right arrow we update the index and week string based on that index and then we render the page again
    const [calendarIndex, setCalendarIndex] = useState(0);
    const [weekString, setWeekString] = useState();

    const [events, setEvents] = useState([]); // an array of events for each week being rendered

    const roomContext = useContext(RoomContext);


    // store the calendars
    // just the next two weeks for now
    // TODO  key can be calendar index but make week a new Date being the start date of the week (monday)
    let week = getWeek(0);


    /* ====== FUNCTIONS ASSOCIATED WITH ADDING, UPDATING, OR DELETING EVENTS FROM THE CALENDAR ====== */

    const addCreatedEvent = (newEvent) => {
        const newEvents = [...events];
        newEvents[calendarIndex][newEvent.start_time.getDate()] = [...newEvents[calendarIndex][newEvent.start_time.getDate()], newEvent];
        setEvents(newEvents);
    };

    // takes in an old id and a newId and replaces the old eventId with the newly submitted event id
    const updateEventsId = (oldId, newId) => {
        for(let i in events[calendarIndex]){
            for(let j = 0; j < events[calendarIndex][i].length; j++){
                if(events[calendarIndex][i][j].id === oldId){
                    events[calendarIndex][i][j].id = newId;
                    break;
                }
            }
        }
    };

    const removeEvent = (removeEvent) => {
        if(removeEvent.user_event){
            const newEvents = [...events];
            const eventsIndex = removeEvent.start_time.getDate();
            newEvents[calendarIndex][eventsIndex] = newEvents[calendarIndex][eventsIndex].filter(curr => curr.id !== removeEvent.id);

            setEvents(newEvents);
        }
    };

    /* ====== */

    const getReservations = async () => {
        const weekString = week[0].getMonth()+1 + "-" + week[0].getDate() + "-" + week[0].getFullYear();

        const response = await fetch(`http://127.0.0.1:8000/reservations_api/${roomContext.id}/get_week/?date=${weekString}/`);
        const data = await response.json();
        return data;
    };

    // take a weekIndex and fetch the events from that week
    // if they don't exist, create the week and then make an api call to fetch them
    useEffect(() => {
        week = getWeek(calendarIndex);
        const weekString = week[0].getMonth()+1 + '/' + week[0].getDate() + ' - ' + (week[1].getMonth()+1) + '/' + week[1].getDate();

        setWeekString(weekString);

        console.log("calendarIndex updated", calendarIndex, events.length);

        if(events.length <= calendarIndex){
            fetch();

            async function fetch() {
                const data = await getReservations();
                console.log("saw calendar was empty so called api and got", data);

                let newEvents = [...events];
                const newWeekEvents = createWeek(week[0]);

                for(let i = 0; i < data.length; i++){
                    data[i].start_time = new Date(data[i].start_time);
                    data[i].end_time = new Date(data[i].end_time);

                    data[i].user_event = (data[i].first_name === "Linus" ? true : false);
                    data[i].created_event= false;

                    data[i].room_num = roomContext.room_num;

                    newWeekEvents[data[i].start_time.getDate()].push(data[i]);
                }

                console.log("parsed reservations for the week and weekEvents is now", newWeekEvents)

                newEvents[calendarIndex] = newWeekEvents;
                setEvents(newEvents);
            }
        }
    }, [calendarIndex]);

    // controls what week is selected by user
    const setCalendarLeftArrow = () => {
        if(calendarIndex > 0){
            setCalendarIndex(calendarIndex-1);
        }
    }

    const setCalendarRightArrow = () => {
        if(calendarIndex < 1){
            setCalendarIndex(calendarIndex+1);
        }
    }


    return (
        <SubmitProvider>
            <div className="overlay"/>
            <div className="calendar">
                <div className="calendarBar">
                    <div className="calendarButton" onClick={() => setCalendarLeftArrow()}><HiChevronDoubleLeft size={50} /></div>
                    <div style={{position:'center'}}><h2>{weekString}</h2></div>
                    <div className="calendarButton" onClick={() => setCalendarRightArrow()}><HiChevronDoubleRight size={50} /></div>
                    <div className="calendarButton" style={{width:'35px', height:'35px', position:'absolute', marginLeft:'98%', marginTop:'-2%'}} onClick={() => {handleOpen()}}><AiOutlineCloseCircle size={35} /></div>
                </div>
                {events.length > calendarIndex &&
                 <Calendar
                     key={calendarIndex}
                     week={getWeek(calendarIndex)}
                     events={events[calendarIndex]}
                     addCreatedEvent={addCreatedEvent}
                     updateEventsId={updateEventsId}
                     removeEvent={removeEvent}
                 />}
            </div>
            <div className="main"/>
        </SubmitProvider>
    );


};

export default CalendarView;
