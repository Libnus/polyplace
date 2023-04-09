import React, { useState, useEffect } from 'react';
import '../assets/styles/main.css';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Datetime from 'react-datetime';

const columns: GridColDef[] = [
    { field: 'room_num', headerName: 'Room', width: 160, sortable: false},
    { field: 'first_name', headerName: 'First name', width: 200, sortable: false },
    { field: 'last_name', headerName: 'Last name', width: 200, sortable: false },
    { field: 'time_left', headerName: 'Time Left', headerAlign: 'center', width: 160, align: 'center', center: true,  sortable: false},
    { field: 'start_time', headerName: 'Start Time',width: 160,sortable: false,align: 'center',headerAlign: 'center'},
    { field: 'end_time',headerName: 'End Time',sortable: false,width: 160,align: 'center',headerAlign: 'center'},
]

function msToTime(s) {

  // Pad to 2 or 3 digits, default is 2
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }
  if (s < 0){return "00:00";}

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ':' + pad(mins);
}

const ListFloor = ({ floor }) => {

    let rows
    let [rooms, setRooms] = useState([])

    useEffect(() => {
        getRooms()
    }, [])

    const parseRoomsJson = async(rooms) => {
        for(var i=0; i < rooms.length; i++){
            const response = await fetch(`http://127.0.0.1:8000/reservations_api/${rooms[i]['reservation']}/`)
            const reservations =  await response.json()
            const reservation = reservations[0]

            console.log("Reservations Data:",reservation)

            const endTime = new Date(reservation['end_time'])
            const currentTime = new Date()
            const timeLeft = msToTime((endTime.getTime() - currentTime.getTime()))
            console.log("Time left", timeLeft)

            rooms[i]['start_time'] = new Date(reservation['start_time']).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
            rooms[i]['end_time'] = new Date(reservation['end_time']).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
            rooms[i]['time_left'] = timeLeft
            rooms[i]['first_name'] = reservation["first_name"]
            rooms[i]['last_name'] = reservation["last_name"]

            // clean up the json
            delete rooms[i]['floor']
            delete rooms[i]['reservation']
        }
        // sort the data
        rows = rooms.sort((a,b) => (60*Number(a.time_left.slice(0,2))+Number(a.time_left.slice(4,6))) - ((60*Number(b.time_left.slice(0,2))+Number(b.time_left.slice(4,6)))));

        setRooms(rooms)
    }

    let getRooms = async () => {
        const response = await fetch(`http://127.0.0.1:8000/floors_api/rooms/${floor['id']}/`)
        const data = await response.json()
        console.log("DATA FOOMS:", data)
        parseRoomsJson(data)
    }


    return(
        <div className="divFloor">
            <h1 className="floor">{floor['floor_num']}</h1>
                <div className="table">
                    <Box sx={{
                        backgroundColor: `#d4d4d4`,
                        width: '100%',
                        borderRadius:0,
                        }}>
                        <DataGrid
                            rows={rooms}
                            columns={columns}
                            autoHeight
                            disableColumnMenu
                            hideFooter
                            sx={{
                                boxShadow: 2,
                                border: 0,
                                borderColor: 'primary.light',
                                '& .MuiDataGrid-cell:hover':{ color:'primary.main', },
                            }}
                        />
                    </Box>
                </div>
        </div>
    )
}

export default ListFloor
