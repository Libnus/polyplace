import React from 'react';
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import '../components/Reservations/Building.css';
import Calendar from '../components/Reservations/Calendar'

const RoomContext = React.createContext();

const Room = ({index, room, floor, building}) => {
	let [isCalendarOpen, setCalendarOpen] = useState(false);


	const handleOpen = () => {
		if(isCalendarOpen === false) setCalendarOpen(true);
		else setCalendarOpen(false);
	};

	console.log(room);

	// get css class name for room status
	let statusClass = "";
	let statusMessage = "";
	if(room.room_status.status === "free"){
		statusClass = "room";
		if(room.room_status.time.length !== 0) statusMessage = "free until " + room.room_status.time;
		else statusMessage = "free room"
	}
	else if(room.room_status.status === "not_bookable"){
		statusClass = "room warning";
		statusMessage = "not bookable until " + room.room_status.time;
	}
	else if(room.room_status.status === "reserved"){ 
		statusClass = "room reserved";
		statusMessage = "reserved until " + room.room_status.time;
	}
	else if(room.room_status.status === "full") {
		statusClass = "room full";
		statusMessage = "room booked for today..."
	}
	else if(room.room_status.status === "closed"){
		statusClass = "room locked";
		statusMessage = "room closed..."
	}
	
	return (
		<RoomContext.Provider value={room}>
			{isCalendarOpen && <Calendar handleOpen={handleOpen} />}
				<div className={statusClass} onClick={() => handleOpen()}>
				<div className="labels">
					Room {room.room_num}
				</div>
				<div className="location">
					{room.location}
				</div>
				<div className="reserveName">
					<u>Next Event:</u> {room.room_status.event}
				</div>
				<div class="time">
					{statusMessage}
				</div>
			</div>
		</RoomContext.Provider>
	);
}

const Floor = ({index, floor, building}) => {

	let [rooms, setRooms] = useState([]);

	useEffect(() => {
		let getRooms = async () => {
			const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/rooms/${floor.id}/`);
			const data = await response.json();
			setRooms(data);
		}

		getRooms();
	}, []);

    let free_rooms = rooms.filter(room => {return room.room_status.status === "free"})
    const shadow = `inset 2px 2px 0.5px 0px rgba(0, 0, 0, 0.5), inset 0px 0px 0px 0px rgba(0, 0, 0, 0.3), inset ${100*(free_rooms.length/rooms.length)-100}px 2px 0px 0px rgba(0, 0, 0, 0.5), inset 0px 0px 0px 0px rgba(0, 0, 0, 0.3)`
    return (
    	<div className="divFloor">
			<div className="floorTest" style={{backgroundColor: floor.color}}>
				<h1>{floor.floor_num} Floor</h1>
			</div>
			<div className="roomsContent">
				<div className="roomAvailable">
				  <button className="bookRoom" style={{boxShadow: shadow}} >{free_rooms.length}/{rooms.length}</button>
					<button className="myBook" style={{width: 'fit-content'}}>My reservations</button>
				</div>
				<div className="roomsContainer">
					{rooms.map((room,index) => (
						<Room key={index} room={room} floor={floor.floor_num} building={building} />))}
				</div>
			</div>
		</div>
    );
}
const Building = () => {

	let [floors, setFloors] = useState([]);

	let building = useParams().building;

	useEffect(() => {

		const getFloors = async () => {
			const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/floors/${building}/`);
			const floors = await response.json();

			setFloors(floors);
		}

        getFloors();
    },[building]);

	return(
		<>
		<div className="main">
				<div className="title">Reservations</div>
				<div className="floorContainer">
					{floors.map((floor,index) => (
						<Floor key={index} floor={floor} building={building}/>))}
				</div>
		</div>
		</>
	);
}

export {RoomContext};

export default Building;
