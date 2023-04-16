import React from 'react';
import { useEffect, useRef } from 'react';
import { Resizable } from 'react-resizable';
import { ResizableBox } from 'react-resizable';
import './Test.css';
import '../assets/styles/main.css';

const Calendar = () => {

    const refBox = useRef(null);
    const refTop = useRef(null);

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
                    <div className="eventCard">
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
