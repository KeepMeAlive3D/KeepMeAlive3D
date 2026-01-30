import "./App.css";
import ModelLoader from "@/scene/ModelLoader.tsx";
import GraphView from "@/scene/graphs/GraphView.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import LayoutSidebar from "@/routerLayouts/LayoutSidebar.tsx";
import LayoutVanilla from "@/routerLayouts/LayoutVanilla.tsx";
import { WebSocketProvider } from "@/service/webSocketProvider.tsx";
import { DigitalTwinsOverview } from "@/scene/home/DigitalTwinsOverview.tsx";
import { DigitalTwinOverview } from "@/scene/dt/DigitalTwinOverview.tsx";
import { DigitalTwinParticipant } from "@/scene/dt/participant/DigitalTwinParticipant.tsx";
import { StateMachineCanvas } from "@/scene/dt/participant/stateMachine/canvas/StateMachineCanvas.tsx";
import { DigitalTwinsOverviewHeader } from "@/scene/home/DigitalTwinsOverviewHeader.tsx";
import * as React from "react";
import { DigitalTwinOverviewHeader } from "@/scene/dt/DigitalTwinOverviewHeader.tsx";
import { TraceOverview } from "@/scene/dt/eventlogs/trace/TraceOverview.tsx";
import { TracesOverviewHeader } from "@/scene/dt/eventlogs/trace/TracesOverviewHeader.tsx";
import { TraceReplayInspect } from "@/scene/dt/eventlogs/trace/replay/TraceReplayInspect.tsx";
import { TraceReplayInspectHeader } from "@/scene/dt/eventlogs/trace/replay/TraceReplayInspectHeader.tsx";

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

  const router = createBrowserRouter([
    // LayoutSidebar Group
    {
      path: "/",
      element: <LayoutSidebar />,
      children: [
        {
          index: true,
          element: <DigitalTwinsOverview />,
          handle: { header: <DigitalTwinsOverviewHeader /> } as RouteHandle,
        },
        {
          path: "dt/:dtId",
          element: <DigitalTwinOverview />,
          handle: { header: <DigitalTwinOverviewHeader /> } as RouteHandle,
        },
        {
          path: "dt/:dtId/participant/:participantId",
          element: <DigitalTwinParticipant />,
          handle: { header: null } as RouteHandle,
        },
        {
          path: "dt/:dtId/participant/:participantId/state-machine/:scId",
          element: <StateMachineCanvas pDtId={undefined} pParticipantId={undefined} pScId={undefined}
                                       activeStates={[]} />,
          handle: { header: null } as RouteHandle,
        },
        {
          path: "dt/:dtId/participant/:participantId/model/:modelId",
          element: <ModelLoader />,
          handle: { header: null } as RouteHandle,
        },
        {
          path: "dt/:dtId/log/:logId",
          element: <TraceOverview />,
          handle: { header: <TracesOverviewHeader /> } as RouteHandle,
        },
        {
          path: "dt/:dtId/log/:logId/trace/:traceName",
          element: <TraceReplayInspect />,
          handle: { header: <TraceReplayInspectHeader /> } as RouteHandle,
        },
        {
          path: "model/:modelId",
          element: <ModelLoader />,
          handle: { header: null } as RouteHandle,
        },
        {
          path: "state-machine",
          element: <StateMachineCanvas pDtId={undefined} pParticipantId={undefined} pScId={undefined}
                                       activeStates={[]} />,
          handle: { header: null } as RouteHandle,
        },
      ],
    },
    {
      path: "/graphs",
      element: <LayoutVanilla />,
      children: [
        {
          index: true,
          element: <GraphView />,
          handle: { header: null } as RouteHandle,
        },
      ],
    },
  ]);

  return (
    <WebSocketProvider url={websocketUrl}>
      <RouterProvider router={router} />
    </WebSocketProvider>
  );
}

export default App;

export interface RouteHandle {
  header: React.ReactNode;
}
