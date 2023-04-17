import React from 'react';
import { useEffect, useRef } from 'react';
import './Test.css';
import '../assets/styles/main.css';

const CalendarEvent = ( { day, position } ) => {
    const sensitivity = 15;

    const refBox = useRef(null);
    const refTop = useRef(null);
    const refBottom = useRef(null);
    const refMiddle = useRef(null);

    // convert from px to int for height calculations
    const convertMargin = (num) => {
        return Math.floor((num)/50)*50;
    }

    useEffect(() => {

        const resizeableElement = refBox.current;
        const styles = getComputedStyle(resizeableElement);
        let height = parseInt(styles.height, 10);
        let dyHeight = 0; // keep track of change in height for this mousedown event

        let marginTop = convertMargin(parseInt(styles.marginTop));

        // maximum and minimum height div can have
        let maxHeight = height + marginTop;
        let minHeight = convertMargin(650 - (marginTop)) //TODO change 619 to maxSize of day as scaling could change

        const getMaxMinHeights = () => {
            // also need to check maxheight and consider other divs as well so they don't collide
            const events = document.getElementsByClassName(day);
            marginTop = convertMargin(parseInt(styles.marginTop));
            console.log("marginTop", marginTop);
            maxHeight = height + marginTop;
            minHeight = convertMargin(650 - (marginTop)) //TODO change 619 to maxSize of day as scaling could change

            // loop over elements from this day and if we find a height less than max then
            // update max to reflect the new maximum height this element can have
            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventTop = convertMargin(parseInt(eventStyle.marginTop));

                    if(eventTop < marginTop) maxHeight = (marginTop - (eventTop+parseInt(eventStyle.height)))+height;
                    if(eventTop > marginTop) minHeight = eventTop-marginTop;
                }
            }

            console.log("maxHeight", maxHeight);
            console.log("minheight",minHeight);
        };

        // get the max and min div margins for draggable events
        // check other divs for collisions
        const getDragMaxMin = () => {
            const marginTopPx = parseInt(styles.marginTop);

            maxHeight = 19; // 19px is the max margin
            minHeight = 650; // 650px is the min margin

            const events = document.getElementsByClassName(day);

            for(let i = 0; i < events.length; i++){
                if(events[i] !== resizeableElement){
                    const eventStyle = getComputedStyle(events[i]);
                    const eventHeight = parseInt(eventStyle.height); // height + 19 offset for day label
                    const eventTopPx = parseInt(eventStyle.marginTop);

                    if(eventTopPx < marginTopPx) maxHeight = (eventTopPx+eventHeight);
                    if(eventTopPx > marginTopPx) minHeight = eventTopPx-height;
                    console.log("eventToppx", eventTopPx);
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
                else if(height < 50){
                    height = 50;
                }
                else{
                    dyHeight += dy*25;
                }

                // update height and marginTop
                marginTop -= (height-originalHeight);
                resizeableElement.style.marginTop = `${marginTop}px`;

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
                else if(height < 50){
                    height = 50;
                }
                else{
                    dyHeight += dy*25;
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
            let change = parseInt(resizeableElement.style.marginTop);

            if(event.clientY % sensitivity === 0){
                let dy = (event.clientY) - y;
                change = change+dy*25;

                if(change < maxHeight){
                    change = maxHeight;
                }
                else if(change > minHeight){
                    change = minHeight;
                }
                resizeableElement.style.marginTop = `${change}px`;

            }
            y = event.clientY;
            console.log("change", change);
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
        <div className="monday eventCard" ref={refBox} style={{marginTop:position}}>
            <div className="resizeTop" ref={refTop}></div>
            <div className="resizeMiddle" ref={refMiddle}></div>
                <div class="labels">
                    Room 353-A
                </div>
                <div class="location">
                    Folsom, 3rd Floor
                </div>
                <div class="reserveName">
                    Henry, Brian & Zwaka, Linus
                </div>
                <div class="time">
                    2:00-4:00 P.M.
                </div>
            <div className="resizeBottom" ref={refBottom}></div>
        </div>
    );

}

const Calendar = () => {


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
                    <div className="dayLabel">Monday</div>
                    <CalendarEvent day="monday" position="169px"/>
                    <CalendarEvent day="monday" position="19px"/>
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
}

export default Calendar;
