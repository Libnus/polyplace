import React from 'react'
import {useState} from 'react';

const  Collapsible =(props)=> {
    const [open, setOpen] = useState(false)
    const toggle = () => {
        setOpen(!open);
    }

    

  return (
    <div>
        <button onClick={toggle}>{props.name}</button>
        {open && (
            <div className="toggle">{props.children} </div>)}
    </div>
  )
}

export default Collapsible
