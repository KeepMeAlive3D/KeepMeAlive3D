import { ComponentLimit } from "@/slices/ModelPartSlice.ts";
import { Object3D, Quaternion, QuaternionLike, Vector3, Vector3Like } from "three";


export type LimitTuple = {
  upper: ComponentLimit;
  lower: ComponentLimit;
}

export function getRotationByLimits(object: Object3D, limits: LimitTuple, percentage: number): Quaternion {
  const lower = getQuaternion(limits.lower.defaultWorldRotation);
  const upper = getQuaternion(limits.upper.defaultWorldRotation);


  const step = lower.clone().slerp(upper, percentage / 100.0);
  const target = lower.clone().multiply(step);

  const worldTransformationMatrix = new Quaternion();
  object.parent!.getWorldQuaternion(worldTransformationMatrix).invert();

  return target.multiply(worldTransformationMatrix);
}

export function getLocalPositionBetweenLimits(object: Object3D, limits: ComponentLimit[], percentage: number): Vector3 | undefined {
  const { defaultLowerWorldPosition, defaultUpperWorldPosition } = getLowerAndUpperLimitDefaultWorldPosition(limits);
  const step = defaultUpperWorldPosition.sub(defaultLowerWorldPosition).multiplyScalar(percentage / 100.0);

  // Rounding the vector is needed as there is a small different between the coordinates which is not there in blender
  roundVector(step);

  const objWorld = new Vector3();
  object.getWorldPosition(objWorld);

  // Adding the step on the lower limit of the animation results in the new position
  const newPosition = defaultLowerWorldPosition.add(step);

  // The position is returned in the local coordinates space of the parent
  return object.parent?.worldToLocal(newPosition);
}

/**
 * Selects from the given limit the lower and upper limit. It is determined by the length of the vector.
 */
function getLowerAndUpperLimitDefaultWorldPosition(limits: ComponentLimit[]) {
  const vector1 = vector3FromVector3Like(limits[0].defaultWorldPosition);
  const vector2 = vector3FromVector3Like(limits[1].defaultWorldPosition);

  if (vector1.length() > vector2.length()) {
    return {
      defaultLowerWorldPosition: vector2,
      defaultUpperWorldPosition: vector1,
    }
  } else {
    return {
      defaultLowerWorldPosition: vector1,
      defaultUpperWorldPosition: vector2,
    }
  }
}

/**
 * Searches the passed object for children which represent a limit for this object. The positions are parsed and stored
 * in a ComponentLimit object. The notation of limit objects is noted in the documentation.
 */
export function parseLimits(object: Object3D): LimitTuple {
  const limitObjects = object.children.filter(x => x.name.startsWith("limit_"));

  const limits = limitObjects.map(x => parseLimit(x)).filter(x => x != null);

  const upper = limits.find(x => x.isUpperLimit);
  const lower = limits.find(x => !x.isUpperLimit);

  // TODO: some object do not have limits

  return {
    upper: upper,
    lower: lower,
  };
}

function parseLimit(object: Object3D): ComponentLimit | undefined {
  const worldPosition = new Vector3();
  object.getWorldPosition(worldPosition);

  const worldRotation = new Quaternion();
  object.getWorldQuaternion(worldRotation);

  console.debug("Parsing name: " + object.name);

  return {
    name: object.name,
    isUpperLimit: object.name.endsWith("_up") || object.name.endsWith("_max"),
    defaultWorldPosition: {
      x: worldPosition.x,
      y: worldPosition.y,
      z: worldPosition.z,
    },
    defaultWorldRotation: {
      x: worldRotation.x,
      y: worldRotation.y,
      z: worldRotation.z,
      w: worldRotation.w,
    },
  };
}

/**
 * Converts and Vector3Like to an actual Vector3
 */
function vector3FromVector3Like(vector: Vector3Like): Vector3 {
  return new Vector3(vector.x, vector.y, vector.z);
}

function getQuaternion(quat: QuaternionLike): Quaternion {
  return new Quaternion(roundToDecimal(quat.x, 6), roundToDecimal(quat.y, 6), roundToDecimal(quat.z, 6), roundToDecimal(quat.w, 6));
}

/**
 * Rounds a vector to the 5th digit
 */
function roundVector(vector: Vector3) {
  vector.setX(roundToDecimal(vector.x, 5));
  vector.setY(roundToDecimal(vector.y, 5));
  vector.setZ(roundToDecimal(vector.z, 5));
}

function roundToDecimal(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}