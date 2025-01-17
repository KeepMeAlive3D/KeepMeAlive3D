import './App.css'
import Edit from "@/scene/Edit.tsx";
import GraphView from "@/graphs/GraphView.tsx";
import {Route, Routes} from "react-router";

function App({model}: { model: string | null }) {
    return (
        <div className={"main-body"}>
            <main className={"main-content"}>
                <Routes>
                    <Route path="/" element={<Edit modelUri={model}></Edit>}/>
                    <Route path="/graphs" element={<GraphView></GraphView>}/>
                </Routes>
            </main>
        </div>
    )
}

export default App
