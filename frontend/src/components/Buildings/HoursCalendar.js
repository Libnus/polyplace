import React from 'react';
import { useState, useEffect, useRef, createContext, useContext } from 'react';

import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { FormControlLabel, FormGroup } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

import { UserSession } from '../../UserSession';
import { BuildingContext } from '../../pages/Building';
import {getWeek, TimeMarker, isTimePast, isTimeEqual} from '../Reservations/Calendar';

import '../Reservations/Calendar.css';
import '../../assets/styles/main.css';

const HoursContext = createContext();

const options = {weekday: 'long'};

const Hour = ({day, hour, last}) => {
    const hours = useContext(HoursContext);

    let openStyle = '';

    if(hours.hours[hours.calendarIndex].id){
        // decide if building is open at this hour
        const thisHour = new Date(day.getTime());
        thisHour.setHours(hour);
        thisHour.setMinutes(0);

        // get the opening hour of today
        const weekday = day.toLocaleDateString(undefined, options).toLowerCase();

        // check if this hour is closed or open
        const currentDayHours = hours.hours[hours.calendarIndex][weekday + '_hours'];
        for (let i in currentDayHours){
            const parsedStart = currentDayHours[i].start_time.split(':');
            const parsedEnd = currentDayHours[i].end_time.split(':');

            const startHour = parseInt(parsedStart[0]);
            const startMinute = parseInt(parsedStart[1]);
            const endHour = parseInt(parsedEnd[0]);
            const endMinute = parseInt(parsedEnd[1]);

            // if we are past startTime and before end then hour is open
            if((isTimePast(thisHour, startHour, startMinute) || isTimeEqual(thisHour, startHour, startMinute)) && !isTimePast(thisHour, endHour, endMinute)){
                openStyle = 'editHoursOpen';
                break;
            }
        }
        if(openStyle === '') openStyle = 'editHoursClosed';
    }

    return (
        <div id={day.getDay()} className={`${openStyle} ${last ? "hourLast" : "hour"} ${day.getDay()} ${hour}`}></div>
    );
}

const Day = ({day}) => {
    const currTime = new Date()
    const isToday = currTime.getDate() === day.getDate() && !isTimePast(currTime, 21, 1) && isTimePast(currTime, 7, 59);
    const weekday = day.toLocaleDateString(undefined, options).toLowerCase()

    const last = weekday === "saturday";

    return(
        <div className="day" id={day.getDate()}>
            {isToday && <TimeMarker />}
            <div className="dayLabel">{weekday}</div>
            <Hour hour={8}  day={day} last={last}/>
            <Hour hour={9}  day={day} last={last}/>
            <Hour hour={10} day={day} last={last}/>
            <Hour hour={11} day={day} last={last}/>
            <Hour hour={12} day={day} last={last}/>
            <Hour hour={13} day={day} last={last}/>
            <Hour hour={14} day={day} last={last}/>
            <Hour hour={15} day={day} last={last}/>
            <Hour hour={16} day={day} last={last}/>
            <Hour hour={17} day={day} last={last}/>
            <Hour hour={18} day={day} last={last}/>
            <Hour hour={19} day={day} last={last}/>
            <Hour hour={20} day={day} last={last}/>
        </div>
    );
};

const HoursCalendar = ( {week, weekIndex} ) => {

    const hours = useContext(HoursContext);

    // gather the days of the week for rendering
    const days = [];
    for(let i = 0; i < 7; i++){
        const weekday = new Date(week[0].getTime());
        weekday.setDate(week[0].getDate()+i);
        days.push(weekday);
    }

    useEffect(() => {
        const hours = document.querySelectorAll('.hour,.hourLast');
        let openSelected = true;
        let currentDay = new Set();

        const onMouseOverEvent = (event) => {
            const target = event.target;

            if(target.classList.contains('hour') || target.classList.contains('hourLast')){
                if(!currentDay.has(target.getAttribute('id'))) currentDay.add(event.target.getAttribute('id'));
                console.log(currentDay);

                if(openSelected){
                    if(target.classList.contains('editHoursClosed')) {
                        target.classList.remove('editHoursClosed');
                    }
                    target.classList.add('editHoursOpen');
                    // update hours context
                }
                else{
                    if(target.classList.contains('editHoursOpen')){
                        target.classList.remove('editHoursOpen');
                    }
                    target.classList.add('editHoursClosed');
                    // update hours context
                }
            }
        };


        const onMouseDownEvent = (event) => {
            if(event.target.classList.contains('editHoursClosed')) openSelected = false
            else openSelected = true;

            onMouseOverEvent(event);

            for (let i = 0; i < hours.length; i++){
                hours[i].addEventListener("mouseover", onMouseOverEvent);
            }
        };

        const onMouseUpEvent = (event) => {
            for (let i = 0; i < hours.length; i++){
                hours[i].removeEventListener("mouseover", onMouseOverEvent);
            }

            const currentDayArray = Array.from(currentDay);

            for(let i = 0; i < currentDayArray.length; i++){
                const dayHours = document.getElementsByClassName(currentDayArray[i]);
                for(let j = 0; j < dayHours.length; j++){
                    if(!dayHours[j].classList.contains('editHoursOpen')){
                        dayHours[j].classList.add('editHoursClosed');
                    }
                }
            }

            currentDay = new Set();
        };

        document.addEventListener("mousedown", onMouseDownEvent)
        document.addEventListener("mouseup", onMouseUpEvent);

        return () => {
            document.removeEventListener("mousedown", onMouseDownEvent);
            document.removeEventListener("mouseup", onMouseUpEvent);
        }
    },[])

// var reBoxShadow = /(?:rgb\((\d+), ?(\d+), ?(\d+)\)([^,]*))+/g;

    return (
        <div className="calendarContainer" style={{height: 'auto'}}>
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
            {days.map((day, index) => (
                <Day key={index} day={day} />
            ))}
        </div>
    );
};

const HoursCalendarView = ( { handleClose } ) => {
    const [currentTemplate, setCurrentTemplate] = useState('');
    const [calendarIndex, setCalendarIndex] = useState(0);
    const [week, setWeek]  = useState(getWeek(0));
    const [weekString, setWeekString] = useState();

    const [creatorOpen, setCreatorOpen] = useState(false);
    const [hours, setHours] = useState([]);

    const building = useContext(BuildingContext);

    console.log(building);

    const handleSubmit = async () => {
        let data = { template_name: hours[calendarIndex].template_name,
                       hours:  {}}

        // go through every hour and check if its open or closed, update min max
        for(let i = 0; i < 7; i++){
            const day = new Date(week[0].getTime());
            day.setDate(week[0].getDate()+i);

            const currentDay = document.getElementById(day.getDate());
            const currentDayHours = currentDay.querySelectorAll('*');

            const weekday = day.toLocaleDateString(undefined, options).toLowerCase()
            data['hours'][weekday + '_hours'] = []

            let startHour = -1;

            let index = 8; // keep track of hour we are on
            for(let hour of currentDayHours){
                if(hour.classList.contains('hour') || hour.classList.contains('hourLast')){
                    if(day.getDay() === 3){
                        console.log(hour);
                    }
                    if(startHour === -1 && hour.classList.contains('editHoursOpen')){
                        startHour = index; // new min
                    }
                    else if(startHour !== -1 && hour.classList.contains('editHoursClosed') || (startHour !== -1 && index === 20)){
                        if(day.getDay() === 3){
                            console.log('pushed', hour, startHour, index, currentDayHours.length+3);
                        }
                        data['hours'][weekday + '_hours'].push({
                            start_time: startHour + ':00',
                            end_time: index + ':00',
                        });
                        startHour = -1;
                    }
                    index++;
                }
            }
        }
        console.log(data);

        const postWeekString = week[0].getMonth()+1 + "-" + week[0].getDate() + "-" + week[0].getFullYear();
        const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/buildings/${building.building.id}/create_hours/?date=${postWeekString}&create_template=true&overwrite_templates=true/`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if(response.status === 201){
            let newHours = [...hours];
            for(let i in data['hours']) newHours[calendarIndex][i] = [...data['hours'][i]];
            setHours(newHours);

            if(!building.building.hours_templates.includes(data.template_name)){
                const newBuilding = {...building.building};
                newBuilding.hours_templates.push(data.template_name);
                console.log(newBuilding);
                building.setBuilding(newBuilding);
            }
        }

    };

    const handleNameUpdate = (event) => {
        const newHours = [...hours];

        newHours[calendarIndex].template_name = event.target.value;
        setHours(newHours);
    };

    // controls what week is selected by user
    const setCalendarLeftArrow = () => {
        if(calendarIndex > 0){
            setCalendarIndex(calendarIndex-1);
        }
    };

    const setCalendarRightArrow = () => {
        if(calendarIndex < 1){
            setCalendarIndex(calendarIndex+1);
        }
    };

    const getHours = async (getTemplate=false) => {
        const postWeekString = week[0].getMonth()+1 + "-" + week[0].getDate() + "-" + week[0].getFullYear();
        let fetchUrl = process.env.REACT_APP_API_URL + `/floors_api/buildings/${building.building.id}/get_hours/?date=${postWeekString}`;

        if(getTemplate){
            fetchUrl += `&template=${currentTemplate}`
        }

        const response = await fetch(`${fetchUrl}/`);
        const data = await response.json();
        return data;
    };

    const handleTemplateSelect = (event) => {
        if(event.target.value === 'Create template...'){
            setCreatorOpen(true);
            const newHours = [...hours];
            newHours[calendarIndex] = {};
            setHours(newHours);
        }

        else{
            setCurrentTemplate(event.target.value);
            setCalendarIndex();
        }
    };

    const parse = (data) => {
        const newHours = [...hours];
        newHours[calendarIndex] = data != "" ? data : {};
        setHours(newHours);
        return data;
    };

    useEffect(() => {
        const newWeek = getWeek(calendarIndex);
        setWeek(newWeek);
        const newWeekString = newWeek[0].getMonth()+1 + '/' + newWeek[0].getDate() + ' - ' + (newWeek[1].getMonth()+1) + '/' + newWeek[1].getDate();
        setWeekString(newWeekString);

        if(hours.length <= calendarIndex){
            fetch();
            async function fetch() {
                let data = await getHours();
                data = parse(data);
                console.log(data);
                setCurrentTemplate(data.template_name);
            }
        }

    }, [calendarIndex]);

    useEffect(() => {
        if(currentTemplate != ''){
            fetch();

            async function fetch(){
                const data = await getHours(true)
                parse(data);
            }
        }
    }, [currentTemplate]);

    useEffect(() => {
        console.log(hours);
    },[hours]);

    const hoursContextValue = {
        hours,
        calendarIndex,
    };

    return (
        <>
            <div className="overlay" />
            <div className="calendar" style={{justifyContent: 'center', overflowY: 'scroll'}}>

                <div className="calendarBar">
                    <div className="calendarButton" onClick={() => setCalendarLeftArrow()}><HiChevronDoubleLeft size={50} /></div>
                    <div style={{position:'center'}}><h2>{weekString}</h2></div>
                    <div className="calendarButton" onClick={() => setCalendarRightArrow()}><HiChevronDoubleRight size={50} /></div>
                    <div className="calendarButton" style={{width:'35px', height:'35px', position:'absolute', marginLeft:'98%', marginTop:'-2%'}} onClick={() => {handleClose()}}><AiOutlineCloseCircle size={35} /></div>
                </div>

                <div style={{justifyContent: 'start', display:'flex', flexDirection: 'column', alignItems: 'left'}}>
                    <div className="roomAvailable" style={{height: '2%', width: creatorOpen ? '' : '20%', borderBottomLeftRadius: creatorOpen ? '0' : '', marginBottom: creatorOpen ? '0' : '2%', borderBottomRightRadius: creatorOpen ? '0' : ''}}>
                        <button className="myBook" style={{width: '70px', height: '30px'}} onClick={() => setCreatorOpen(!creatorOpen)}>Create</button>
                    </div>

                    {creatorOpen && <div className="roomsContent" style={{margin: '0', padding: '2%', paddingBottom: '1%', marginBottom: '2%', marginTop: '0', boxShadow: 'inset 2px 0px 0px 0px rgba(0,0,0, 0.5), inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5)'}}>
                        <div style={{width: '25%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <b style={{marginRight: '1%'}}>Template Name:</b>
                            <input style={{borderRadius: '5px'}} defaultValue="New template" onBlur={(event) => handleNameUpdate(event)}/>
                            <label for="overwrite" style={{marginTop: '2%', display: 'flex', flexDirection: 'row'}}>
                                <input type="checkbox" id="overwrite" style={{marginRight: '10px'}}/>
                                Overwrite templates
                            </label>
                            <button className='myBook' style={{borderRadius: '5px', width: '50px', height: '20px', padding: '1px', color: 'white', backgroundColor: '#5fb760'}}>Save</button>
                        </div>
                    </div>}

                    <div style={{width: '35%', display: 'flex', flexDirection: 'row'}}>
                        <b style={{marginRight: '1%'}}>Select Template:</b>
                        {hours.length > calendarIndex &&
                            <select style={{width: '50%'}} onChange={(event) => handleTemplateSelect(event)}>
                                {!hours[calendarIndex].template_name && <option selected>--------</option>}
                                {building.building.hours_templates.map((template) => {
                                    if(template === hours[calendarIndex].template_name) return <option selected>(Active) {template}</option>
                                    else return <option>{template}</option>
                                })}
                                <option>Create template...</option>
                            </select>}
                        <button className='myBook' style={{borderRadius: '5px', width: '50px', height: '20px', marginLeft: '2%', padding: '1px', color: 'white', backgroundColor: '#5fb760'}}>Edit</button>
                        <button className='myBook' style={{borderRadius: '5px', width: '50px', height: '20px', padding: '1px', color: 'white', backgroundColor: '#c93135'}}>Delete</button>
                    </div>
                </div>

                <HoursContext.Provider value={hoursContextValue}>
                    {hours.length > calendarIndex && <HoursCalendar
                        key={calendarIndex}
                        week={week}
                        weekIndex={calendarIndex}
                     />}
                </HoursContext.Provider>
                <div style={{marginTop: '2%', justifyContent: 'center', display: 'flex', flexDirection:'row'}}>
                    <button className="ready" style={{width: '75%'}} onClick={() => handleSubmit()}>Submit</button>
                </div>
            </div>
        </>
    );
}

export default HoursCalendarView;
