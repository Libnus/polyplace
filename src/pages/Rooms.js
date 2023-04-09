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
  {id: 1, room: '353A', firstName: 'Linus', lastName: 'Zwaka', timeLeft: '00:60', startTime: '12:00', endTime: '1:00'},
  {id: 2, room: '353B', firstName: 'Brian', lastName: 'Henry', timeLeft: '00:59', startTime: '11:00', endTime: '1:30'},
  {id: 3, room: '431',  firstName: 'Louis', lastName: 'Parrinello', timeLeft: '00:00', startTime: '11:00', endTime: '1:30'},
  {id: 4, room: '451',  firstName: 'Louis', lastName: 'Parrinello', timeLeft: '00:05', startTime: '11:00', endTime: '1:30'},
];
const sortedRows = rows.sort((a,b) => (60*Number(a.timeLeft.slice(0,2))+Number(a.timeLeft.slice(-2))) - ((60*Number(b.timeLeft.slice(0,2))+Number(b.timeLeft.slice(-2)))));

// const stylizedDataGrid = styled(DataGrid)(({theme}) => ({
//     '& .'
// })

const Rooms = () => {
    return(
        <div className="main">
            <div id="3floor" className="divFloor">
              <h1 className="floor" style={{background: 'orange'}}>3rd Floor</h1>
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
                                '.time_plenty':{background:"#7cc662", '&:hover':{background:"#8adb6e"},},
                                '.time_fine':{background:"#FFd300", '&:hover':{background:"#ffda60"},},
                                '.time_near':{background:"#ea3333", '&:hover':{background:"#f14d4d"},},
                                '.time_up':{background:"grey", '&:hover':{background:"darkgrey"},},
                            }}
                            getRowClassName={(params) => {
                               return  (60*Number(params.row.timeLeft.slice(0,2))+Number(params.row.timeLeft.slice(-2))) <= 0 ?  "time_up"     :
                                       (60*Number(params.row.timeLeft.slice(0,2))+Number(params.row.timeLeft.slice(-2))) <= 15 ?  "time_near"   :
                                       (60*Number(params.row.timeLeft.slice(0,2))+Number(params.row.timeLeft.slice(-2))) < 60 ?  "time_fine"   :
                                       (60*Number(params.row.timeLeft.slice(0,2))+Number(params.row.timeLeft.slice(-2))) >= 60 ? "time_plenty" : "";

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
