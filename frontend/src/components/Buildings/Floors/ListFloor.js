import React, { useState, useEffect } from 'react';
import '../../../assets/styles/main.css';

import { DataGrid, GridColDef, GridRenderCellParams, GridEventListener } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { darken, lighten, styled} from '@mui/material/styles'

import Datetime from 'react-datetime';

const getTime = (value) => {
    if(value.length !== 0)
        return value.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
    else return "----"
}

const getField = (value) => {
    if(value.length !== 0) return value;
    else return "----";
}

const columns: GridColDef[] = [
    { field: 'room_num', headerName: 'Room', width: 160, sortable: false},
    { field: 'first_name', headerName: 'First name', width: 200, sortable: false, valueGetter: ({value}) => getField(value)},
    { field: 'last_name', headerName: 'Last name', width: 200, sortable: false, valueGetter: ({value}) => getField(value)},
    { field: 'time_left', headerName: 'Time Left', headerAlign: 'center', width: 160, align: 'center', center: true, sortable: false, valueGetter: ({value}) => getField(value)},
    { field: 'start_time', headerName: 'Start Time',width: 160,align: 'center',headerAlign: 'center',sortable: false, valueGetter: ({value}) => getTime(value)},
    { field: 'end_time',headerName: 'End Time',width: 160,align: 'center',headerAlign: 'center',sortable: false, valueGetter: ({value}) => getTime(value)},
]

const getBackgroundColor = (color, mode) =>
      mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color, mode) =>
      mode === 'dark' ? darken(color,0.6) : lighten(color, 0.6)

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .room-reserve-theme--TimeUp':{
        backgroundColor: lighten(theme.palette.error.main,0.5),
        '&:hover':{
            backgroundColor: lighten(theme.palette.error.main,0.4),
        },
        '&.Mui-selected':{
            backgroundColor: lighten(theme.palette.error.main,0.3),
            '&:hover':{
                backgroundColor: lighten(theme.palette.error.main,0.2),
            }
        },
    },
    '& .room-reserve-theme--Warning':{
        backgroundColor: lighten(theme.palette.warning.main,0.5),
        '&:hover':{
            backgroundColor: lighten(theme.palette.warning.main,0.4),
        },
        '&.Mui-selected':{
            backgroundColor: lighten(theme.palette.warning.main,0.3),
            '&:hover':{
                backgroundColor: lighten(theme.palette.warning.main,0.2),
            }
        },
    },
    '& .room-reserve-theme--TimeGood':{
        backgroundColor: lighten(theme.palette.success.main,0.5),
        '&:hover':{
            backgroundColor: lighten(theme.palette.success.main,0.4),
        },
        '&.Mui-selected':{
            backgroundColor: lighten(theme.palette.success.main,0.3),
            '&:hover':{
                backgroundColor: lighten(theme.palette.success.main,0.2),
            }
        },
    },
    '& .room-reserve-theme--Empty':{
    },
}));

// return the status code of time left on a room
const getStatus = (time) => {
    if(time.slice(0,2) === "") return "Empty"
    if(time.slice(0,2) !== "00") return "TimeGood"
    if(time.slice(-2) === "00") return "TimeUp"
    if(time.slice(-2) <= "15") return "Warning"
    else return "Empty"
}

// =============================================== Mui styling ^^^^^

const getStartTime = (params) => {
    return params.row.start_time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
}

const getEndTime = (params) => {
    return params.row.end_time.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
}

const msToTime = (s) => {

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

const ListFloor = ({ floor, getRoomSelected }) => {

    let rows
    let [rooms, setRooms] = useState([])

    useEffect(() => {
        getRooms()
    }, [])

    const parseRoomsJson = async(rooms) => {
        for(var i=0; i < rooms.length; i++){

            // fetch the reservation if room has reservation
            if(rooms[i]['reservation'] != null){
                const response = await fetch(`http://127.0.0.1:8000/reservations_api/${rooms[i]['reservation']}/`)
                const reservations =  await response.json();
                const reservation = reservations[0];

                // calculate time left
                const endTime = new Date(reservation['end_time']);
                const currentTime = new Date();
                const timeLeft = msToTime((endTime.getTime() - currentTime.getTime()));

                // update fields for room json
                rooms[i]['start_time'] = new Date(reservation['start_time']);
                rooms[i]['end_time'] = new Date(reservation['end_time']);
                rooms[i]['time_left'] = timeLeft;
                rooms[i]['first_name'] = reservation["first_name"];
                rooms[i]['last_name'] = reservation["last_name"];
                rooms[i]['rin'] = reservation["rin"];
                rooms[i]['email'] = reservation["email"];

            }
            else{ // room is empty
                rooms[i]['start_time'] = '';
                rooms[i]['end_time'] = '';
                rooms[i]['time_left'] = '';
                rooms[i]['first_name'] = '';
                rooms[i]['last_name'] = '';
                rooms[i]['rin'] = '';
                rooms[i]['email'] = '';
            }

            // clean up the json
            delete rooms[i]['floor'];
            delete rooms[i]['reservation'];
        }

        // sort the data
        rows = rooms.sort((a,b) => (60*Number(a.time_left.slice(0,2))+Number(a.time_left.slice(4,6))) - ((60*Number(b.time_left.slice(0,2))+Number(b.time_left.slice(4,6)))));

        setRooms(rooms)
    }

    let getRooms = async () => {
        const response = await fetch(`http://127.0.0.1:8000/floors_api/rooms/${floor['id']}/`)
        const data = await response.json()
        parseRoomsJson(data)
    }

    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
        console.log("rooms returned",params.row);
        getRoomSelected(params.row);
    };

    return(
        <>
        <div className='divFloor'>
            <h1 className='floor' style={{background: floor['color']}}>{floor['floor_num']} Floor</h1>
                <div className='table'>
                    <Box sx={{
                        backgroundColor: `#d4d4d4`,
                        width: '100%',
                        borderRadius:0,
                        }}>
                        <StyledDataGrid
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
                            getRowClassName={(params) => 'room-reserve-theme--' + getStatus(params.row.time_left)}
                            onRowClick={handleRowClick}
                        />
                    </Box>
                </div>
        </div>
        </>
    )
}

export default ListFloor
