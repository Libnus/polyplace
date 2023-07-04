import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import './Building.css';
import '../../assets/styles/main.css';

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
    const dateOffset = weekEnd.getDate() + (7-weekEnd.getDay());

    weekEnd.setDate(dateOffset+(weekOffset*7));
    console.log('weekEnd:', weekEnd);
    return weekEnd;
}

// ============================================

const CalendarEvent = ( { day, time, position, colors } ) => {
    const sensitivity = 15;

    const refBox = useRef(null);
    const refTop = useRef(null);
    const refBottom = useRef(null);
    const refMiddle = useRef(null);

    // convert from px to int for height calculations
    const convertMargin = (num) => {
        return Math.floor((num)/25)*25;
    }


    useEffect(() => {

        const resizeableElement = refBox.current;
        const styles = getComputedStyle(resizeableElement);
        let height = parseInt(styles.height);

        let marginTop = convertMargin(parseInt(styles.marginTop));
        let originalMarginTop = marginTop;

        // check if inputted event collides with another event
        const checkCollisions = () => {
            const events = document.getElementsByClassName(day);
            const resizeableElement = refBox.current;
            marginTop = convertMargin(parseInt(styles.marginTop));

            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventTop = convertMargin(parseInt(eventStyle.marginTop));
                    const eventHeight = parseInt(eventStyle.height);

                    if(marginTop > eventTop && marginTop < eventTop+eventHeight) return true;
                    if(marginTop+height < eventTop+eventHeight && marginTop+height > eventTop) return true;
                }
            }
            return false; // event does not collide with other events
        }

        // maximum and minimum height div can have
        // maxHeight: height a div can have when resizing the top of the div (top resize). Set it to zero as the default value (top margin in the day)
        // minHeight: height a div can have when resizing the bottom of the div (bottom resize)
        let maxHeight = 0;
        let minHeight = convertMargin(650 - (marginTop)); //TODO change 619 to maxSize of day as scaling could change



        // get the max and min height our div can be to avoid collisions with other events and not allow users to schedule a reservation during another time.
        const getMaxMinHeights = () => {
            const events = document.getElementsByClassName(day);
            marginTop = convertMargin(parseInt(styles.marginTop));

            // also define max and min margins for looping and we will set heights after. This is so there is no confusion between heights and margin calculations during iteration
            let maxMargin = 0;
            let minMargin = 650;

            // TODO move to checkCollisions method
            // loop over all events from this day
            // if we find a margin (represents time in the day) that is before us then we consider updating maxHeight to avoid collisions
            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventTop = convertMargin(parseInt(eventStyle.marginTop)); // the top margin of the event aka the "position" or "time" in the day the event is
                    console.log("eventTop", eventTop);

                    // if the event is "later" than our current max and the event is actually before us then update maxMargin to be the margin of the event + the events height
                    if(eventTop >= maxMargin && eventTop < marginTop) maxMargin = eventTop + parseInt(eventStyle.height);

                    // if the event margin is lower or "later" than the current minHeight then update minHeight to be event the marginTop of that event - our marginTop
                    if(eventTop <= minMargin && eventTop > marginTop) minMargin = eventTop;
                    //console.log("maxMargin = inloop", maxMargin);
                    console.log("minHeight in loop", minHeight);
                }
            }

            // we calculate maxHeight as (our margin - the max margin we found in the loop) + current height of our div :)
            maxHeight = (marginTop - maxMargin) + height;
            minHeight = minMargin - marginTop;
            console.log("maxHeight", maxHeight);
            console.log("minheight",minHeight);
        };

        // get the max and min div margins for draggable events
        // check other divs for collisions
        const getDragMaxMin = () => {
            //const marginTop = parseInt(styles.marginTop);
            console.log("marginTop getDragMaxmin",marginTop)

            maxHeight = 0; // 0 is the max margin
            minHeight = 650 - height; // 650 is the min margin

            const events = document.getElementsByClassName(day);
            console.log(events);

            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventHeight = parseInt(eventStyle.height); // height + 19 offset for day label
                    const eventTop = convertMargin(parseInt(eventStyle.marginTop));

                    if(eventTop >= maxHeight && eventTop < marginTop) maxHeight = (eventTop+eventHeight);
                    if((eventTop-height) <= minHeight && eventTop > marginTop) minHeight = eventTop-height;
                }
            }
        }

        let y = 0;

        // TOP RESIZE
        const onMouseMoveTopResize = (event) => {
            if(event.clientY % sensitivity === 0){

                let dy = (event.clientY) - y;
                const originalHeight = height;
                height = height-dy*25;

                if(height > maxHeight){
                    height = maxHeight;
                }
                if(height < 50){
                    height = 50;
                }

                // update height and marginTop
                marginTop -= (height-originalHeight);
                resizeableElement.style.marginTop = `${marginTop+19}px`;

                resizeableElement.style.height = `${height}px`;
            }
            y = event.clientY;
        };

        const onMouseUpTopResize = (event) => {
            document.removeEventListener("mousemove", onMouseMoveTopResize);
            document.removeEventListener("mouseup", onMouseUpTopResize);
        };

        const onMouseDownTopResize = (event) => {
            getMaxMinHeights();
            y = event.clientY;
            const styles = window.getComputedStyle(resizeableElement);
            resizeableElement.style.bottom = styles.bottom;
            resizeableElement.style.top = null;
            document.addEventListener("mousemove", onMouseMoveTopResize);
            document.addEventListener("mouseup", onMouseUpTopResize);
        };

        // BOTTOM RESIZE
        const onMouseMoveBottomResize = (event) => {
            if(event.clientY % sensitivity === 0){
                let dy = (event.clientY) - y;
                height = height+dy*25;

                if(height > minHeight){
                    height = minHeight;
                }
                if(height < 50){
                    height = 50;
                }

                resizeableElement.style.height = `${height}px`;
            }
            y = event.clientY;
            console.log("height", height);
        };

        const onMouseUpBottomResize = (event) => {
            console.log("new maxHeight", maxHeight);
            document.removeEventListener("mousemove", onMouseMoveBottomResize)
            document.removeEventListener("mouseup", onMouseUpBottomResize);
        };

        const onMouseDownBottomResize = (event) =>{
            getMaxMinHeights();
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
            if(event.clientY % sensitivity === 0){
                let dy = (event.clientY) - y;
                marginTop = marginTop+dy*25;
                resizeableElement.style.marginTop = `${marginTop+20}px`;

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

        const onMouseUpMiddleResize = (event) => {
            // check if we can actually move there
            // if we can move it, otherwise jump event back to original location
            if(checkCollisions()){
                marginTop = originalMarginTop;
                resizeableElement.style.marginTop = `${marginTop+20}px`;
            }
            else originalMarginTop = marginTop;

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
            getDragMaxMin();
            y = event.clientY;

            // styles
            resizeableElement.style.top = null;
            resizeableElement.style.bottom = null;

            // change style of event
            resizeableElement.style.opacity = '0.75';
            resizeableElement.style.borderTopRightRadius = '15px';
            resizeableElement.style.borderBottomRightRadius = '15px';

            // event listeners
            document.addEventListener("mousemove", onMouseMoveMiddleResize);
            document.addEventListener("mouseup", onMouseUpMiddleResize)
        };

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
    }, [day]);

    return (
        <div className={day + " eventCard"} ref={refBox} style={{marginTop:position[0], height:position[1], backgroundColor: colors.background, borderColor: colors.border}}>
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
                    {time[0].toLocaleTimeString([],{hour: 'numeric', minute:'2-digit'})}-{time[1].toLocaleTimeString([],{hour: 'numeric', minute:'2-digit'})}
                </div>
            <div className="resizeBottom" ref={refBottom}></div>
        </div>
    );

}

const Hour = ({ hour, createEvent, last }) => {
    const handleClick = () => {
        console.log("creating event");
        createEvent(hour);
    };

    return (
        <div className={ last ? "hourLast" : "hour" } onClick={() => handleClick()}></div>
    );
}

const Day = ( {day, events, index, addCreatedEvent} ) => {
    const capitalize = (s) => {
        return s[0].toUpperCase() + s.slice(1);
    }

    let last = false;
    if(day === "friday"){
        last = true;
    }

    // takes a reservation time and returns the position (margin and height) for rendering
    const getPosition = (startTime,endTime) => {
        const marginTop = 20 + (startTime.getHours()-8)*50;
        const height = Math.round(((endTime-startTime)/3.6e+6)*50);

        console.log(marginTop);

        return [marginTop, height];
    }

    const handleCreate = (hour) => {
        let startTime = new Date();
        startTime.setHours(hour);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
    
        let endTime = new Date();
        endTime.setHours(hour+1);
        endTime.setMinutes(0);
        endTime.setSeconds(0);

        const newEvent = {
            day: day,
            first_name: "Linus",
            last_name: "Zwaka",
            email: "zwakal@rpi.edu", // temp email
            rin: "662017350",
            start_time: startTime,
            end_time: endTime,
        }
        
        addCreatedEvent(day,newEvent);

    }

    const getColor = (index,eventsIndex) => {
        const color = index % eventsIndex;
        return {
            background: "var(--color-background-" + color + ")",
            border: "var(--color-border-" + color + ")",
        };
    }
    return(
        <div className="day">
            {events.map((event,index) => (
                <CalendarEvent
                    day={day}
                    time={[event.start_time,event.end_time]}
                    position={getPosition(event.start_time, event.end_time)}
                    key={index}
                    colors={getColor(index,5)} 
                />
            ))}
            <div className="dayLabel">{capitalize(day)}</div>
            <Hour hour={8} last={last} createEvent={handleCreate} />
            <Hour hour={9} last={last} createEvent={handleCreate}/>
            <Hour hour={10} last={last} createEvent={handleCreate}/>
            <Hour hour={11} last={last} createEvent={handleCreate}/>
            <Hour hour={12} last={last} createEvent={handleCreate}/>
            <Hour hour={13} last={last} createEvent={handleCreate}/>
            <Hour hour={14} last={last} createEvent={handleCreate}/>
            <Hour hour={15} last={last} createEvent={handleCreate}/>
            <Hour hour={16} last={last} createEvent={handleCreate}/>
            <Hour hour={17} last={last} createEvent={handleCreate}/>
            <Hour hour={18} last={last} createEvent={handleCreate}/>
            <Hour hour={19} last={last} createEvent={handleCreate}/>
            <Hour hour={20} last={last} createEvent={handleCreate}/>
        </div>
    );
}


const Calendar = ( {room, week} ) => {
    let [eventCreated, setEventCreated] = useState(false);

    let [events,setEvents] = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
    });

    useEffect(() => {
        const weekStart = getWeekStart(week);
        console.log("Week start", weekStart, week);

        // parse reservations json returned from db
        // dates are turned into date objects and sorted into appropriate days
        const parseReservationsJson = (data) => {
            const options = {weekday: 'long'};

            let newEvents = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
            };

            for(let i = 0; i < data.length; i++){
                data[i].start_time = new Date(data[i].start_time);
                data[i].end_time = new Date(data[i].end_time);

                //events[data[i].start_time.toLocaleDateString(undefined, options).toLowerCase()] = "yes";
                const day = data[i].start_time.toLocaleDateString(undefined, options).toLowerCase()

                data[i].day = day;

                //newEvents[day].push(newCalendarEvent(day,data[i],i));
                newEvents[day].push(data[i]);
                console.log("newevents", newEvents);
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



    const addCreatedEvent = (day, newEvent) => {
        if(!eventCreated){
            let newEvents = events[day];
            newEvents.push(newEvent);
            setEvents({...events, [day]: newEvents});

            console.log("newly created", events);

            setEventCreated(true);
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
                <Day day={dayKey} events={value} key={dayKey} addCreatedEvent={addCreatedEvent}/>
            ))}
        </div>
    );
}

const getWeek = (week) => {
    const weekStart = getWeekStart(week);
    const weekEnd = getWeekEnd(week);

    return weekStart.getMonth()+1 + '/' + weekStart.getDate() + ' - ' + weekEnd.getMonth()+1 + '/' + weekEnd.getDate();
}

const CalendarView = ( {room} ) => {

    let [calendarIndex, setCalendarIndex] = useState(0);
    let [weekString, setWeekString] = useState(getWeek(0))

    // store the calendars
    // just the next two weeks for now
    const weekCalendars = [
        <Calendar key={0} week={0} room={room} />,
        <Calendar key={1} week={1} room={room} />
    ];


    const setCalendarLeftArrow = () => {
        if(calendarIndex > 0){
            console.log(calendarIndex-1);
            setCalendarIndex(calendarIndex-1);
            setWeekString(calendarIndex-1);
        }
    }

    const setCalendarRightArrow = () => {
        if(calendarIndex < weekCalendars.length-1){
            console.log(calendarIndex+1);
            setCalendarIndex(calendarIndex+1);
            setWeekString(calendarIndex+1);
        }
    }


    return (
        <>
        <div className="overlay"/>
        <div className="calendar">
            <div className="calendarBar">
                <div className="calendarButton" onClick={() => setCalendarLeftArrow()}><HiChevronDoubleLeft size={50} /></div>
                <div style={{position:'fixed'}}><h2>{weekString}</h2></div>
                <div className="calendarButton" onClick={() => setCalendarRightArrow()}><HiChevronDoubleRight size={50} /></div>
            </div>
            {weekCalendars[calendarIndex]}
        </div>
        <div className="main"/>
        </>
    );
};

export default CalendarView;
