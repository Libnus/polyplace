import React from 'react';
import { useEffect, useRef } from 'react';
import './Test.css';
import '../assets/styles/main.css';

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
                    <div className="hour">
                        <div className="eventCard">hi</div>
                    </div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour">
                    </div>
                    <div className="hour"></div>
                    <div className="hour"></div>
                    <div className="hour">
                        <div className="eventCard" style={{height: '200%'}}>
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
                        </div>
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
