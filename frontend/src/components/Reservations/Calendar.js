import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { throttle } from 'lodash';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import {AiOutlineCloseCircle} from 'react-icons/ai'
import './Calendar.css';
import '../../assets/styles/main.css';


// options for toLocaleString function in the javascript date class
// gets the actual weekday string from an int returned from getDay()
const options = {weekday: 'long'};

// =========== HELPERS

// find the start of the week given a week offset
// example: if 0 is inputted, the date returned would be the start of this week. 1 inputted would give the start date of next week
const getWeekStart = (weekOffset) => {
    const weekStart = new Date();
    const dateOffset = weekStart.getDate() - (weekStart.getDay()-1); // -1 because python starts the week on monday...what a stupid bug i know ;)

    weekStart.setDate(dateOffset+(weekOffset*7));

    return weekStart;
}

const getWeekEnd = (weekOffset) => {
    const weekEnd = new Date();
    const dateOffset = weekEnd.getDate() + (6-weekEnd.getDay());

    weekEnd.setDate(dateOffset+(weekOffset*7));
    console.log('weekEnd:', weekEnd);
    return weekEnd;
}

// takes a reservation time and returns the position (margin and height) for rendering
const getPosition = (startTime,endTime) => {
    let marginTop = Math.floor(19 + (startTime.getHours()-8)*50);
    marginTop += Math.round(startTime.getMinutes()*0.83333333333);

    const height = Math.round(((endTime-startTime)/3.6e+6)*50);

    return [marginTop, height];
}

const getTimeFromPosition = (margin) => {
    margin -= 19;
    let time = new Date()
    const hours = Math.floor(((margin) / 50) + 8); // use same formula as getting position ((hours - 8)*50) + 20
                                                        // where 8 is the starting time of the calendar, 50 is one hour, and 20 is the starting offset of the calendar
    time.setHours(hours);
    margin -= ((hours-8)*50); // get minutes alone without hours margin and 20 offset
    const minutes = Math.round(margin / 0.83333333333);
    time.setMinutes(minutes);
    return time;
}

// ============================================

// calendar event editor
// this allows the user to edit event details like time and in the future day. This window also allows the user to confirm their reservation
// TODO allow date to be edited and it will move day
const EventEdit = ( { time, marginTop , setStartTime, setEndTime } ) => {

    return (
        <div class="message" style={{marginTop: `${marginTop-27}px`}}>
            <div class="bar">
                <div className="eventTitle">Reservation</div>
                <input className="details" placeholder="Linus' Reservation"/>

                <div className="dateWrapper">
                    <div className="formField" style={{fontSize: "10pt"}}>Date:</div>
                    <input className="date" type="date" id="start" name="trip-start" value="2023-07-11" min="2018-01-01" max="2018-12-31" />
                </div>

                <div className="times">
                    <div className="start">
                        <div className="formField">Start Time</div>
                        <input className="time" type="time" id="appt" name="appt" min="08:00" max="20:00"/>
                    </div>
                    <div class="end">
                        <div className="formField">End Time</div>
                        <input className="time" type="time" id="appt" name="appt" min="08:00" max="20:00"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

// calendar event card
const CalendarEvent = ( { day, time, position, colors } ) => {
    const [startTime, setStartTime] = useState(new Date(time[0].getTime()));
    const [endTime, setEndTime] = useState(new Date(time[1].getTime()));

    const [editEvent, setEdit] = useState(true); // are we editing event details

    const sensitivity = 15;

    const refBox = useRef(null);
    const refTop = useRef(null);
    const refBottom = useRef(null);
    const refMiddle = useRef(null);

    let listenerEventStartTimer = 0; // capture time between events which we can use to tell between clicks, holds, double clicks etc.

    // NOTE: please leave this EVIL function here
    // i would like to preserve this function in as a reminder of how simple life
    // is if you don't ever try to make a website

    // convert from px to int for height calculations
    // const convertMargin = (num) => {
    //     return Math.floor((num)/25)*25;
    // }

    // ---- please continue with your day now ----


    useEffect(() => {

        const resizeableElement = refBox.current;
        const styles = getComputedStyle(resizeableElement);
        let height = parseInt(styles.height);

        let marginTop = parseInt(styles.marginTop);
        //let marginTop = parseInt(resizeableElement.style.marginTop);
        let originalMarginTop = marginTop;
        let currTime = getPosition(new Date(), new Date())[0];
        let y = null;


        const updateEventTime = () => {
            console.log("here");
            time[0] = getTimeFromPosition(marginTop);
            time[1] = getTimeFromPosition(marginTop + height);

            setStartTime(time[0]);
            setEndTime(time[1]);
        };

        // check if inputted event collides with another event
        const checkCollisions = () => {
            const events = document.getElementsByClassName(day);
            const resizeableElement = refBox.current;

            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventTop = parseInt(eventStyle.marginTop);
                    const eventHeight = parseInt(eventStyle.height);

                    if(marginTop >= eventTop && marginTop < eventTop+eventHeight) return true;
                    if(marginTop+height < eventTop+eventHeight && marginTop+height > eventTop) return true;
                }
            }
            return false; // event does not collide with other events
        }

        // maximum and minimum height div can have
        // maxHeight: height a div can have when resizing the top of the div (top resize). Set it to zero as the default value (top margin in the day)
        // minHeight: height a div can have when resizing the bottom of the div (bottom resize)
        let maxHeight = 0;
        let minHeight = 650 - (marginTop); //TODO change 650 to maxSize of day as scaling could change



        // get the max and min height our div can be to avoid collisions with other events and not allow users to schedule a reservation during another time.
        const getMaxMinHeights = () => {
            height = parseInt(resizeableElement.style.height);
            const events = document.getElementsByClassName(day);
            //marginTop = convertMargin(parseInt(styles.marginTop));
            marginTop = parseInt(styles.marginTop);

            // also define max and min margins for looping and we will set heights after. This is so there is no confusion between heights and margin calculations during iteration
            //let maxMargin = 19;
            let maxMargin = currTime;
            if(maxMargin < 19) maxMargin = 19;
            //if(maxMargin < 0) maxMargin = 0;
            let minMargin = 669;

            // TODO move to checkCollisions method
            // loop over all events from this day
            // if we find a margin (represents time in the day) that is before us then we consider updating maxHeight to avoid collisions
            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventTop = parseInt(eventStyle.marginTop); // the top margin of the event aka the "position" or "time" in the day the event is

                    // if the event is "later" than our current max and the event is actually before us then update maxMargin to be the margin of the event + the events height
                    if(eventTop >= maxMargin && eventTop < marginTop) maxMargin = eventTop + parseInt(eventStyle.height);

                    // if the event margin is lower or "later" than the current minHeight then update minHeight to be event the marginTop of that event - our marginTop
                    if(eventTop <= minMargin && eventTop > marginTop) minMargin = eventTop;
                }
            }

            // we calculate maxHeight as (our margin - the max margin we found in the loop) + current height of our div :)
            maxHeight = (marginTop - maxMargin) + height;
            console.log("marginTop in max min calculations", marginTop);
            minHeight = minMargin - marginTop;
        };

        // get the max and min div margins for draggable events
        // check other divs for collisions
        const getDragMaxMin = () => {
            //const marginTop = parseInt(styles.marginTop);

            maxHeight = 0; // 0 is the max margin
            minHeight = 650 - height; // 650 is the min margin

            const events = document.getElementsByClassName(day);
            console.log(events);

            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventHeight = parseInt(eventStyle.height); // height + 19 offset for day label
                    const eventTop = parseInt(eventStyle.marginTop);

                    if(eventTop >= maxHeight && eventTop < marginTop) maxHeight = (eventTop+eventHeight);
                    if((eventTop-height) <= minHeight && eventTop > marginTop) minHeight = eventTop-height;
                }
            }
        }

        // TOP RESIZE
        const onMouseMoveTopResize = (event) => {
            let updateTime = true;
            if(event.clientY % sensitivity === 0){
                const dy = (event.clientY) - y;
                const originalHeight = height;
                height -= dy*25;

                if(height > maxHeight){
                    height = maxHeight;
                    updateTime = false;
                }
                if(height < 50){
                    height = 50;
                    updateTime = false;
                }

                // update height and marginTop
                marginTop -= (height-originalHeight);
                resizeableElement.style.marginTop = `${marginTop}px`;
                resizeableElement.style.height = `${height}px`;

                //update event time
                if(updateTime) updateEventTime();
            }
            y = event.clientY;
        };

        const onMouseUpTopResize = (event) => {
            console.log("end height:",height);
            document.removeEventListener("mousemove", onMouseMoveTopResize);
            document.removeEventListener("mouseup", onMouseUpTopResize);
        };

        const onMouseDownTopResize = (event) => {
            getMaxMinHeights();
            console.log("start maxheight:",maxHeight);
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
                height = height+dy*25;

                if(height > minHeight){
                    height = minHeight;
                    updateTime = false;
                }
                if(height < 50){
                    height = 50;
                    updateTime = false;
                }

                resizeableElement.style.height = `${height}px`;

                //update event time
                if(updateTime) {
                    updateEventTime();
                }
            }
            y = event.clientY;
            console.log("height", height);
        };

        const onMouseUpBottomResize = (event) => {
            document.removeEventListener("mousemove", onMouseMoveBottomResize)
            document.removeEventListener("mouseup", onMouseUpBottomResize);
        };

        const onMouseDownBottomResize = (event) =>{
            setEdit(false);

            getMaxMinHeights();
            console.log("start min height", minHeight);
            y = event.clientY;

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

            day.setHours(8);
            let maxDragMargin = 19;
            if( new Date() >= day ) maxDragMargin = getPosition(day, day)[0];

            if (maxDragMargin < 0) maxDragMargin = 0;
            const dy = (eventY) - y;
            if(eventY % 15 === 0 && eventY-y !== 0 && dy !== 0){
                marginTop += dy*25;
                console.log(dy*25, marginTop);
                if(marginTop >= maxDragMargin && marginTop+height <= 650){
                    resizeableElement.style.marginTop = `${marginTop}px`;
                    //update event time
                    updateEventTime();
                }
                else if(marginTop < maxDragMargin) {
                    marginTop = maxDragMargin;
                    console.log("im not supposed to be here");
                    resizeableElement.style.marginTop = `${marginTop}px`
                    updateEventTime();
                }
                else if(marginTop+height > 650) marginTop = 650-height;

            }
            y = event.clientY;
            if(checkCollisions()) {
                resizeableElement.style.marginLeft = '10px';
                resizeableElement.style.width = '95%';
            }
            else {
                resizeableElement.style.marginLeft = '0px';
                resizeableElement.style.width = '100%';
            }


        };
        //const throttleMouseMove = onMouseMoveMiddleResize();

        const onMouseUpMiddleResize = (event) => {
            // check if we can actually move there
            // if we can move it, otherwise jump event back to original location
            if(checkCollisions()){
                marginTop = originalMarginTop;
                resizeableElement.style.marginTop = `${marginTop}px`;
            }

            // reset styles
            resizeableElement.style.opacity = '1.0';
            resizeableElement.style.borderTopRightRadius = '0px';
            resizeableElement.style.borderBottomRightRadius = '0px';
            resizeableElement.style.marginLeft = '0px';
            resizeableElement.style.width = '100%';

            document.removeEventListener("mousemove", onMouseMoveMiddleResize);
            document.removeEventListener("mouseup", onMouseUpMiddleResize);
        };

        // TODO give different style to events being dragged
        const onMouseDownMiddleResize = (event) => {

            //getDragMaxMin();
            y = event.clientY;
            originalMarginTop = parseInt(resizeableElement.style.marginTop);
            marginTop = originalMarginTop;
            console.log("start marginTop",marginTop);

            // styles
            resizeableElement.style.top = null;
            resizeableElement.style.bottom = null;

            // change style of event
            resizeableElement.style.opacity = '0.75';
            resizeableElement.style.borderTopRightRadius = '15px';
            resizeableElement.style.borderBottomRightRadius = '15px';

            // event listeners
            document.addEventListener("mousemove", onMouseMoveMiddleResize);
            document.addEventListener("mouseup", onMouseUpMiddleResize);
        };

        const onMouseUpEvent = (event) => {
            const endTime = new Date();

            // if we only clicked
            if(endTime-listenerEventStartTimer <= 100) {
                console.log("cloicked");
            }

            listenerEventStartTimer = 0;
        };

        const onMouseDownEvent = (event) => {
            listenerEventStartTimer = new Date();

            document.addEventListener("mouseup", onMouseUpEvent);
        };

        const editEvent = refBox.current;
        editEvent.addEventListener("mousedown", onMouseDownEvent);
        const resizerTop = refTop.current;
        resizerTop.addEventListener("mousedown", onMouseDownTopResize);
        const resizerBottom = refBottom.current;
        resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
        const resizerMiddle = refMiddle.current;
        resizerMiddle.addEventListener("mousedown", onMouseDownMiddleResize);


        return () => {
            resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
            resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
            resizerMiddle.removeEventListener("mousedown", onMouseDownMiddleResize);
        }
        }, [day, time, startTime, endTime]);

    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(colors.background);
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue(colors.border);

    //const currentTime = new Date().gtHours();
    let opacity = 1.0;
    if( endTime < (new Date())) opacity= 0.5;

    return (
        <>
        {editEvent && <EventEdit time={time} marginTop={getPosition(startTime,endTime)[0]} setStartTime={setStartTime} setEndTime={setEndTime} />}
        <div className={day + " eventCard"} ref={refBox} style={{marginTop:position[0], height:position[1], WebkitBackdropFilter:'blur(10px)',  backgroundColor:`rgba(${backgroundColor}, ${opacity})`, borderLeft: `6px solid rgba(${borderColor}, ${opacity})`}}>
            <div className="resizeTop" ref={refTop}></div>
            <div className="resizeMiddle" ref={refMiddle}></div>
                <div className="labels">
                    Room 353-A
                </div>
                <div className="location">
                    Folsom, 3rd Floor
                </div>
                <div className="reserveName">
                    Henry, Brian & Zwaka, Linus
                </div>
                <div className="time">
                    {startTime.toLocaleTimeString([],{hour: 'numeric', minute:'2-digit'})}-{time[1].toLocaleTimeString([],{hour: 'numeric', minute:'2-digit'})}
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

const Day = ( {dayIndex, events, index, addCreatedEvent} ) => {
    const capitalize = (s) => {
        return s[0].toUpperCase() + s.slice(1);
    }

    // check if today's date matches this day component
    const day = new Date();
    day.setDate(dayIndex);

    const isToday = new Date().getDate() === day.getDate();
    const weekday = day.toLocaleDateString(undefined, options).toLowerCase()

    const last = weekday === "friday";


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

        const newEvent = {
            day: weekday,
            first_name: "Linus",
            last_name: "Zwaka",
            email: "zwakal@rpi.edu", // temp email
            rin: "662017350",
            start_time: startTime,
            end_time: endTime,
            user_event: true,
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
        <div className="day">
            {isToday && <TimeMarker />}
            {events.map((event,index) => (
                <CalendarEvent
                    day={day}
                    time={[event.start_time,event.end_time]}
                    position={getPosition(event.start_time, event.end_time)}
                    key={index}
                    colors={getColor(index,5)}
                    user={event.user_event}
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
    for(let i = 0; i < 5; i++){
        week[weekStart.getDate()+i] = [];
    }

    return week;
}

const Calendar = ( {room, week} ) => {
    let [eventCreated, setEventCreated] = useState(false);
    let [createdEvent, setCreatedEvent] = useState(null);

    let [events,setEvents] = useState({
    });

    useEffect(() => {
        const weekStart = getWeekStart(week);

        // parse reservations json returned from db
        // dates are turned into date objects and sorted into appropriate days
        const parseReservationsJson = (data) => {

            const newEvents = createWeek(weekStart);
            console.log("newevents",newEvents);

            for(let i = 0; i < data.length; i++){
                data[i].start_time = new Date(data[i].start_time);
                data[i].end_time = new Date(data[i].end_time);

                console.log("data[i]",newEvents[data[i].start_time]);
                newEvents[data[i].start_time.getDate()].push(data[i]);
            }

            setEvents(newEvents);
        };

        const getReservations = async () => {
            const weekString = weekStart.getMonth()+1 + "-" + weekStart.getDate() + "-" + weekStart.getFullYear();
            console.log("weekString",weekString);

            const response = await fetch(`http://127.0.0.1:8000/reservations_api/${room.id}/get_week/?date=${weekString}/`);
            const data = await response.json();
            console.log(data);
            parseReservationsJson(data);
        };

        getReservations();

    },[room.id, week]);



    const addCreatedEvent = (newEvent) => {
        if(!eventCreated){
            const newEvents = events;
            console.log("adding craeted event", newEvents, newEvent);
            newEvents[newEvent.start_time.getDate()].push(newEvent);

            // let newEvents = events[day];
            // newEvents.push(newEvent);
            // setEvents({...events, [day]: newEvents});

            setEventCreated(true);
            setEvents(newEvents);
            setCreatedEvent(newEvent);
        }
    }

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
                <Day dayIndex={dayKey} events={value} addCreatedEvent={addCreatedEvent}/>
            ))}
        </div>
    );
}

const getWeek = (week) => {
    const weekStart = getWeekStart(week);
    const weekEnd = getWeekEnd(week);

    return weekStart.getMonth()+1 + '/' + weekStart.getDate() + ' - ' + (weekEnd.getMonth()+1) + '/' + weekEnd.getDate();
}

const CalendarView = ( {room, handleOpen} ) => {

    // don't be confused by the jank code below...
    // calendarIndex specifies the "calendar index" the page is currently rendering while weekString is the string associated with that calendar index
    // when use selects left or right arrow we update the index and week string based on that index and then we render the page again
    let [calendarIndex, setCalendarIndex] = useState(0);
    let [weekString, setWeekString] = useState(getWeek(0))

    // store the calendars
    // just the next two weeks for now
    const weekCalendars = [
        <Calendar key={0} week={0} room={room} />,
        <Calendar key={1} week={1} room={room} />
    ];

    useEffect(() => {
        setWeekString(getWeek(calendarIndex));
    });

    // controls what week is selected by user
    const setCalendarLeftArrow = () => {
        if(calendarIndex > 0){
            setCalendarIndex(calendarIndex-1);
        }
    }

    const setCalendarRightArrow = () => {
        if(calendarIndex < weekCalendars.length-1){
            setCalendarIndex(calendarIndex+1);
        }
    }



    return (
        <>
        <div className="overlay"/>
        <div className="calendar">
            <div className="calendarBar">
                <div className="calendarButton" onClick={() => setCalendarLeftArrow()}><HiChevronDoubleLeft size={50} /></div>
                <div style={{position:'center'}}><h2>{weekString}</h2></div>
                <div className="calendarButton" onClick={() => setCalendarRightArrow()}><HiChevronDoubleRight size={50} /></div>
              <div className="calendarButton" style={{width:'35px', height:'35px', position:'absolute', marginLeft:'98%', marginTop:'-2%'}} onClick={() => {handleOpen()}}><AiOutlineCloseCircle size={35} /></div>
            </div>
            {weekCalendars[calendarIndex]}
        </div>
        <div className="main"/>
        </>
    );


};

export default CalendarView;
