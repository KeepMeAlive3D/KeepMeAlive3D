import {Suspense} from 'react'
import {Canvas} from '@react-three/fiber'
import {
    OrbitControls,
    Grid,
} from '@react-three/drei'
import {Vector3} from "three";
import {Model} from "./Robot.tsx";

function Scene() {
    return <Canvas>
        <Suspense fallback={null}>
            <ambientLight color={"white"} intensity={1}></ambientLight>
            <Model scale={0.001}></Model>
            <OrbitControls/>

            <Grid cellSize={2} cellColor={"teal"} sectionColor={"darkgray"} sectionSize={2}
                  position={new Vector3(0, -2, 0)} infiniteGrid={true} fadeDistance={20}></Grid>
        </Suspense>
    </Canvas>
}

export default Scene