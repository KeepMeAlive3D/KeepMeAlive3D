import {useEffect, useRef, useState} from "react";
import {Layer, Stage} from "react-konva";
import {sampleStateData} from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";
import {RenderState} from "@/scene/dt/participant/stateMachine/canvas/RenderState.tsx";

export function StateMachineCanvas() {
    const divRef = useRef<HTMLDivElement>(null)
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    })
    const [sm, setSm] = useState(sampleStateData)

    useEffect(() => {
        const handleResize = () => {
            if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
                setDimensions({
                    width: divRef.current.offsetWidth,
                    height: divRef.current.offsetHeight
                })
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return (
        <div ref={divRef}
             className="relative flex-1 h-full overflow-hidden bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
            <Stage width={dimensions.width} height={dimensions.height} className="w-full">
                <Layer>
                    <RenderState data={sm} setData={setSm} renderStateId={sm.states[0].id}/>
                </Layer>
            </Stage>
        </div>
    )
}