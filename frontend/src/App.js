import React from 'react';
import { useState, useEffect } from 'react';
import Footer from './components/Main/Footer';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import Test from './pages/Test';
import Buildings from './pages/Buildings';
import Building from './pages/Building';
import './assets/styles/main.css';
import Sidebar from './components/Main/Sidebar';
import Header from './components/Main/Header';
function App() {

    let [buildings,setBuildings] = useState([]);

    useEffect(() => {
        getBuildings();
    },[])

    const getBuildings = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/floors_api/buildings/');
        const data = await response.json();
        setBuildings(data);
    };

    return (
        <div className="page-container">
 

            <Sidebar/>
            <Header/>
    
         
                <div className="content-container">
                    <BrowserRouter>
                        {buildings.map(building => (<Link to={'/buildings/' + building.id} />))}
                
                        <Routes>
                            <Route path='/rooms' element={<Rooms />} />
                            <Route path='/history' element={<History />} />
                            <Route path='/test' element={<Test />} />
                            <Route path='/buildings' element={<Buildings buildings={buildings}/>} />
                            <Route path='/buildings/:building' element={<Building/>} />
                        </Routes>
                    </BrowserRouter>
                </div>
                <Footer />
        </div>
    );
}

export default App;