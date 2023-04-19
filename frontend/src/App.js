import React from 'react';
import Navbar from './components/Main/Navbar';
import Footer from './components/Main/Footer';
import { Routes,BrowserRouter, Route } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import Test from './pages/Test';
import Calendar from './pages/Calendar';
import Buildings from './pages/Buildings';
import './assets/styles/main.css';

function App() {
    return (
        <div className="page-container">
            <div className="header">
                <h1 style={{left: "20%", color: "white"}}>Folsom Thing</h1>
            </div>
            <div className="content-container">
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path='/rooms' element={<Rooms />} />
                        <Route path='/history' element={<History />} />
                        <Route path='/test' element={<Test />} />
                        <Route path='/calendar' element={<Calendar />} />
                        <Route path='/buildings' element={<Buildings buildings={["Amos Eaten","Folsom Library", "Colonie","DCC"]} />} />
                    </Routes>
                </BrowserRouter>
            </div>
            <Footer />
        </div>
    );
}

export default App;
