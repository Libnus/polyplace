import React, { useState, useEffect } from 'react';
import '../assets/styles/main.css';
import './TestAgain.css'

const Test = () => {
	return (
		<div className="main">
			<div className="title">Reservations</div>
			<div className="floorContainer">
				<div className="divFloor">
					<div className="floorTest">
						<h1>3rd Floor</h1>
					</div>
					<div className="roomsContainer">
						<div className="room">
							Hey
						</div>
						<div className="room closed">
							Hey
						</div>
						<div className="room warning">
							Hey
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
						<div className="room">
							Hey
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
						<div className="room">
							Hey
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Test;
