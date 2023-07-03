import React from 'react';
import '../assets/styles/main.css';
import './Test.css'

// THIS FILE ALONG WITH TEST.CSS CAN BE REMOVED. THIS FILE IS FOR THE FOLSOM LIBRARY DEMO

const Test = () => {

	const handleClick = () => {
		console.log("cc");
	}

	return (
		<>
		<div className="main">
			<div className="title">Reservations</div>
			<div className="floorContainer">
				<div className="divFloor">
					<div className="floorTest">
						<h1>3rd Floor</h1>
					</div>
					<div className="roomsContent">
						<div className="roomAvailable">
							<button className="bookRoom">8/10</button>
							<button className="myBook" style={{width: '15%'}}>My reservations</button>
						</div>
						<div className="roomsContainer">
							<div className="room" onClick={handleClick}>
								<div className="labels">
									Room 353-A
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Thomas' CS1 Office Hours</u>
								</div>
								<div class="time">
									free until 2:00 P.M.
								</div>
							</div>
							<div className="room closed">
								<div className="labels">
									Room 353-B
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Study Room Reservation</u>
								</div>
								<div class="time">
									reserved until 3:30 P.M.
								</div>
							</div>
							<div className="room warning">
								<div className="labels">
									Room 358
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Prof. Turner CS Department Meeting</u>
								</div>
								<div class="time">
									not bookable until 1:00 P.M.
								</div>
							</div>
							<div className="room full">
								<div className="labels">
									Room 338
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Study Room Reservation</u>
								</div>
								<div class="time">
									room booked for today...
								</div>
							</div>
							<div className="room locked">
								<div className="labels">
									Room 331
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Closed</u>
								</div>
								<div class="time">
									room closed...
								</div>
							</div>
							<div className="room">
								Hey
							</div>
							<div className="room">
								Hey
							</div>
							<div className="room">
								Hey
							</div>
						</div>
					</div>
				</div>
				<div className="divFloor">
					<div className="floorTest" style={{backgroundColor: 'rgb(26, 101, 158)'}}>
						<h1>4th Floor</h1>
					</div>
					<div className="roomsContent">
						<div className="roomAvailable">
							<button className="bookRoom">8/10</button>
							<button className="myBook" style={{width: '15%'}}>My reservations</button>
						</div>
						<div className="roomsContainer">
							<div className="room">
								<div className="labels">
									Room 353-A
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Thomas' CS1 Office Hours</u>
								</div>
								<div class="time">
									free until 2:00 P.M.
								</div>
							</div>
							<div className="room closed">
								<div className="labels">
									Room 353-B
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Study Room Reservation</u>
								</div>
								<div class="time">
									reserved until 3:30 P.M.
								</div>
							</div>
							<div className="room warning">
								<div className="labels">
									Room 358
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Prof. Turner CS Department Meeting</u>
								</div>
								<div class="time">
									not bookable until 1:00 P.M.
								</div>
							</div>
							<div className="room full">
								<div className="labels">
									Room 338
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Study Room Reservation</u>
								</div>
								<div class="time">
									room booked for today...
								</div>
							</div>
							<div className="room locked">
								<div className="labels">
									Room 331
								</div>
								<div className="location">
									Folsom, 3rd Floor
								</div>
								<div className="reserveName">
									<u>Closed</u>
								</div>
								<div class="time">
									room closed...
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	);
}

export default Test;
