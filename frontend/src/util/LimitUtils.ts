import { ComponentLimit } from "@/slices/ModelPartSlice.ts";
import { Object3D, Vector3, Vector3Like } from "three";


export function getLocalStep(object: Object3D, limits: ComponentLimit[], percentage: number): Vector3 | undefined {

  const { lowerWorldPosition, upperWorldPosition } = getLowerAndUpperLimit(limits);

  console.debug("Vecs:");
  console.debug(upperWorldPosition);
  console.debug(lowerWorldPosition);

  const step = upperWorldPosition.sub(lowerWorldPosition).multiplyScalar(percentage / 100.0);
  console.debug("Step:");
  console.debug(step);
  roundVector(step);

  const objWorld = new Vector3();
  object.getWorldPosition(objWorld);
  console.debug("Current world position:");
  console.debug(objWorld);

  console.debug("Current local position:");
  console.debug(object.position);


  const newPosition = lowerWorldPosition.add(step);

  console.debug("New world position:");
  console.debug(newPosition);

  const targetLocalPosition = object.parent?.worldToLocal(newPosition);
  console.debug("New local position:");
  console.debug(targetLocalPosition);

  return targetLocalPosition;
}

export function getLowerAndUpperLimit(limits: ComponentLimit[]) {

  const vector1 = vector3FromVector3Like(limits[0].defaultWorldPosition);
  const vector2 = vector3FromVector3Like(limits[1].defaultWorldPosition);

  if (vector1.length() > vector2.length()) {
    return {
      lowerWorldPosition: vector2,
      upperWorldPosition: vector1,
    }
  } else {
    return {
      lowerWorldPosition: vector1,
      upperWorldPosition: vector2,
    }
  }
}

/**
 * Searches the passed object for children which represent a limit for this object. The positions are parsed and stored
 * in a ComponentLimit object. The notation of limit objects is noted in the documentation.
 */
export function parseLimits(object: Object3D): ComponentLimit[] {
  const limitObjects = object.children.filter(x => x.name.startsWith("limit_"));

  return limitObjects.map(x => parseLimit(x)).filter(x => x != null);
}

/**
 * Converts and Vector3Like to an actual Vector3
 */
export function vector3FromVector3Like(vector: Vector3Like): Vector3 {
  return new Vector3(vector.x, vector.y, vector.z);
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

function parseLimit(object: Object3D): ComponentLimit | undefined {

  const worldPosition = new Vector3();
  object.getWorldPosition(worldPosition);

  return {
    name: object.name,
    defaultWorldPosition: {
      x: worldPosition.x,
      y: worldPosition.y,
      z: worldPosition.z,
    },
  }
}