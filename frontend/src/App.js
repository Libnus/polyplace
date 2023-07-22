import React from 'react';
import { useState, useEffect } from 'react';
import Footer from './components/Main/Footer';
import { Routes, BrowserRouter, Route, Link } from 'react-router-dom';
import Rooms from './pages/Rooms';
import History from './pages/History';
import Test from './pages/Test';
import Buildings from './pages/Buildings';
import Building from './pages/Building';
import UserSession from './UserSession';
import './assets/styles/main.css';
import Sidebar from './components/Main/Sidebar';
import Header from './components/Main/Header';


function App() {
    const [user, setUser] = useState(null);
    const [buildings,setBuildings] = useState([]);

    useEffect(() => {
        getUserSession();
        getBuildings();
    },[])

    const getUserSession = async () => {
        const response = await fetch('http://127.0.0.1:8000/users/user/');
        const data = await response.json();
        setUser(data);
    }

    const getBuildings = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/floors_api/buildings/');
        const data = await response.json();
        setBuildings(data);
    };

    // do not render until the user session is established
    return (
        <>
            { user !== null ? (

            <div className="page-container">

                <Sidebar />
                <Header />

                <div className="content-container">
                    <BrowserRouter>
                        {buildings.map(building => (<Link to={'/buildings/' + building.id} />))}
                        <Routes>
                            <Route path='/rooms' element={<UserSession.Provider value={user}><Rooms /></UserSession.Provider>} />
                            <Route path='/history' element={<UserSession.Provider value={user}><History /></UserSession.Provider>} />
                            <Route path='/test' element={<UserSession.Provider value={user}><Test /></UserSession.Provider>} />
                            <Route path='/buildings' element={<UserSession.Provider value={user}><Buildings buildings={buildings}/></UserSession.Provider>} />
                            <Route path='/buildings/:building' element={<UserSession.Provider value={user}><Building/></UserSession.Provider>} />
                        </Routes>
                    </BrowserRouter>
                </div>
                <Footer />
            </div>
            ) : (<></>)}
        </>
    );
}

export default App;
