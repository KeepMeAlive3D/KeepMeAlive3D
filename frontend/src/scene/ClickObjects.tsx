import {RootState, useThree} from "@react-three/fiber";


function ClickObjects() {
    const state = useThree();
    const canvas = state.gl.domElement;
    canvas.addEventListener('click', () => OnClick(state));

    return null;
}

function OnClick(state: RootState) {
    const matched = state.raycaster.intersectObjects(state.scene.children);


    if (matched.length > 0) {
        const first = matched[0];

        // Highlight
        first.object.scale.set(1.2, 1.2, 1.2);

        console.log("Clicked " + first.object.name);
    }
}


export default ClickObjects