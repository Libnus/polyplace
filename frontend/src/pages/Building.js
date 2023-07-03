import React from 'react';
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import '../components/Reservations/Building.css';
import Calendar from '../components/Reservations/Calendar'

const Room = ({index, room, floor, building}) => {
	let [isCalendarOpen, setCalendarOpen] = useState(false);

	const handleClick = () => {
		setCalendarOpen(true);
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
		<>
		{isCalendarOpen && <Calendar room={room} />}
		<div className={statusClass} onClick={handleClick}>
			<div className="labels">
				Room {room.room_num}
			</div>
			<div className="location">
				Amos Eaton, {floor} Floor
			</div>
			<div className="reserveName">
				<u>{room.room_status.event}</u>
			</div>
			<div class="time">
				{statusMessage}
			</div>
		</div>
		</>
	);
}

const Floor = ({index, floor, building}) => {

	let [rooms, setRooms] = useState([]);

	useEffect(() => {
		let getRooms = async () => {
			const response = await fetch(`http://127.0.0.1:8000/floors_api/rooms/${floor.id}/`);
			const data = await response.json();
			setRooms(data);
		}

		getRooms();
	}, []);

<<<<<<< HEAD

	let free = 8/10;

=======
    let free_rooms = rooms.filter(room => {return room.room_status.status === "free"})
    const shadow = `inset 2px 2px 0.5px 0px rgba(0, 0, 0, 0.5), inset 0px 0px 0px 0px rgba(0, 0, 0, 0.3), inset ${100*(free_rooms.length/rooms.length)-100}px 2px 0px 0px rgba(0, 0, 0, 0.5), inset 0px 0px 0px 0px rgba(0, 0, 0, 0.3)`
>>>>>>> 6bc352fcd560e5bbf4dc4c91ade51008fe83ace8
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

	console.log("building", building);

	useEffect(() => {

		const getFloors = async () => {
			const response = await fetch(`http://127.0.0.1:8000/floors_api/floors/${building}/`);
			const floors = await response.json();

			console.log('DATA:', floors);
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

export default Building;
