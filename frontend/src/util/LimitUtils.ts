import { ComponentLimit } from "@/slices/ModelPartSlice.ts";
import { Object3D, Vector3, Vector3Like } from "three";


export function getLocalPositionBetweenLimits(object: Object3D, limits: ComponentLimit[], percentage: number): Vector3 | undefined {

  const { defaultLowerWorldPosition, defaultUpperWorldPosition } = getLowerAndUpperLimitDefaultWorldPosition(limits);

  console.debug("Vecs:");
  console.debug(defaultUpperWorldPosition);
  console.debug(defaultLowerWorldPosition);

  const step = defaultUpperWorldPosition.sub(defaultLowerWorldPosition).multiplyScalar(percentage / 100.0);
  console.debug("Step:");
  console.debug(step);
  roundVector(step);

  const objWorld = new Vector3();
  object.getWorldPosition(objWorld);
  console.debug("Current world position:");
  console.debug(objWorld);

  console.debug("Current local position:");
  console.debug(object.position);


  const newPosition = defaultLowerWorldPosition.add(step);

  console.debug("New world position:");
  console.debug(newPosition);

  const targetLocalPosition = object.parent?.worldToLocal(newPosition);
  console.debug("New local position:");
  console.debug(targetLocalPosition);

  return targetLocalPosition;
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
export function parseLimits(object: Object3D): ComponentLimit[] {
  const limitObjects = object.children.filter(x => x.name.startsWith("limit_"));

  return limitObjects.map(x => parseLimit(x)).filter(x => x != null);
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
  };
}

/**
 * Converts and Vector3Like to an actual Vector3
 */
function vector3FromVector3Like(vector: Vector3Like): Vector3 {
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