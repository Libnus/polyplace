import React from 'react';
import '../assets/styles/main.css';
import Collapsible from '../components/Collapsible';
import Card from '../components/Card'
const History = () => {
    return(
        <div className="main">
            <Collapsible name = "One Week">
                <h1>One Week</h1>
                <p>
                "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </p>
                    <Card title = "Hello" body = "Test 123" image ="https://upload.wikimedia.org/wikipedia/commons/6/6f/Mychtar_and_his_Snowdog.jpg" ></Card> 

                    <Card title = "Hello" body = "Test 123" image ="https://media.tenor.com/Jojpr9QgMLoAAAAd/maxwell-maxwell-spin.gif" ></Card> 
                    
                    <Card title = "Hello" body = "Test 123" image ="https://www.newegg.com/insider/wp-content/uploads/windows_xp_bliss-wide.jpg" ></Card> 
                         </Collapsible>   
            <hr className = "divider"/>
            <Collapsible name = "One Month">
                <h1>One Month</h1>
                <p>
                "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </p>
            </Collapsible>    
            <hr className = "divider"/>
            <Collapsible name = "One Year">
                <h1>One Year</h1>
                <p>
                "Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </p>
            </Collapsible>    
            <hr className = "divider"/> 


        </div>
    );
};

export default History;
