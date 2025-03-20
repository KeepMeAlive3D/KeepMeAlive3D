import { RootState, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { Object3D, Scene, Vector2 } from "three";
import { useEffect, useRef } from "react";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

function ClickObjects() {
  const state = useThree();
  const canvas = state.gl.domElement;
  const composerRef = useRef<EffectComposer>();
  const outlinePassRef = useRef<OutlinePass>();

  useEffect(() => {
    const composer = new EffectComposer(state.gl);
    composerRef.current = composer;

    const renderPass = new RenderPass(state.scene, state.camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(new Vector2(state.size.width, state.size.height), state.scene, state.camera);
    composer.addPass(outlinePass);
    outlinePassRef.current = outlinePass;

    canvas.addEventListener("click", () => OnClick(state, outlinePass));
  }, [state, canvas]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);



  return null;
}

function OnClick(state: RootState, outlinePass: OutlinePass) {
  const matched = state.raycaster.intersectObjects(state.scene.children);

  if (matched.length > 0) {
    const first = matched[0];
    const rootObject = getRootObject(first.object);

    // Highlight
    outlinePass.selectedObjects = [rootObject];
  }
}

function getRootObject(object: Object3D): Object3D {
  let obj = object;
  while (obj.parent && !(obj.parent instanceof Scene)) {
    obj = obj.parent;

    if (Object.keys(obj.userData).length > 0 && obj.userData["topic"]) {
      return obj;
    }
  }

  return object;
}


export default ClickObjects;
