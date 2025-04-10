import "./App.css";
import Edit from "@/scene/Edit.tsx";
import GraphView from "@/graphs/GraphView.tsx";
import { Route, Routes } from "react-router";
import LayoutSidebar from "@/layout/LayoutSidebar.tsx";
import LayoutVanilla from "@/layout/LayoutVanilla.tsx";
import Help from "@/scene/Help.tsx";
import { WebSocketProvider } from "@/service/webSocketProvider.tsx";

function App() {
  const websocketUrl = import.meta.env.VITE_APP_BASE_URL + "/ws";

  return (
    <WebSocketProvider url={websocketUrl}>
    <Routes>
      <Route path="/" element={<LayoutSidebar />}>
        <Route path="/" element={<Help />} />
        <Route path="/model/:modelId" element={<Edit />} />
      </Route>
      <Route path="/graphs" element={<LayoutVanilla />}>
        <Route path="/graphs" element={<GraphView></GraphView>} />
      </Route>
    </Routes>
    </WebSocketProvider>
  );
}

export default App;
