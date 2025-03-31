import { ComponentLimit, LimitType, Vector3State } from "@/slices/ModelPartSlice.ts";
import { Object3D, Vector3 } from "three";


export function getStepByLimits(upper: ComponentLimit, lower: ComponentLimit, percentage: number): Vector3 {
  return vectorFromStateVector(upper.limit).sub(vectorFromStateVector(lower.limit)).multiplyScalar(percentage / 100.0);
}

export function parseLimits(object: Object3D): ComponentLimit[] {
  const limits = Object.keys(object.userData).filter(x => x.startsWith("limit_"));

  return limits.map(x => parseLimit(x, object.userData[x])).filter(x => x != null);
}

export function vectorFromStateVector(vector: Vector3State): Vector3 {
  return new Vector3(vector.x, vector.y, vector.z);
}

export function mergeVectors(primary: Vector3, secondary: Vector3): Vector3 {
  return new Vector3(
    secondary.x !== 0 ? secondary.x : primary.x,
    secondary.y !== 0 ? secondary.y : primary.y,
    secondary.z !== 0 ? secondary.z : primary.z,
  );
}

function parseLimit(limitName: string, content: string): ComponentLimit | undefined {
  switch (limitName) {
    case "limit_y_up":
      return {
        limitType: LimitType.UPPER,
        limit: { x: 0, y: parseFloat(content), z: 0 },
      } as ComponentLimit;

    case "limit_y_down":
      return {
        limitType: LimitType.LOWER,
        limit: { x: 0, y: parseFloat(content), z: 0 },
      } as ComponentLimit;
    case "limit_z_up":
      return {
        limitType: LimitType.UPPER,
        limit: { x: 0, y: 0, z: parseFloat(content) },
      } as ComponentLimit;
    case "limit_z_down":
      return {
        limitType: LimitType.LOWER,
        limit: { x: 0, y: 0, z: parseFloat(content) },
      } as ComponentLimit;
  }
}