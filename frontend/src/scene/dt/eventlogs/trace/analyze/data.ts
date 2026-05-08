import service from "@/service/service.ts";

export interface TraceTransitionAnalyzeData {
  state: string,
  previousState: string,
  correlationEvent: string,
  isErrorState: boolean,
  isTransitionError: boolean,
  errorDetectedCycle: boolean,
  executionDuration: number,
  latencyInfo: TraceTransitionLatencyInfo,
  analysisFailed: boolean,
  executionTime: string,
  correlationId: string,
  cycleCount: number,
}

export enum TraceTransitionLatencyInfo {
  NORMAL = "NORMAL",
  SMALL_DEVIATION = "SMALL_DEVIATION",
  LARGE_DEVIATION = "LARGE_DEVIATION",
}

export function getTraceAnalytics(dt: number, refId: number, stateMachine: number, trace: string) {
  return service.get<TraceTransitionAnalyzeData[]>(`/api/dt/${dt}/log/${refId}/analyze/${stateMachine}/trace/${trace}`);
}