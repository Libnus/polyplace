import React from 'react';
import { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

const Room = (index, room, floor) => {
	const handleClick = () => {
		console.log("cc");
	};

	console.log(room);

	// get css class name for room status
	let statusClass = "";
	let statusMessage = "";
	if(room.room_status.status === "free"){
		statusClass = "room";
		statusMessage = "free until " + room.room_status.time;
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
		<div className={statusClass} onClick={handleClick}>
			<div className="labels">
				Room {room.room_num}
			</div>
			<div className="location">
				Folsom, {floor} Floor
			</div>
			<div className="reserveName">
				<u>Thomas' CS1 Office Hours</u>
			</div>
			<div class="time">
				{statusMessage}
			</div>
		</div>
	);
}

const Floor = (index, floor) => {

	let [rooms, setRooms] = useState([]);

	useEffect(() => {
		getRooms();
	}, []);

	let getRooms = async () => {
        const response = await fetch(`http://127.0.0.1:8000/floors_api/rooms/${floor['id']}/`);
        const data = await response.json();
        setRooms(data);
    }

    return (
    	<div className="divFloor">
			<div className="floorTest">
				<h1>{floor.floor_num} Floor</h1>
			</div>
			<div className="foormsContent">
				<div className="roomAvailable">
					<button className="bookRoom">8/10</button>
					<button className="myBook" style={{width: '15%'}}>My reservations</button>
				</div>
				<div className="roomsContainer">
					{rooms.map((room,index) => (
						<Room key={index} room={room} floor={floor.floor_num} />))}
				</div>
			</div>
		</div>
    );
}

const Building = () => {

	let [floors, setFloors] = useState([]);

	const building = useParams().building;

	useEffect(() => {
        getFloors();
    },[]);

	let getFloors = async () => {
		const response = await fetch(`http://127.0.0.1:8000/floors_api/floors/${building.id}/`);
        const floors = await response.json();

        console.log('DATA:', floors);
        setFloors(floors);
	}

	return(
		<>
		<div className="main">
				<div className="title">Reservations</div>
				<div className="floorContainer">
					{floors.map((floor,index) => (
						<Floor key={index} floor={floor} />))}
				</div>
		</div>
		</>
	);
}

export default Building;