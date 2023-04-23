import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import Buildings from './pages/Buildings';
import './assets/styles/main.css';

function App() {
    const buildings = ["Amos Eaton","Folsom Library", "Colonie","DCC"];



    return (
        <div className="page-container">
            <div className="header">
                <h1 style={{left: "20%", color: "white"}}>Polyplace</h1>
            </div>
            <div className="content-container">
                <BrowserRouter>
                    {buildings.map(building => (<Link to={'/buildings/' + building.replace(/\s/g, '')} />))}
                    <Navbar />
                    <Routes>
                        <Route path='/rooms' element={<Rooms />} />
                        <Route path='/history' element={<History />} />
                        <Route path='/buildings' element={<Buildings buildings={buildings}/>} />
                        <Route path='/buildings' element={<Buildings buildings={["Amos Eaten","Folsom Library", "Colonie","DCC"]} />} />
                    </Routes>
                </BrowserRouter>
            </div>
            <Footer />
        </div>
    );
}

export default App;
