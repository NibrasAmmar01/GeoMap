import React, { useState } from "react";
import { Button } from "react-bootstrap"; // ✅ add this import
import axios from "axios"; // ✅ import axios
import { useNavigate} from 'react-router-dom';

export default function Home() {

    const [name, setName] = useState();
    const history = useNavigate()
    let message=''
    const addName=()=>{
        axios.post('http://localhost:2000/api/addName',{name:name})
        .then(response=>{
            if(response){
                message=response.data.msg
                alert(message)
                history(`/map/${name}`)
            }
            
        })
        .catch(err=>console.log(err))
    }
    return (
        <div>
            <div style={{marginTop: '10px'}}></div><br />
            <input type="text" placeholder="Search..." onChange={(e)=>setName(e.target.value)} value={name} className="searchtext"/>&nbsp;
            <Button variant="dark" className="searchbtn" disabled={name =="" ? true : false} onClick={addName}>Add</Button>
        </div>
    )
}