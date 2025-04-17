import { RootState, useFrame, useThree } from "@react-three/fiber";
// @ts-expect-error Source is javascript
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// @ts-expect-error Source is javascript
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { Object3D, Scene, Vector2 } from "three";
import { useEffect, useRef } from "react";
// @ts-expect-error Source is javascript
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { OutlineState, selectOutline, setOutlinedObject } from "@/slices/OutlineSlice.ts";
import { ModelPartState } from "@/slices/ModelPartSlice";
import { ReplayState } from "@/slices/ReplaySlice";
import { SettingsState } from "@/slices/SettingsSlice";
import { ThunkDispatch, UnknownAction, Dispatch } from "@reduxjs/toolkit";

function OutlineObjects() {
  const state = useThree();
  const canvas = state.gl.domElement;
  const composerRef = useRef<EffectComposer>();
  const outlinePassRef = useRef<OutlinePass>();
  const outlinedObjectId = useAppSelector(selectOutline);
  const dispatch = useAppDispatch();

  // Take the objects from the slice. Find by id and outline.
  useEffect(() => {
    if (outlinedObjectId.id) {
      const object3d = state.scene.getObjectById(outlinedObjectId.id);

      if (object3d) {
        // Highlight
        outlinePassRef.current.selectedObjects = [object3d];
      }
    }
  }, [outlinedObjectId.id, state.scene]);

  useEffect(() => {
    const composer = new EffectComposer(state.gl);
    composerRef.current = composer;

    const renderPass = new RenderPass(state.scene, state.camera);
    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(
      new Vector2(state.size.width, state.size.height),
      state.scene,
      state.camera,
    );
    composer.addPass(outlinePass);
    outlinePassRef.current = outlinePass;

    canvas.addEventListener("click", () => OnClick(state, dispatch));
  }, [state, canvas, dispatch]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}

function OnClick(state: RootState, dispatch: ThunkDispatch<{
  modelParts: ModelPartState;
  settings: SettingsState;
  replay: ReplayState;
  outline: OutlineState;
}, undefined, UnknownAction> & Dispatch<UnknownAction>) {
  const matched = state.raycaster.intersectObjects(state.scene.children);


  if (matched.length > 0) {
    const first = matched[0];
    const rootObject = getRootObject(first.object);

    dispatch(setOutlinedObject(rootObject.id));
  }
}

// Returns the root object which has custom annotations or otherwise the object
// the initial object.
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

export default OutlineObjects;
