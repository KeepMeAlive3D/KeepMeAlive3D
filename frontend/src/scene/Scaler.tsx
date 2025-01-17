import {useThree} from "@react-three/fiber";
import {useAppSelector} from "@/hooks/hooks.ts";


function Scaler() {

    const state = useThree();
    const componentInfos = useAppSelector((state) => state.modelParts.partIds);

    for (const componentInfo of componentInfos) {
        const component = state.scene.getObjectById(componentInfo.id);

        // If model not loaded, component will not be found
        if (component) {
            if (componentInfo.isSelected) {
                component.scale.set(1.2, 1.2, 1.2);
            } else {
                component.scale.set(1, 1, 1);
            }

        }
    }


    return null;
}

export default Scaler;