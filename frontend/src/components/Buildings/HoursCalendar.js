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
    const weeks = useContext(HoursContext);

    let openStyle = '';

    // as long as the template exists
    if(weeks.templates[weeks.currentTemplate] !== undefined && Object.keys(weeks.templates[weeks.currentTemplate]).length !== 0) {

        // decide if building is open at this hour
        const thisHour = new Date(day.getTime());
        thisHour.setHours(hour);
        thisHour.setMinutes(0);

        // get the opening hour of today
        const weekday = day.toLocaleDateString(undefined, options).toLowerCase();

        // check if this hour is closed or open
        const currentDayHours = weeks.templates[weeks.currentTemplate][weekday + '_hours'];
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
        <div className="day" id={`${day.getDate()} day`}>
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

    const hoursContext = useContext(HoursContext);

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
                console.log('mousing over')
                if(!currentDay.has(target.getAttribute('id'))) currentDay.add(event.target.getAttribute('id'));


                if(openSelected){
                    if(target.classList.contains('editHoursClosed')) {
                        target.classList.remove('editHoursClosed');
                    }
                    target.classList.add('editHoursOpen');
                }
                else{
                    if(target.classList.contains('editHoursOpen')){
                        target.classList.remove('editHoursOpen');
                    }
                    target.classList.add('editHoursClosed');
                }
            }
        };


        const onMouseDownEvent = (event) => {
            console.log('event down ');

            // if the mouse down event didn't happen inside the calendar
            if(!event.target.classList.contains('hour') && !event.target.classList.contains('hourLast')) return;

            onMouseOverEvent(event);

            for (let i = 0; i < hours.length; i++){
                console.log('added so soss');
                hours[i].addEventListener("mouseover", onMouseOverEvent);
            }
        };

        const onMouseUpEvent = (event) => {
            console.log('event up triggered');

            if(!event.target.classList.contains('hour') && !event.target.classList.contains('hourLast')) return;

            hoursContext.setCreatorState();
            hoursContext.handleEditSelect();


            for (let i = 0; i < hours.length; i++){
                console.log('here');
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

        const onKeyDownEvent = (event) => {
            if(event.key === 'x'){
                openSelected = !openSelected;
            }
        };

        document.addEventListener("mousedown", onMouseDownEvent)
        document.addEventListener("keydown", onKeyDownEvent);
        document.addEventListener("mouseup", onMouseUpEvent);

        return () => {
            for (let i = 0; i < hours.length; i++){
                console.log('here');
                hours[i].removeEventListener("mouseover", onMouseOverEvent);
            }
            document.removeEventListener("mousedown", onMouseDownEvent);
            document.removeEventListener("keydown", onKeyDownEvent);
            document.removeEventListener("mouseup", onMouseUpEvent);
        }
    },[hoursContext.templateSaved, hoursContext.editing])

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
    const [templateSaved, setSave] = useState(true);
    const [updateTemplate, setUpdateTemplate] = useState(false);

    const [weeks, setWeeks] = useState([]);
    const [calendarIndex, setCalendarIndex] = useState(0);
    const [templates, setTemplates] = useState({}); // a dictionary of templates where the key is the template name and the value is the schedule

    const [creatorOpen, setCreatorOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const building = useContext(BuildingContext);

    useEffect(() => {
        console.log(weeks);
    },[calendarIndex]);

    const setCreatorState = () => {
        console.log(calendarIndex, weeks.length)
        if (weeks.length === 0) setCreatorOpen(true);
    };

    const handleSubmit = async () => {
        console.log(weeks[calendarIndex]);
        let data = { template_name: weeks[calendarIndex].template,
                       hours:  {}}

        const week = weeks[calendarIndex].week;

        // go through every hour and check if its open or closed, update min max
        for(let i = 0; i < 7; i++){

            const day = new Date(week[0].getTime());
            day.setDate(week[0].getDate()+i);

            console.log(day.getDate());

            const currentDay = document.getElementById(`${day.getDate()} day`);
            const currentDayHours = currentDay.querySelectorAll('*');

            console.log(currentDay, currentDayHours);

            const weekday = day.toLocaleDateString(undefined, options).toLowerCase()
            data['hours'][weekday + '_hours'] = []

            let startHour = -1;

            let index = 8; // keep track of hour we are on
            for(let hour of currentDayHours){
                if(hour.classList.contains('hour') || hour.classList.contains('hourLast')){
                    if(startHour === -1 && hour.classList.contains('editHoursOpen')){
                        startHour = index; // new min
                    }
                    else if(startHour !== -1 && hour.classList.contains('editHoursClosed') || (startHour !== -1 && index === 20)){
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
        const postWeekString = week[0].getMonth()+1 + "-" + week[0].getDate() + "-" + week[0].getFullYear();

        let fetchUrl = process.env.REACT_APP_API_URL + `/floors_api/buildings/${building.building.id}/create_hours/?date=${postWeekString}&create_template=true`;
        if(document.querySelector('#overwrite').checked === true) fetchUrl += '&overwrite_templates=true/';
        else fetchUrl += '/';

        console.log(document.querySelector('#overwrite').checked,fetchUrl);

        const response = await fetch(fetchUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if(response.status === 201){
            // add the new template unless it already exists
            const templateExists = building.building.hours_templates.includes(data.template_name);

            let newWeeks = [...weeks];
            newWeeks[calendarIndex] = {...newWeeks[calendarIndex], template: data.template_name};

            if(!templateExists){
                building.buildingAddHoursTemplate(data.template_name);
            }

            // add to the template list or overwrite data if it exists
            const newTemplates = {...templates};
            newTemplates[data.template_name] = data.hours;

            console.log(newTemplates);
            // update use states
            setTemplates(newTemplates);
            setWeeks(newWeeks);
            setCreatorOpen(false);
            setSave(true);
        }

    };

    useEffect(()=>{
        console.log(weeks, templates, currentTemplate);
    },[templates])

    // controls what week is selected by user
    const setCalendarLeftArrow = () => {
        if(calendarIndex > 0){
            setCalendarIndex(calendarIndex-1);
        }
    };

    const setCalendarRightArrow = () => {
        setUpdateTemplate(false);
        setCalendarIndex(calendarIndex+1);
    };

    const addTemplate = (templateName, hours) => {
        while(templates[templateName] !== undefined) templateName = `-- Copy -- ${templateName}`;
        console.log(templateName)

        const newTemplates = {...templates};
        newTemplates[templateName] = hours;
        setTemplates(newTemplates);

        return templateName;
    };

    const handleNameUpdate = (event) => {
        const error = document.getElementById('errorName');

        if(!building.building.hours_templates.includes(event.target.value)){
            const newWeeks = [...weeks];
            newWeeks[calendarIndex] = {...newWeeks[calendarIndex], template: event.target.value};

            const newTemplates = {...templates};
            newTemplates[event.target.value] = {...newTemplates[currentTemplate]};
            delete newTemplates[currentTemplate];

            // update building template list for future renders
            building.buildingUpdateHoursTemplate(currentTemplate, event.target.value);

            setCurrentTemplate(event.target.value);
            setTemplates(newTemplates);
            setWeeks(newWeeks);
            error.textContent = '';
        }
        else if(event.target.value !== currentTemplate) error.textContent = 'Name taken!';

        console.log("done with handlenameupdate");
    };

    const handleTemplateSelect = (template) => {
        // console.log(updateTemplate);
        // if(!updateTemplate) return;

        setEditing(false); // after a template is selected we are no longer editing another template

        if(template === 'create'){
            console.log('here for some odd reason');
            setCreatorOpen(true);

            const newTemplate = addTemplate('New template', {});
            building.buildingAddHoursTemplate(newTemplate);

            setCurrentTemplate(newTemplate);
            setSave(false);

            const newWeeks = [...weeks];
            newWeeks[calendarIndex] = {...newWeeks[calendarIndex], template: newTemplate};
            setWeeks(newWeeks);
        }


        else if(template === 'copy'){
            const templateCopy = addTemplate(currentTemplate, {...templates[currentTemplate]});
            building.buildingAddHoursTemplate(templateCopy);

            setSave(false);
            setUpdateTemplate(true);
            setCurrentTemplate(templateCopy);
        }

        // TODO add delete

        else if(template !== currentTemplate){
            // check if the current template has been saved
            if(!templateSaved) {
                if(window.confirm("This template hasn't been saved yet! Are you sure you want to continue?")) {
                    building.buildingRemoveHoursTemplate(currentTemplate);
                }
                else {
                    document.querySelector('#templateSelect').value = currentTemplate;
                    return false;
                }
            }

            setUpdateTemplate(true);
            setCurrentTemplate(template);
        }

        return true;
    };

    const handleEditSelect = () => {
        console.log(currentTemplate);
        if(currentTemplate === ''){ // currently no template is loaded for this week
            setCreatorOpen(true);
            handleTemplateSelect('create');
        }
        else if(currentTemplate !== '' && templateSaved && !editing){
            console.log(editing);
            if(window.confirm("Create a copy of the current template? Click 'Cancel' to edit instead.")) handleTemplateSelect('copy');
            setEditing(true);
        }
    };

    const getWeekHours = async (week, getTemplate=false) => {
        const weekString = week[0].getMonth()+1 + "-" + week[0].getDate() + "-" + week[0].getFullYear();
        let fetchUrl = process.env.REACT_APP_API_URL + `/floors_api/buildings/${building.building.id}/get_hours/?date=${weekString}`;

        let newWeeks = [...weeks];

        if(getTemplate){
            fetchUrl += `&template=${currentTemplate}`
            console.log(templateSaved, currentTemplate);
            if(templateSaved && currentTemplate !== ''){
                if(window.confirm("Would you like to replace other weeks' templates with this one?")){
                    fetchUrl += '&overwrite=true';

                    for(let week in newWeeks){
                        newWeeks[week] = {...newWeeks[week], template: currentTemplate};
                    }

                    setWeeks(newWeeks)
                }
            }
        }
        else if(templateSaved){
            newWeeks[calendarIndex] = {};
            newWeeks[calendarIndex].template = currentTemplate;
        }


        const response = await fetch(`${fetchUrl}/`);
        const data = await response.json();

        const newWeekString = week[0].getMonth()+1 + '/' + week[0].getDate() + ' - ' + (week[1].getMonth()+1) + '/' + week[1].getDate();
        const newWeek = {week: week, weekString: newWeekString, template: ''};

        if(data !== '' && templates[data.template_name] === undefined){

            // parse the data

            if(data !== '') {
                newWeek.template = data.template_name;

                // make sure the template we just got is saved
                if(templates[data.template_name] === undefined){
                    templates[data.template_name] = data;
                }
            }
        }
        else if (data !== '') newWeek.template = data.template_name;

        newWeeks[calendarIndex] = newWeek;
        setWeeks(newWeeks);

        if (data === '') return '';
        return {template_name: data.template_name};
    };

    // useEffect runs whenever the user switches the week
    useEffect(() => {
        if(weeks.length <= calendarIndex){
            fetch();
            async function fetch(){
                const week = getWeek(calendarIndex);
                const data = await getWeekHours(week);

                console.log('data', data.template_name);
                // make this template the active template
                if(data !== '') setCurrentTemplate(data.template_name);
            }
        }
        else setCurrentTemplate(weeks[calendarIndex].template);
    }, [calendarIndex]);

    // this useEffect runs whenever the current template is updated
    useEffect(() => {
        if(updateTemplate){ // don't make the same call twice (if not first render)
            const newWeeks = [...weeks];

            if(templateSaved) fetch();

            newWeeks[calendarIndex] = {...newWeeks[calendarIndex], template: currentTemplate};
            setWeeks(newWeeks);
            setUpdateTemplate(false);

            async function fetch(){
                const data = await getWeekHours(weeks[calendarIndex].week, true);
                document.querySelector('#templateSelect').value = data.template_name;
            }

        }
    }, [currentTemplate]);

    const hoursContextValue = {
        weeks,
        templates,
        calendarIndex,
        templateSaved,
        editing,

        handleTemplateSelect,
        handleEditSelect,
        currentTemplate,

        setCreatorState,
    };
                    // <div className="roomAvailable" style={{height: '2%', width: creatorOpen ? '' : '20%', borderBottomLeftRadius: creatorOpen ? '0' : '', marginBottom: creatorOpen ? '0' : '2%', borderBottomRightRadius: creatorOpen ? '0' : ''}}>
                    //     <button className="myBook" style={{width: '70px', height: '30px'}} onClick={() => setCreatorOpen(!creatorOpen)}>Create</button>
                    // </div>

    return (
        <>
            <div className="overlay" />
            {weeks.length > calendarIndex && (

            <div className="calendar" style={{justifyContent: 'center', overflowY: 'scroll'}}>

                <div className="calendarBar">
                    <div className="calendarButton" onClick={() => setCalendarLeftArrow()}><HiChevronDoubleLeft size={50} /></div>
                    <div style={{position:'center'}}><h2>{weeks[calendarIndex].weekString}</h2></div>
                    <div className="calendarButton" onClick={() => setCalendarRightArrow()}><HiChevronDoubleRight size={50} /></div>
                    <div className="calendarButton" style={{width:'35px', height:'35px', position:'absolute', marginLeft:'98%', marginTop:'-2%'}} onClick={() => {handleClose()}}><AiOutlineCloseCircle size={35} /></div>
                </div>

                <div style={{justifyContent: 'start', display:'flex', flexDirection: 'column', alignItems: 'left', marginBottom: '1%'}}>

                    <div style={{width: '45%', display: 'flex', flexDirection: 'row'}}>
                        <b style={{marginRight: '1%'}}>Select Template:</b>
                        {weeks.length > calendarIndex &&
                            <select id="templateSelect" style={{width: '50%'}} onChange={(event) => handleTemplateSelect(event.target.selectedOptions[0].value)}>
                                {!weeks[calendarIndex].template && <option selected>--------</option>}
                                {building.building.hours_templates.map((template) => {
                                    if(template === weeks[calendarIndex].template) return <option selected value={template}>(Active) {template}</option>
                                    else return <option value={template}>{template}</option>
                                })}
                                <option value="create">Create template...</option>
                            </select>}
                        <button className='myBook' style={{borderRadius: '5px', width: '50px', height: '20px', marginLeft: '2%', padding: '1px', color: 'white', backgroundColor: '#5fb760'}} onClick={() => currentTemplate !== '' ? setCreatorOpen(!creatorOpen) : null}>Edit</button>
                        <button className='myBook' style={{borderRadius: '5px', width: '50px', height: '20px', padding: '1px', color: 'white', backgroundColor: '#c93135'}}>Delete</button>
                    </div>

                    {creatorOpen && <div className="roomsContent" style={{margin: '0', padding: '2%', paddingBottom: '1%', marginTop: '1%', boxShadow: 'inset 2px 0px 0px 0px rgba(0,0,0, 0.5), inset -2px -2px 0px 0px rgba(0, 0, 0, 0.5)'}}>
                        <div style={{width: '25%', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                            <b style={{marginRight: '1%'}}>Template Name:</b>
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <input style={{borderRadius: '5px'}} defaultValue={currentTemplate} onBlur={(event) => handleNameUpdate(event)}/>
                                <p id="errorName" className="error"></p>
                            </div>
                            <label for="overwrite" style={{marginTop: '2%', display: 'flex', flexDirection: 'row'}}>
                                <input type="checkbox" id="overwrite" style={{marginRight: '10px'}}/>
                                Overwrite templates
                            </label>
                            <button className='myBook' style={{borderRadius: '5px', width: '50px', height: '20px', padding: '1px', color: 'white', backgroundColor: '#5fb760'}} onClick={(event) => handleSubmit(event)}>Save</button>
                        </div>
                    </div>}

                </div>

                <HoursContext.Provider value={hoursContextValue}>
                    {weeks.length > calendarIndex && <HoursCalendar
                        key={calendarIndex}
                        week={weeks[calendarIndex].week}
                        weekIndex={calendarIndex}
                     />}
                </HoursContext.Provider>
                <div style={{marginTop: '2%', justifyContent: 'center', display: 'flex', flexDirection:'row'}}>
                    <button className="ready" style={{width: '75%'}} onClick={() => handleSubmit()}>Submit</button>
                </div>
            </div>)}
        </>
    );
}

export default HoursCalendarView;
