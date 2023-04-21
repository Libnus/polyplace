import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './Test.css';
import '../../assets/styles/main.css';

import Datetime from 'react-datetime';

const CalendarEvent = ( { day, position, colors } ) => {
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
        let dyHeight = 0; // keep track of change in height for this mousedown event

        let marginTop = convertMargin(parseInt(styles.marginTop));

        // maximum and minimum height div can have
        // maxHeight: height a div can have when resizing the top of the div (top resize). Set it to zero as the default value (top margin in the day)
        // minHeight: height a div can have when resizing the bottom of the div (bottom resize)
        let maxHeight = 0;
        let minHeight = convertMargin(650 - (marginTop)); //TODO change 619 to maxSize of day as scaling could change

        // get the max and min height our div can be to avoid collisions with other events and not allow users to schedule a reservation during another time.
        const getMaxMinHeights = () => {
            const events = document.getElementsByClassName(day);
            marginTop = convertMargin(parseInt(styles.marginTop));
            console.log(events);
            console.log("marginTop", marginTop);

            // also define max and min margins for looping and we will set heights after. This is so there is no confusion between heights and margin calculations during iteration
            let maxMargin = 0;
            let minMargin = 650;

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
                    console.log("eventToppx", eventTop);
                    console.log("loop_minGrab",minHeight);

                }
            }

            console.log("maxGrab",maxHeight);
            console.log("minGrab",minHeight);
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
            const styles = window.getComputedStyle(resizeableElement);
            resizeableElement.style.top = styles.top;
            resizeableElement.style.bottom = null;
            document.addEventListener("mousemove", onMouseMoveBottomResize);
            document.addEventListener("mouseup", onMouseUpBottomResize);
        };

        // GRAB EVENT
        const onMouseMoveMiddleResize = (event) => {
            if(event.clientY % sensitivity === 0){
                let dy = (event.clientY) - y;
                marginTop = marginTop+dy*25;

                if(marginTop < maxHeight){
                    marginTop = maxHeight;
                }
                else if(marginTop > minHeight){
                    marginTop = minHeight;
                }
                resizeableElement.style.marginTop = `${marginTop+19}px`;

            }
            y = event.clientY;
            console.log("change", marginTop);
        };

        const onMouseUpMiddleResize = (event) => {
            document.removeEventListener("mousemove", onMouseMoveMiddleResize);
            document.removeEventListener("mouseup", onMouseUpMiddleResize);
        };

        const onMouseDownMiddleResize = (event) => {
            getDragMaxMin();
            y = event.clientY;
            const styles = window.getComputedStyle(resizeableElement);
            resizeableElement.style.top = null;
            resizeableElement.style.bottom = null;
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
    }, []);

    return (
        <div className={day + " eventCard"} ref={refBox} style={{marginTop:position, backgroundColor: colors.background, borderColor: colors.border}}>
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
                    2:00-4:00 P.M.
                </div>
            <div className="resizeBottom" ref={refBottom}></div>
        </div>
    );

}

const Calendar = ( {room} ) => {

    const events = useState({
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    });

    useEffect(() => {
        getReservations();
    },[]);

    const parseReservations = (data) => {
        const options = {weekday: 'long'};

        for(let i = 0; i < data.length; i++){
            data[i].start_time = new Date(data[i].start_time);
            data[i].end_time = new Date(data[i].end_time);

            events[data[i].start_time.toLocaleDateString(undefined, options)].add(data[i]);
        }

        console.log("events",events);
    }

    const getReservations = async () => {
        const response = await fetch(`http://127.0.0.1:8000/reservations_api/${room.id}/`);
        const data = await response.json();
        parseReservations(data);
    };

    // const events = [
    //     [
    //     {day: "monday", position: "169px"},
    //     {day: "monday", position: "219px"},
    //     {day: "monday", position: "269px"},
    //     {day: "monday", position: "19px"},
    //     {day: "monday", position: "119px"}
    //     ],
    // ];

    const getColor = (index,eventsIndex) => {
        const color = index % eventsIndex;
        return {
            background: "var(--color-background-" + color + ")",
            border: "var(--color-border-" + color + ")",
        };
    }

    const parseEvents = (events) => {
        let newCalendarEvents = [];

        for(let i = 0; i < events.length; i++){
            for(let j = 0; j < events[i].length;j++){
                const colors = getColor(j,events[i].length);
                console.log(colors);
                newCalendarEvents.push((<CalendarEvent
                    day={events[i][j].day}
                    position={events[i][j].position}
                    key={newCalendarEvents.length}
                    colors={colors}
                    />));
            }
        }

        return newCalendarEvents;
    }

    const [calendarEvents, setCalendarEvents] = useState(parseEvents(events));



    // useEffect(() => {
    //     // add loaded events in calendar
    //     for(let i = 0; i < events.length; i++){
    //         console.log(events[i],events.length,events[i].length);
    //         for(let j = 0; j < events[i].length;j++){
    //             console.log(j);
    //             setCalendarEvents(calendarEvents.concat(<CalendarEvent
    //                 day={events[i][j].day}
    //                 position={events[i][j].position}
    //                 key={calendarEvents.length}
    //                 styles={{
    //                     backgroundColor: getColor(j).background,
    //                     borderColor: getColor(j).border,
    //                 }}
    //                 />));
    //         }
    //     }
    // });

    // set their colors
    const setColors = () => {
        for(let i = 0; i < calendarEvents.length;i++){
            calendarEvents[i].style.backgroundColor = getColor(i).background;
            calendarEvents[i].style.borderColor = getColor(i).border;
        }
    }



    const addCalendarEvent = (day, position) => {
        setCalendarEvents(calendarEvents.concat(<CalendarEvent day={day} position={position} key={calendarEvents.length}/>));
        setColors();
    };

    return (
        <>
        <div className="overlay"/>
        <div className="calendar">
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

                <div className="day">
                    {calendarEvents}
                    <div className="dayLabel">Monday</div>
                    <div className="hour"></div>
                    <div className="hour" onClick={() => addCalendarEvent("monday", "69px")}></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                </div>


                <div className="day">
                    <div className="dayLabel">Tuesday</div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                </div>


                <div className="day">
                    <div className="dayLabel">Wednesday</div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                </div>

                <div className="day">
                    <div className="dayLabel">Thursday</div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                </div>

                <div className="day">
                    <div className="dayLabel">Friday</div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>
                    <div className="hour-last"></div>


                </div>

            </div>
        </div>
        <div className="main"/>
        </>
    );
};

export default Calendar;