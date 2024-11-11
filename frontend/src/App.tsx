import './App.css'
import AppCanvas from "./scene/Scene.tsx";

function App() {
    return (
        <div className={"main-body"}>
            <header className={"top-app-bar"}>
                <h3>KeepMeAlive3D</h3>
            </header>
            <main className={"main-content"}>
                <nav>Nav</nav>
                <AppCanvas></AppCanvas>
            </main>
            <footer className={"bottom-app-bar"}>Footer</footer>
        </div>
    )
}

export default App
