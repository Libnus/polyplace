import React, { useState } from "react";
import '../assets/styles/main.css';

const Login = () => {
    let[usernmae,setUsername] = useState({usernmae:''});
    let[password,setPassword] = useState({password:''});
    return (
        <div className="main">
            <form>
                <div style={{fontWeight: 'bold', padding:'1%'}}><form></form></div>
                <label for='username'> Username: </label><br></br>
                <input type="text" id="username" name="username"></input><br></br>
                <label for='password'> Password: </label><br></br>
                <input type="text" id="password" name="password"></input>


            </form>
        
        
        </div>
    );
};

export default Login;