import React, { useState } from "react";
import { Button } from "react-bootstrap"; // ✅ add this import

export default function Home() {

    const [name, setName] = useState();
    const addName=()=>{
        
    }
    return (
        <div>
            <div style={{marginTop: '10px'}}></div><br />
            <input type="text" placeholder="Search..." onChange={(e)=>setName(e.target.value)} value={name} className="searchtext"/>&nbsp;
            <Button variant="dark" className="searchbtn" onClick={addName}>Add</Button>
        </div>
    )
}