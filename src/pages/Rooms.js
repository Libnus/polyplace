import React from 'react';
import '../components/Navbar.css';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const columns: GridColDef[] = [
  { field: 'room', headerName: 'Room', width: 160, sortable: false},
  { field: 'firstName', headerName: 'First name', width: 200, sortable: false },
  { field: 'lastName', headerName: 'Last name', width: 200, sortable: false },
  {
    field: 'timeLeft', headerName: 'Time Left', headerAlign: 'center', width: 160, align: 'center', center: true,  sortable: false
  },
  {
    field: 'startTime',
    headerName: 'Start Time',
    width: 160,
    sortable: false,
    align: 'center',
    headerAlign: 'center'
  },
  {
    field: 'endTime',
    headerName: 'End Time',
    sortable: false,
    width: 160,
    align: 'center',
    headerAlign: 'center'
  },
];

const rows = [
  {id: 1, room: '353A', firstName: 'Linus', lastName: 'Zwaka', timeLeft: '01:00', startTime: '12:00', endTime: '1:00'},
  {id: 2, room: '353B', firstName: 'Brian', lastName: 'Henry', timeLeft: '00:59', startTime: '11:00', endTime: '1:30'},
];
const sortedRows = rows.sort((a,b) => (60*Number(a.timeLeft.slice(0,2))+Number(a.timeLeft.slice(4,6))) - ((60*Number(b.timeLeft.slice(0,2))+Number(b.timeLeft.slice(4,6)))));

const Rooms = () => {
    return(
        <div className="main">
            <div id="3floor" className="divFloor">
                <h1 className="floor">3rd Floor</h1>
                <div className="table">
                  <Box sx={{
                    backgroundColor: `#d4d4d4`,
                    width: '100%',
                    borderRadius:0,
                  }}>
                        <DataGrid
                            rows={rows}
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
            <div id="4floor" className="divFloor">
                <h1 className="floor" style={{background: "blue"}}>4th Floor</h1>
                <div className="table">
                  <Box sx={{
                    backgroundColor: `#d4d4d4`,
                    width: '100%',
                    borderRadius:0,
                  }}>
                        <DataGrid
                            rows={rows}
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
        </div>
    );
};

export default Rooms;
