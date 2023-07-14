import React from 'react';
import { useState, useEffect } from 'react';
import Navbar from './components/Main/Navbar';
import Footer from './components/Main/Footer';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import Test from './pages/Test';
import Buildings from './pages/Buildings';
import Building from './pages/Building';
import './assets/styles/main.css';
import MobileNavbar from './components/Main/MobileNavbar';
import Sidebar from './components/Main/Sidebar';
function App() {

    let [buildings,setBuildings] = useState([]);

    useEffect(() => {
        getBuildings();
    },[])

    const getBuildings = async () => {
        const response = await fetch('http://127.0.0.1:8000/floors_api/buildings/');
        const data = await response.json();
        setBuildings(data);
    };

        //<div id="outer-container">
        //<Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
    return (
            <div className="inner-container" id ="page-wrap">
                <div className="header">
                    <h1 style={{left: "20%", color: "white"}}>PolyPlace</h1>
                </div>
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
