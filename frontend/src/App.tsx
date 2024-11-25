//import {useState} from 'react'
import './App.css'
import Edit from "@/scene/Edit.tsx";

function App() {
    //const [count, setCount] = useState(0)
    return (
        <div className={"main-body"} style={{display: "flex", flexDirection: "column", maxHeight: "100vh"}}>
            <header className={"top-app-bar"}>
                <h3>KeepMeAlive3D</h3>
            </header>
            <main className={"main-content"}>
                <nav>Nav</nav>
                <Edit></Edit>
            </main>
            <footer className={"bottom-app-bar"}>Footer</footer>
        </div>
    )
}

export default App
