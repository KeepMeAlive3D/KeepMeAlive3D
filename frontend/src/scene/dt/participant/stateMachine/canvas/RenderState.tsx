import { type StateData, type StateMachine, StateType } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import { Group, Rect, Text, Transformer, Circle } from "react-konva";
import * as React from "react";
import { type SetStateAction, useEffect, useRef } from "react";
import Konva from "konva";
import { findState } from "@/scene/dt/participant/stateMachine/canvas/scUtil.ts";

export function RenderState({ data, setData, renderStateId }: {
  data: StateMachine,
  setData: React.Dispatch<SetStateAction<StateMachine>>,
  renderStateId: string
}) {
  const currentState = findState(data.states, renderStateId);
  const nodeRef = useRef<Konva.Rect>(null);
  const circleRef = useRef<Konva.Circle>(null);
  const trRef = useRef<Konva.Transformer>(null);

  //this is scary, but we really check in the useEffect to call this function
  //only if it's really necessary, as this function will trigger the useEffect
  //again
  function updateState(
    height: number | undefined,
    width: number | undefined,
    posX: number | undefined,
    posY: number | undefined,
  ) {
    const newStateMachine: StateMachine = { ...data };
    const state = findState(newStateMachine.states, renderStateId);
    if (state) {
      console.debug(`update data: `, width, height, posX, posY);
      state.width = width ?? state.width;
      state.height = height ?? state.height;
      state.posX = posX ?? state.posX;
      state.posY = posY ?? state.posY;
      console.debug(`update state data for`, state.id, state.posX, state.posY);
      setData(newStateMachine);
    }
  }

  useEffect(() => {
    const state = findState(data.states, renderStateId);
    if (!state)
      return;

    if (nodeRef.current) {
      if (nodeRef.current.width() != state.width
        || nodeRef.current.height() != state.height
        || nodeRef.current.x() != state.posX
        || nodeRef.current.y() != state.posY
      ) {
        updateState(nodeRef.current.width(), nodeRef.current.height(), nodeRef.current.x(), nodeRef.current.y());
      }
    } else if (circleRef.current) {
      if (circleRef.current.width() != state.width
        || circleRef.current.height() != state.height
        || circleRef.current.x() != state.posX
        || circleRef.current.y() != state.posY
      ) {
        updateState(circleRef.current.width(), circleRef.current.height(), circleRef.current.x(), circleRef.current.y());
      }
    }
  }, [data, renderStateId, updateState]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const x = Math.round(e.target.x() / 25) * 25;
    const y = Math.round(e.target.y() / 25) * 25;

    e.target.x(x);
    e.target.y(y);

    nodeRef.current?.x(Math.round(nodeRef.current.x() / 25) * 25);
    nodeRef.current?.y(Math.round(nodeRef.current.y() / 25) * 25);

    if (nodeRef)
      updateState(undefined, undefined, nodeRef.current?.x(), nodeRef.current?.y());
    else
      updateState(undefined, undefined, x, y);
  };

  const handleResize = () => {
    const node = nodeRef.current;
    updateState(
      Math.round(node!.height() * node!.scaleY() / 25) * 25,
      Math.round(node!.width() * node!.scaleX() / 25) * 25,
      undefined,
      undefined,
    );
    node!.scaleX(1);
    node!.scaleY(1);
  };

  useEffect(() => {
    if (currentState?.stateType != StateType.ATOMIC)
      trRef.current!.nodes([nodeRef.current!]);
  }, [currentState]);

  if (currentState) {
    switch (currentState.stateType) {
      case StateType.ATOMIC:
        return (
          <Circle draggable={true}
                  onDragMove={handleDragMove}
                  key={currentState.id}
                  x={currentState.posX}
                  y={currentState.posY}
                  radius={30}
                  stroke="green"
                  fill="#333333dd"
                  ref={circleRef}
          />
        );
      case StateType.SEQUENTIAL:
        return (
          <Group draggable={true} onDragMove={handleDragMove}>
            <Rect
              key={currentState.id}
              x={currentState.posX}
              y={currentState.posY}
              width={currentState.width}
              height={currentState.height}
              cornerRadius={10}
              stroke="green"
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
                a.fill("red");
              }}
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
                <RenderState data={data} setData={setData} renderStateId={it.id} key={it.id} />,
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