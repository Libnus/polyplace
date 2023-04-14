import React, { Component } from 'react';
import '../../assets/styles/main.css'

class Navbar extends Component{
    constructor(props){
        super(props);
        this.state={
            sidebarData: [
                {
                    title: 'Rooms',
                    path: '/rooms',
                    cName: 'nav-text'
                },
                {
                    title: 'History',
                    path: '/history',
                    cName: 'nav-text'
                },
            ]
        };
    }

    render(){
        return(
            <>
                <div className="sidenav center">
                    {this.state.sidebarData.map(p =>(
                        <div className={"navelement " + (window.location.pathname === p.path ? 'onPageNav' : '')} >
                            <a href={p.path}>{p.title}</a>
                        </div>
                    ))}
                </div>
            </>
        )
    };
}

export default Navbar;
