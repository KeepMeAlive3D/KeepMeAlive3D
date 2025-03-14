import "./App.css";
import Edit from "@/scene/Edit.tsx";
import GraphView from "@/graphs/GraphView.tsx";
import { Route, Routes } from "react-router";
import LayoutSidebar from "@/layout/LayoutSidebar.tsx";
import LayoutVanilla from "@/layout/LayoutVanilla.tsx";
import Help from "@/scene/Help.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutSidebar />}>
        <Route path="/" element={<Help />} />
        <Route path="/model/:modelId" element={<Edit />} />
      </Route>
      <Route path="/graphs" element={<LayoutVanilla />}>
        <Route path="/graphs" element={<GraphView></GraphView>} />
      </Route>
    </Routes>
  );
}

export default App;
