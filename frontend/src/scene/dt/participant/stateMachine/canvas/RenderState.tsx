import { type StateData, StateType } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import { Group, Rect, Text, Transformer, Circle } from "react-konva";
import { useEffect, useRef } from "react";
import Konva from "konva";
import { findState } from "@/scene/dt/participant/stateMachine/canvas/scUtil.ts";
import { useDispatch } from "react-redux";
import { updateNodePosition } from "@/redux/slices/StateMachineSlice.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import { useTheme } from "@/components/theme-provider.tsx";

export function RenderState({ renderStateId, setInspectState, activeStates, participantId, scId, dtId  }: {
  renderStateId: string,
  setInspectState:  (value: StateData | undefined) => void,
  activeStates: string[],
  participantId: number,
  dtId: number,
  scId: number
}) {
  const { theme } = useTheme();

  const instanceId = `${dtId}-${participantId}-${scId}`;
  const sm = useAppSelector((state) => state.sm.instances[instanceId]);

  const currentState = findState(sm.states, renderStateId);
  const nodeRef = useRef<Konva.Rect>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const dispatch = useDispatch();

  const handleOnClickState = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    setInspectState(currentState);
  };

  useEffect(() => {
    const state = findState(sm.states, renderStateId);
    if (!state)
      return;

    if (nodeRef.current) {
      if (nodeRef.current.width() != state.width
        || nodeRef.current.height() != state.height
        || nodeRef.current.x() != state.posX
        || nodeRef.current.y() != state.posY
        || nodeRef.current.absolutePosition().x != state.absX
        || nodeRef.current.absolutePosition().y != state.absY
      ) {
        dispatch(updateNodePosition({
          id: renderStateId,
          x: nodeRef.current.x(),
          y: nodeRef.current.y(),
          width: nodeRef.current.width(),
          height: nodeRef.current.height(),
          absX: nodeRef.current.absolutePosition().x,
          absY: nodeRef.current.absolutePosition().y
        }));
      }
    } else if (circleRef.current) {
      if (circleRef.current.width() != state.width
        || circleRef.current.height() != state.height
        || circleRef.current.x() != state.posX
        || circleRef.current.y() != state.posY
        || circleRef.current.absolutePosition().x != state.absX
        || circleRef.current.absolutePosition().y != state.absY
      ) {
        dispatch(updateNodePosition({
          id: renderStateId,
          x: circleRef.current.x(),
          y: circleRef.current.y(),
          width: circleRef.current.width(),
          height: circleRef.current.height(),
          absX: circleRef.current.absolutePosition().x,
          absY: circleRef.current.absolutePosition().y
        }));
      }
    }
  }, [sm, dispatch, renderStateId]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const x = Math.round(e.target.x() / 25) * 25;
    const y = Math.round(e.target.y() / 25) * 25;

    e.target.x(x);
    e.target.y(y);

    if (nodeRef.current) {
      nodeRef.current.x(Math.round(nodeRef.current.x() / 25) * 25);
      nodeRef.current.y(Math.round(nodeRef.current.y() / 25) * 25);
      dispatch(updateNodePosition({
        instanceId: instanceId,
        id: renderStateId,
        x: nodeRef.current.x(),
        y: nodeRef.current.y(),
        width: nodeRef.current.width(),
        height: nodeRef.current.height(),
        absX: nodeRef.current.absolutePosition().x,
        absY: nodeRef.current.absolutePosition().y
      }));
    } else if (circleRef.current) {
      circleRef.current.x(Math.round(circleRef.current.x() / 25) * 25);
      circleRef.current.y(Math.round(circleRef.current.y() / 25) * 25);
      dispatch(updateNodePosition({
        instanceId: instanceId,
        id: renderStateId,
        x: circleRef.current.x(),
        y: circleRef.current.y(),
        width: circleRef.current.width(),
        height: circleRef.current.height(),
        absX: circleRef.current.absolutePosition().x,
        absY: circleRef.current.absolutePosition().y
      }));
    }
  };

  const handleResize = () => {
    if (nodeRef.current) {
      dispatch(updateNodePosition({
        instanceId: instanceId,
        id: renderStateId,
        x: nodeRef.current.x(),
        y: nodeRef.current.y(),
        height: Math.round(nodeRef.current.height() * nodeRef.current.scaleY() / 25) * 25,
        width: Math.round(nodeRef.current.width() * nodeRef.current.scaleX() / 25) * 25,
        absX: nodeRef.current.absolutePosition().x,
        absY: nodeRef.current.absolutePosition().y
      }));
      nodeRef.current.scaleX(1);
      nodeRef.current.scaleY(1);
    }
  };

  useEffect(() => {
    if (currentState?.stateType === StateType.SEQUENTIAL)
      trRef.current!.nodes([nodeRef.current!]);
  }, [currentState]);
  
  if (currentState) {
    switch (currentState.stateType) {
      case StateType.ATOMIC:
        return (
          <Circle draggable={true}
                  onDragMove={handleDragMove}
                  onClick={it => handleOnClickState(it)}
                  key={participantId + "-" + currentState.id}
                  x={currentState.posX}
                  y={currentState.posY}
                  radius={30}
                  stroke={(activeStates.includes(renderStateId)) ? "green" : "grey"}
                  fill={theme === 'light' ? '#dddddddd' : '#333333dd'}
                  ref={circleRef}
          />
        );
      case StateType.SEQUENTIAL:
        return (
          <Group draggable={true} onDragMove={handleDragMove}>
            <Rect
              key={participantId + "-" + currentState.id}
              x={currentState.posX}
              y={currentState.posY}
              width={currentState.width}
              height={currentState.height}
              cornerRadius={10}
              stroke={(activeStates.includes(renderStateId)) ? "green" : "grey"}
              fill="#33333355"
              ref={nodeRef}
              onTransform={() => handleResize}
            />
            <Transformer
              ref={trRef}
              flipEnabled={false}
              rotateEnabled={false}
              anchorStyleFunc={(a) => {
                a.cornerRadius(10);
                a.fill("grey");
              }}
              borderStroke={"11111100"}
            />
            <Text
              text={renderStateId}
              x={currentState.posX}
              y={currentState.posY}
              fontFamily="Calibri"
              fill="#ddd"
            />
            {
              currentState.childStates.map((it: StateData) =>
                <RenderState
                  renderStateId={it.id}
                  key={it.id}
                  setInspectState={setInspectState}
                  activeStates={activeStates}
                  participantId={participantId}
                  scId={scId}
                  dtId={dtId}
                />,
              )
            }
          </Group>
        );
      default:
        return null;
    }
  } else {
    return null;
  }
}