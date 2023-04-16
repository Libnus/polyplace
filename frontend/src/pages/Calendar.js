import React from 'react';
import { useEffect, useRef } from 'react';
import { Resizable } from 'react-resizable';
import { ResizableBox } from 'react-resizable';
import './Test.css';
import '../assets/styles/main.css';

const Calendar = () => {

    const sensitivity = 15;

    const refBox = useRef(null);
    const refTop = useRef(null);
    const refBox1 = useRef(null);
    const refTop1 = useRef(null);
    const refBottom = useRef(null);

    let day = "monday";

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
        console.log(maxHeight);

        // also need to check maxheight and consider other divs as well so they don't collide
        const events = document.getElementsByClassName(day);

        // loop over elements from this day and if we find a height less than max then
        // update max to reflect the new maximum height this element can have
        for(let i = 0; i < events.length; i++){
            if(events[i] !== resizeableElement){
                const eventStyle = getComputedStyle(events[i]);
                const eventTop = convertMargin(parseInt(eventStyle.marginTop));

                if(eventTop < marginTop) maxHeight -= eventTop+parseInt(eventStyle.height);
                if(eventTop > marginTop) minHeight = eventTop-marginTop;
            }
        }

        console.log("maxHeight", maxHeight);
        console.log("minheight",minHeight);

        let y = 0;

        // TOP RESIZE
        const onMouseMoveTopResize = (event) => {
            if(event.clientY % sensitivity === 0){

                let dy = (event.clientY) - y;
                height = height-dy*25;

                if(height > maxHeight){
                    height = maxHeight;
                }
                if(height < 50){
                    height = 50;
                }

                resizeableElement.style.height = `${height}px`;
            }
            y = event.clientY;
        };

        const onMouseUpTopResize = (event) => {
            console.log("top height", height);
            document.removeEventListener("mousemove", onMouseMoveTopResize);
            document.removeEventListener("mouseup", onMouseUpTopResize);
        };

        const onMouseDownTopResize = (event) => {
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
            maxHeight += dyHeight;
            dyHeight = 0;
            console.log("new maxHeight", maxHeight);
            document.removeEventListener("mousemove", onMouseMoveBottomResize)
            document.removeEventListener("mouseup", onMouseUpBottomResize);
        };

        const onMouseDownBottomResize = (event) =>{
            y = event.clientY;
            const styles = window.getComputedStyle(resizeableElement);
            resizeableElement.style.top = styles.top;
            resizeableElement.style.bottom = null;
            document.addEventListener("mousemove", onMouseMoveBottomResize);
            document.addEventListener("mouseup", onMouseUpBottomResize);
        }

        const resizerTop = refTop.current;
        resizerTop.addEventListener("mousedown", onMouseDownTopResize);
        const resizerBottom = refBottom.current;
        resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);

        return () => {
            resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
            resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
        }
    }, []);

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
                    <div className="monday eventCard" ref={refBox}>
                        <div className="resizeTop" ref={refTop}></div>
                        <div>yes</div>
                        <div className="resizeBottom" ref={refBottom}></div>
                    </div>

                    <div className="monday eventCard" ref={refBox1} style={{marginTop:"219px"}}>
                        <div className="resizeTop" ref={refTop1}>hey1</div>
                    </div>

                    <div className="monday eventCard" ref={refBox1} style={{marginTop:"19px"}}>
                        <div className="resizeTop" ref={refTop1}>hey</div>
                    </div>

                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour">
                    </div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour">
                    </div>
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
