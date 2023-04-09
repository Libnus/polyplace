import React from 'react';
import Navbar from './components/Navbar';
import { Routes,BrowserRouter, Route } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import './assets/styles/main.css';

function App() {
    return (
        <>
        <div className="header">
            <h1 style={{left: "20%", color: "white"}}>Folsom Thing</h1>
        </div>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/rooms' element={<Rooms />} />
                <Route path='/history' element={<History />} />
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;
