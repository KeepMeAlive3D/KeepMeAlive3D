import {type StateData, type StateMachine, StateType} from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import {Group, Rect, Text, Transformer} from "react-konva";
import * as React from "react";
import {type SetStateAction, useEffect, useRef} from "react";
import Konva from "konva";

export function RenderState({data, setData, renderStateId}: {
    data: StateMachine,
    setData: React.Dispatch<SetStateAction<StateMachine>>,
    renderStateId: string
}) {
    const currentState = findState(data.states, renderStateId)
    const nodeRef = useRef<Konva.Rect>(null);
    const trRef = useRef<Konva.Transformer>(null);

    function updateState(height: number, width: number) {
        const newStateMachine: StateMachine = {...data}
        const state = findState(newStateMachine.states, renderStateId)
        if(state) {
            state.width = width
            state.height = height
            setData(newStateMachine)
        }
    }

    useEffect(() => {
        trRef.current!.nodes([nodeRef.current!]);
    }, []);

    if (currentState) {
        return (
            <Group draggable={true}>
                <Rect
                    key={currentState.id}
                    x={currentState.posX}
                    y={currentState.posY}
                    width={currentState.width}
                    height={currentState.height}
                    cornerRadius={10}
                    stroke="green"
                    fill={currentState.stateType === StateType.ATOMIC ? "#33333355" : "#33333355"}
                    ref={nodeRef}
                    onTransform={() => {
                        const node = nodeRef.current;
                        updateState(Math.round(node!.height() * node!.scaleY() / 25) * 25, Math.round(node!.width() * node!.scaleX() / 25) * 25)
                        node!.scaleX(1);
                        node!.scaleY(1);
                    }}
                />
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    rotateEnabled={false}
                    anchorStyleFunc={(a) => {
                        a.cornerRadius(10)
                        a.fill('red');
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
                    currentState.childStates.map(it =>
                        <RenderState data={data} setData={setData} renderStateId={it.id} key={it.id}/>
                    )
                }
            </Group>
        )
    } else {
        return null
    }
}

function findState(states: StateData[], renderId: string): StateData | undefined {
    let state = states.find(it => it.id === renderId)
    if (state)
        return state
    for (let i = 0; i < states.length; i++) {
        const childState = findState(states[i].childStates, renderId)
        if (childState) {
            state = childState;
            break;
        }
    }
    if (state)
        return state

    console.error(`could not find state ${renderId}`)
    return undefined
}