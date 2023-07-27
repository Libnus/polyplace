import React from 'react';
import { useState, useEffect, useContext } from 'react';
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


const App = () => {
    const [user, setUser] = useState(null);
    const [buildings,setBuildings] = useState([]);

    const checkRoles = (roles) => {
        for(let i = 0; i < roles.length; i++){
            for(let j = 0; j < user.roles.length; j++){
                if(roles[i] === user.roles[j].role) return true;
            }
        }
        return false;
    }

    useEffect(() => {
        getUserSession();
        getBuildings();
    },[])

    const getUserSession = async () => {
        const response = await fetch('http://127.0.0.1:8000/users/user/');
        const data = await response.json();
        console.log('data', data);
        setUser(data);
    }

    const getBuildings = async () => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/floors_api/buildings/');
        const data = await response.json();
        setBuildings(data);
    };

    const userValue = {
        user,
        checkRoles,
    };

    // do not render until the user session is established
    return (
        <>
            { user !== null ? (

            <div className="page-container">

                <UserSession.Provider value={userValue}>
                    <Sidebar />
                    <Header />
                </UserSession.Provider>

                <div className="content-container">
                    <BrowserRouter>
                        {buildings.map(building => (<Link to={'/buildings/' + building.id} />))}
                        <Routes>
                            {checkRoles(['admin', 'staff']) && <Route path='/rooms' element={<UserSession.Provider value={userValue}><Rooms /></UserSession.Provider>} />}
                            <Route path='/history' element={<UserSession.Provider value={userValue}><History /></UserSession.Provider>} />
                            <Route path='/test' element={<UserSession.Provider value={userValue}><Test /></UserSession.Provider>} />
                            <Route path='/buildings' element={<UserSession.Provider value={userValue}><Buildings buildings={buildings}/></UserSession.Provider>} />
                            <Route path='/buildings/:building' element={<UserSession.Provider value={userValue}><Building/></UserSession.Provider>} />
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
