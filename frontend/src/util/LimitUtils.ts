import { Object3D, Quaternion, Scene, Vector3 } from "three";

/**
 * Sets the parents of the empty limit objects of currentObject to the parent
 * of currentObject (effectively pulls them up to the same level).
 *
 * Also sets the userData 'target' key to the currentObject uuid.
 */
export function pullLimitsUp(currentObject: Object3D, scene: Scene) {
  const limits = currentObject.children.filter(x => x.name.startsWith("limit_move_") || x.name.startsWith("limit_rot_"));
  limits.forEach(limit => pullLimitUp(currentObject, limit, scene));
}

function pullLimitUp(currentObject: Object3D, limit: Object3D, scene: Scene) {
  const worldPosition = new Vector3();
  limit.getWorldPosition(worldPosition);

  limit.name = limit.name.replace("limit_", "limit" + limit.uuid + "_");

  const newParent = currentObject.parent ?? scene;

  newParent.attach(limit);
  limit.updateMatrix();
  limit.updateMatrixWorld(true);

  limit.userData["target"] = currentObject.uuid;

  return;
}

/**
 * Returns the animation of the object between its limits. The distance of the
 * new position will be #percentage between lower and upper limit.
 * Either returns a Vector3 for movement of Quaternion for rotation events.
 */
export function getAnimation(object: Object3D, scene: Scene, percentage: number): Vector3 | Quaternion {
  const { upper, lower } = getUpperAndLowerLimit(object, scene);

  if (upper.name.endsWith("_max") && lower.name.endsWith("_min")) {
    return getRotationByLimits(object, scene, upper, lower, percentage);
  } else {
    return getPositionByLimits(object, scene, upper, lower, percentage);
  }
}

function getRotationByLimits(object: Object3D, scene: Scene, upperLimit: Object3D, lowerLimit: Object3D, percentage: number): Quaternion {
  const upperWorldRotation = new Quaternion();
  const lowerWorldRotation = new Quaternion();

  upperLimit.getWorldQuaternion(upperWorldRotation);
  lowerLimit.getWorldQuaternion(lowerWorldRotation);


  const step = lowerWorldRotation.clone().slerp(upperWorldRotation, percentage);

  const worldTransformationMatrix = new Quaternion();
  (object.parent ?? scene).getWorldQuaternion(worldTransformationMatrix).invert();

  return step.multiply(worldTransformationMatrix);
}

function getPositionByLimits(object: Object3D, scene: Scene, upperLimit: Object3D, lowerLimit: Object3D, percentage: number): Vector3 {

  const currentLowerWorldPosition = new Vector3();
  const currentUpperWorldPosition = new Vector3();

  upperLimit.getWorldPosition(currentUpperWorldPosition);
  lowerLimit.getWorldPosition(currentLowerWorldPosition);

  const targetLocation = currentLowerWorldPosition.lerp(currentUpperWorldPosition, percentage);

  // The position is returned in the local coordinates space of the parent
  return (object.parent ?? scene).worldToLocal(targetLocation);
}

/**
 * Returns the upper and lower limit of the currentObject.
 * The corresponding limits are determined by the user data key 'target' matching
 * the uuid of the currentObject.
 */
function getUpperAndLowerLimit(currentObject: Object3D, scene: Scene) {
  const limits = (currentObject.parent ?? scene).children.filter(node => {
    return Object.keys(node.userData).length > 0 && node.userData["target"] && node.userData["target"] === currentObject.uuid;
  });

  if (!limits || limits.length != 2) {
    throw new Error("Did not find two limits for object " + currentObject.name);
  }

  const upper = limits.find(x => x.name.endsWith("_up") || x.name.endsWith("_max"));
  const lower = limits.find(x => x.name.endsWith("_down") || x.name.endsWith("_min"));

  if (!upper || !lower) {
    throw new Error("Did not find upper and lower limit for object " + currentObject.name);
  }

  return {
    upper: upper,
    lower: lower,
  };
}