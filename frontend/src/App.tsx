//import {useState} from 'react'
import './App.css'
import Edit from "@/scene/Edit.tsx";

function App() {
    //const [count, setCount] = useState(0)
    return (
        <div className={"main-body"}>
            <main className={"main-content"}>
                <Edit></Edit>
            </main>
        </div>
    )
}

export default App
