import React, { useEffect, useState} from 'react';
import '../assets/styles/main.css';
import Box from '@mui/material/Box';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import { filledInputClasses } from '@mui/material';

const History = () => {


    const getField = (value) => {
        if(value.length !== 0) return value;
        else return "----";
    }


    const getTime = (value) => {
        if(value.length !== 0)
            return value.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
        else return "----"
    }

    let [data,setData] = useState([]);

    useEffect(() => {
        getData();
    },[]);

    let getData = async ()  =>{
        const response = await fetch('http://127.0.0.1:8000/reservations_api/');
        const data = await response.json();

        for(var i=0; i<data.length; i++){
            data[i]['start_time'] = new Date(data[i]['start_time']);
            data[i]['end_time'] = new Date(data[i]['end_time']);
        }

        setData(data)
        console.log(data[0])
    }


    const columns: GridColDef[] = [
        { field: 'room_num', headerName: 'Room', width: 100, sortable: true},
        { field: 'first_name', headerName: 'First name', width: 100, sortable: true, valueGetter: ({value}) => getField(value)},
        { field: 'last_name', headerName: 'Last name', width: 150, sortable: true, valueGetter: ({value}) => getField(value)},
        { field: 'start_time', headerName: 'Start Time',width: 100,align: 'center',headerAlign: 'center',sortable: true, valueGetter: ({value}) => getTime(value)},
        { field: 'end_time',headerName: 'End Time',width: 100,align: 'center',headerAlign: 'center',sortable: true, valueGetter: ({value}) => getTime(value)},
    ]



    return(
        <div className="main">
            <div className='table'>
                <Box sx={{
                    backgroundColor: '#d4d4d4',
                    width: '100%',

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

                            borderColor: 'primary.main',
                            '& .MuiDataGrid-cell:hover':{ color:'primary.main',},
                        }}
                    />
                </Box>

            </div>

        </div>
    );
};

export default History;
