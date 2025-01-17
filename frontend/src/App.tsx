import './App.css'
import Edit from "@/scene/Edit.tsx";
import GraphView from "@/graphs/GraphView.tsx";
import {Route, Routes} from "react-router";
import LayoutSidebar from "@/layout/LayoutSidebar.tsx";
import LayoutVanilla from "@/layout/LayoutVanilla.tsx";

function App() {
    return (

        <Routes>
            <Route path="/" element={<LayoutSidebar/>}>
                <Route path="/" element={<Edit></Edit>}/>
            </Route>
            <Route path="/graphs" element={<LayoutVanilla/>}>
                <Route path="/graphs" element={<GraphView></GraphView>}/>
            </Route>

        </Routes>
    )
}

export default App
