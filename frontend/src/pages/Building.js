import React from 'react';
import { useState, useEffect, useContext, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';

import HoursCalendar from '../components/Buildings/HoursCalendar';

import '../components/Reservations/Building.css';
import '../components/Reservations/Calendar.css';
import Calendar from '../components/Reservations/Calendar'
import UserSession from '../UserSession';

const BuildingContext = React.createContext();
const RoomContext = React.createContext();


const PermissionsTable = ( { setEdit, perm } ) => {
	const [rows, setRows] = useState(null);
	const [modifiedRows, setModifiedRows] = useState(new Set());

	const room = useContext(RoomContext);

	const parseRows = (data) => {
		for (let index in rows) {
			const row = rows[index]
			if (modifiedRows.has(row.id)) {
				console.log('here');
				data[row.role] = ({write: row.write, view: row.view});
			}
		}
		return data;
	};

	useEffect(() => {

		const getRows = () => {
			const initRows = [];

			let count = 0;
			for (let role in perm){
				const newRow = { id: count, role: `${role}`, view: perm[role].view, write: perm[role].write };
				initRows.push({...newRow});
				count++;
			}

			setRows(initRows);
		};

		getRows();

	},[room.room]);

	const handleUpdate = (rowId, field, value) => {
		setRows((prevRows) =>
			prevRows.map((row) =>
				row.id === rowId ? { ...row, [field]: value } : row
			)
		);
		setModifiedRows(new Set([...modifiedRows, rowId]));
	};


	const handleSubmit = async () => {
		// update roles
		const data = parseRows({});
		console.log(data);
		const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/rooms/${room.room.id}/update_roles/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if(response.status !== 200){
			// TODO error checking
			return;
		}
		else {
			// update room state
			const newRoomState = {...room.room};

			newRoomState.permissions = parseRows(newRoomState.permissions);

			console.log(newRoomState);
			room.setRoom(newRoomState);
			setEdit(false);
		}

	};

	const columns = [
		{ field: 'role', headerName: 'Role', width: 150},
		{ field: 'view', headerName: 'View', width: 100, renderCell: (params) => <Checkbox
			checked={params.value}
			onChange={(event) => handleUpdate(params.id, 'view', event.target.checked)}
		/> },
		{ field: 'write', headerName: 'Write', width: 100, renderCell: (params) => <Checkbox
			checked={params.value}
			onChange={(event) => handleUpdate(params.id, 'write', event.target.checked)}
		/>},
	];

	return(
		<>
		<div className="overlay"/>
			<div className="calendar" style={{width: '75%', height: 'auto'}}>
				<h1 style={{color:'white', marginTop: '-1%'}}>Room Permissions</h1>
			{rows !== null && <DataGrid
				style={{color: 'white', border: 'black'}}
				rows={rows}
				columns={columns}
			/>}
				<button class="ready" style={{marginLeft: '85%', width: '15%', marginBottom: '-5%'}} onClick={() => handleSubmit()}>Submit</button>
			</div>
		</>
	);
};

const Room = ({index, room, floor, building}) => {
	const [roomState, setRoom] = useState(room);
	const [roomEdit, setRoomEdit] = useState(false);
	const [isCalendarOpen, setCalendarOpen] = useState(false);

	const [statusClass, setStatusClass] = useState("");
	const [statusMessage, setStatusMessage] = useState("");

	const [roomStyles, setStyles] = useState({});

	const user = useContext(UserSession);
	console.log(roomState);

	const handleOpen = () => {
		if(isCalendarOpen === false) setCalendarOpen(true);
		else setCalendarOpen(false);
	};

	const handleRoomClose = async (event) => {
		event.stopPropagation();
		const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/rooms/${room.id}/close_room/`, {
			method: "PATCH",
		});
		if(response.status !== 200){
			// TODO error checking
			return;
		}
		else{
			const newRoomState = {...roomState};
			newRoomState.closed = !newRoomState.closed;
			setRoom(newRoomState);
		}
	};

	const handleRoomEdit = (event) => {
		event.stopPropagation();
		setRoomEdit(!roomEdit);
	}

	// get css class name for room status
	useEffect(() => {
		let newStatusClass = "";
		let newStatusMessage = "";
		if(roomState.room_status.status === "closed" || roomState.closed){
			newStatusClass = "room locked";
			newStatusMessage = "room closed..."
		}
		else if(roomState.room_status.status === "free"){
			newStatusClass = "room";
			if(roomState.room_status.time.length !== 0) newStatusMessage = "free until " + roomState.room_status.time;
			else newStatusMessage = "free room"
		}
		else if(roomState.room_status.status === "not_bookable"){
			newStatusClass = "room warning";
			newStatusMessage = "not bookable until " + roomState.room_status.time;
		}
		else if(roomState.room_status.status === "reserved"){
			newStatusClass = "room reserved";
			newStatusMessage = "reserved until " + roomState.room_status.time;
		}
		else if(roomState.room_status.status === "full") {
			newStatusClass = "room full";
			newStatusMessage = "room booked for today..."
		}

		setStatusClass(newStatusClass);
		setStatusMessage(newStatusMessage);

		setStyles({
			backgroundColor: !roomState.closed ? 'red' : 'lightgreen',
			width: 'auto',
			paddingLeft: '5%',
			paddingRight: '5%',
			height: '30px',
		});
	},[roomState])

	const roomValue = {
		room,
		setRoom,
	};
	
	return (
		<RoomContext.Provider value={roomValue}>
			{roomEdit && <PermissionsTable setEdit={setRoomEdit} perm={room.permissions}></PermissionsTable>}
			{(isCalendarOpen && !roomState.closed) && <Calendar handleOpen={handleOpen} />}
			<div className={statusClass} onClick={() => handleOpen()}>
				<div className="labels">
					Room {room.room_num}
				</div>
				<div className="location">
					{roomState.location}
				</div>
				<div className="reserveName">
					<u>Next Event:</u> {roomState.room_status.event}
				</div>
				<div class="time">
					{statusMessage}
				</div>
				{roomState.can_edit &&
				<>
					<div style={{padding: '2%', borderRadius: '5px', border: '1.5px solid green', marginRight: '4%', marginTop: '5%'}}>
						<button className="myBook" style={{width: 'auto', paddingLeft: '5%', paddingRight: '5%', marginRight: '5%', height: '30px'}} onClick={(event) => handleRoomEdit(event)}>Edit</button>
						<button className="myBook" style={roomStyles} onClick={(event) => handleRoomClose(event)}>Close</button>
					</div>
				</>
				}
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

	const [building, setBuilding] = useState();
	const [floors, setFloors] = useState([]);
	const [editHours, setEditHours] = useState(false);


	const buildingId = useParams().building;

	const handleEditHours = () => {
		setEditHours(!editHours);
	};

	useEffect(() => {

		const getBuilding = async () => {
			const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/buildings/${buildingId}/`);
			const newBuilding = await response.json();

			// ;)
			// building.hours = [
			// 	[
			// 		building.hours.sunday_start,
			// 		building.hours.sunday_end,
			// 	],
			// 	[
			// 		building.hours.monday_start,
			// 		building.hours.monday_end,
			// 	],
			// 	[
			// 		building.hours.tuesday_start,
			// 		building.hours.tuesday_end,
			// 	],
			// 	[
			// 		building.hours.wednesday_start,
			// 		building.hours.wednesday_end,
			// 	],
			// 	[
			// 		building.hours.thursday_start,
			// 		building.hours.thursday_end,
			// 	],
			// 	[
			// 		building.hours.friday_start,
			// 		building.hours.friday_end,
			// 	],
			// 	[
			// 		building.hours.saturday_start,
			// 		building.hours.saturday_end,
			// 	],
			// ]

			setBuilding(newBuilding);
			console.log(newBuilding);
		};

		const getFloors = async () => {
			const response = await fetch(process.env.REACT_APP_API_URL + `/floors_api/floors/${buildingId}/`);
			const floors = await response.json();

			setFloors([floors]);
		};

		getBuilding();
        getFloors();
    },[]);

	const buildingAddHoursTemplate = (newTemplate) => {
		const newBuilding = {...building};
		let newHoursTemplate = [...newBuilding.hours_templates];
		newHoursTemplate.push(newTemplate);
		newBuilding.hours_templates = newHoursTemplate;

		console.log(newBuilding);
		setBuilding(newBuilding);
	};

	const buildingRemoveHoursTemplate = (removeTemplate) => {
		const newBuilding = {...building};
		let newHoursTemplate = [...newBuilding.hours_templates];
		newBuilding.hours_templates = newHoursTemplate.filter(template => template != removeTemplate);
		console.log(newBuilding);
		setBuilding(newBuilding);
	};

	const buildingContextData ={
		building,
		buildingAddHoursTemplate,
		buildingRemoveHoursTemplate,
	};

	return(
		<BuildingContext.Provider value={buildingContextData}>
		{editHours && <HoursCalendar handleClose={handleEditHours} />}
		<div className="main">
			<div className="title" style={{display:'flex', flexDirection: 'column', justifyContent: 'start'}}>
				Reservations
				<div className="roomAvailable" style={{position: 'relative', height: '35px', width: '20%', marginTop: '0%'}}>
					<button className="myBook" style={{position: 'absolute', width: '30%', height: '65%'}} onClick={() => handleEditHours()}>Edit Hours</button>
					</div>
				</div>
				<div className="floorContainer">
					{floors.map((floor,index) => (
						<Floor key={index} floor={floor} building={building}/>))}
				</div>
		</div>
		</BuildingContext.Provider>
	);
}

export {RoomContext, BuildingContext};

export default Building;
