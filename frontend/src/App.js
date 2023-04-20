import React from 'react';
import Navbar from './components/Main/Navbar';
import Footer from './components/Main/Footer';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import Test from './pages/Test';
import Calendar from './pages/Calendar';
import Buildings from './pages/Buildings';
import Building from './pages/Building';
import './assets/styles/main.css';

function App() {
    const buildings = ["Amos Eaton","Folsom Library", "Colonie","DCC"];



    return (
        <div className="page-container">
            <div className="header">
                <h1 style={{left: "20%", color: "white"}}>Folsom Thing</h1>
            </div>
            <div className="content-container">
                <BrowserRouter>
                    {buildings.map(building => (<Link to={'/buildings/' + building.replace(/\s/g, '')} />))}
                    <Navbar />
                    <Routes>
                        <Route path='/rooms' element={<Rooms />} />
                        <Route path='/history' element={<History />} />
                        <Route path='/test' element={<Test />} />
                        <Route path='/calendar' element={<Calendar />} />
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
