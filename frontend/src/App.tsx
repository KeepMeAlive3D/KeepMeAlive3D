import "./App.css";
import ModelLoader from "@/scene/ModelLoader.tsx";
import GraphView from "@/scene/graphs/GraphView.tsx";
import { Route, Routes } from "react-router";
import LayoutSidebar from "@/routerLayouts/LayoutSidebar.tsx";
import LayoutVanilla from "@/routerLayouts/LayoutVanilla.tsx";
import Help from "@/scene/Help.tsx";
import { WebSocketProvider } from "@/service/webSocketProvider.tsx";

/**
 * The `App` component serves as the main entry point for the application.
 *
 * It sets up the following:
 * - A `WebSocketProvider` to manage WebSocket connections for real-time updates.
 * - A `Routes` configuration to define the application's routing structure.
 *
 * Routes:
 * - `/`: Displays the `Help` component within a sidebar layout (`LayoutSidebar`).
 * - `/model/:modelId`: Loads a specific model using the `ModelLoader` component.
 * - `/graphs`: Displays the `GraphView` component within a vanilla layout (`LayoutVanilla`).
 *
 * The WebSocket URL is dynamically constructed using the `VITE_APP_BASE_URL` environment variable.
 */
function App() {
  const origin = window.origin.replace("http://", "ws://").replace("https://", "ws://");
  const websocketUrl = (import.meta.env.VITE_APP_BASE_URL ?? origin) + "/ws";

  return (
    <WebSocketProvider url={websocketUrl}>
      <Routes>
        <Route path="/" element={<LayoutSidebar />}>
          <Route path="/" element={<Help />} />
          <Route path="/model/:modelId" element={<ModelLoader />} />
        </Route>
        <Route path="/graphs" element={<LayoutVanilla />}>
          <Route path="/graphs" element={<GraphView></GraphView>} />
        </Route>
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
