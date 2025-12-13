import "./App.css";
import ModelLoader from "@/scene/ModelLoader.tsx";
import GraphView from "@/scene/graphs/GraphView.tsx";
import { Route, Routes } from "react-router";
import LayoutSidebar from "@/routerLayouts/LayoutSidebar.tsx";
import LayoutVanilla from "@/routerLayouts/LayoutVanilla.tsx";
import { WebSocketProvider } from "@/service/webSocketProvider.tsx";
import { StateMachineDisplay } from "@/scene/dt/participant/stateMachine/StateMachineDisplay.tsx";
import { DigitalTwinsOverview } from "@/scene/home/DigitalTwinsOverview.tsx";
import { DigitalTwinOverview } from "@/scene/dt/DigitalTwinOverview.tsx";
import { DigitalTwinParticipant } from "@/scene/dt/participant/DigitalTwinParticipant.tsx";
import {StateMachineCanvas} from "@/scene/dt/participant/stateMachine/canvas/StateMachineCanvas.tsx";

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
  const origin = window.origin.replace("http://", "ws://").replace("https://", "wss://");  //use ws protocol instead of http
  const websocketUrl = (import.meta.env.VITE_APP_BASE_URL ?? origin) + "/ws";              //for dev use the url devined in the .env file, in production use the origin as the url

  return (
    <WebSocketProvider url={websocketUrl}>
      <Routes>
        <Route path="/" element={<LayoutSidebar />}>
          <Route path="/" element={<DigitalTwinsOverview />} />
          <Route path="/dt/:dtId" element={<DigitalTwinOverview />} />
          <Route path="/dt/:dtId/participant/:participantId" element={<DigitalTwinParticipant />} />
          <Route path="/dt/:dtId/participant/:participantId/state-machine/:statemachineName" element={<StateMachineDisplay />} />
          <Route path="/dt/:dtId/participant/:participantId/model/:modelId" element={<ModelLoader />} />
          <Route path="/model/:modelId" element={<ModelLoader />} />
        </Route>
        <Route path="/graphs" element={<LayoutVanilla />}>
          <Route path="/graphs" element={<GraphView></GraphView>} />
        </Route>
        <Route path="/state-machine" element={<LayoutSidebar />}>
          <Route path="/state-machine" element={<StateMachineCanvas />} />
        </Route>
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
