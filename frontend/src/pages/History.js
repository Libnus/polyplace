import React, { useEffect, useState} from 'react';
import '../assets/styles/main.css';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import { filledInputClasses } from '@mui/material';

const History = () => {
    let [data,setData] = useState([]);
    let [rooms,setRooms] = useState([]);

    const getField = (value) => {
        if(value.length !== 0) return value;
        else return "----";
    }

    const getRoom = (room) => {
        for(var i=0; i<rooms.length; i++){
            if(rooms[i]["id"]===room){
                return rooms[i]["room_num"];
            }
        }
        return "-------"

    }

    const getTime = (value) => {
        if(value.length !== 0)
            return value.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
        else return "----"
    }

    const getBuilding = (id) => {
        for(var i=0; i<data.length; i++){
            if(data[i]["id"]===id){
                return data[i]["building_name"];
            }
        }
        return "-------"

    }

    useEffect(() => {
        let getData = async ()  =>{


            const rooms_api = await fetch(process.env.REACT_APP_API_URL + '/floors_api/rooms/');
            const rooms = await rooms_api.json();
            setRooms(rooms)


            const response = await fetch(process.env.REACT_APP_API_URL + '/reservations_api/');
            const data = await response.json();

            for(var i=0; i<data.length; i++){
                data[i]['start_time'] = new Date(data[i]['start_time']);
                data[i]['end_time'] = new Date(data[i]['end_time']);

                data[i]['building_name'] = await fetch(process.env.REACT_APP_API_URL + '/floors_api/rooms/'+ data[i]["id"] +'/get_building/')
                data[i]['building_name'] = await data[i]['building_name'].json()
                data[i]['building_name'] = data[i]['building_name']['building_name']
            }

            setData(data)
            console.log(data)
        }

        getData();
    },[]);



    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Building', width: 120, sortable: true, valueGetter: ({value}) => getBuilding(value)},
        { field: 'room', headerName: 'Room', width: 70, sortable: true, valueGetter: ({value}) => getRoom(value)},
        { field: 'first_name', headerName: 'First name', maxWidth: 200, sortable: true, valueGetter: ({value}) => getField(value)},
        { field: 'last_name', headerName: 'Last name', maxWidth: 300, sortable: true, valueGetter: ({value}) => getField(value)},
        { field: 'start_time', headerName: 'Start Time', maxWidth: 100, align: 'center',headerAlign: 'center',sortable: true, valueGetter: ({value}) => getTime(value)},
        { field: 'end_time',headerName: 'End Time', maxWidth: 100, align: 'center',headerAlign: 'center',sortable: true, valueGetter: ({value}) => getTime(value)},
    ]



    return(
        <div className="main">
            <h1 className='floor' style={{background: 'tomato'}}>History</h1>
            <div className='table'>
                <Box sx={{
                    backgroundColor: '#d4d4d4',
                    width: '100%',
                    borderRadius:0,

                    }}>
                    <DataGrid
                        rows = {data}
                        columns = {columns}
                        autoHeight
                        disableColumnMenu
                        hideFooter
                        sx={{
                            boxShadow: 2,
                            border: 0,
                            borderColor: 'primary.light',

                            '& .MuiDataGrid-cell:hover':{ color:'primary.main',},
                        }}
                    />
                </Box>

            </div>

        </div>
    );
};

export default History;
