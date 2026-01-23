import type { EventLogEvent } from "@/scene/dt/eventlogs/data.ts";

export interface GenericEventMessage {
  manifest: Manifest;
  message: GenericMessageData;
}

export interface GenericMessageData {
  topic: string;
  dataSource: string;
}

export interface EventSubscribe {
  manifest: Manifest;
  message: EventMessageSubscribe;
}

export interface EventMessageSubscribe {
  topic: string;
}

export interface EventError extends GenericEventMessage {
  manifest: Manifest;
  message: EventErrorData;
}

export interface EventErrorData extends GenericMessageData {
  type: string;
  message: string;
  topic: string;
  dataSource: string;
}

export interface DataPointEventMessage extends GenericEventMessage {
  manifest: Manifest;
  message: DataPointMessageData;
}

export interface DataPointMessageData extends GenericMessageData {
  topic: string;
  dataSource: string;
  point: number;
}

export interface RelativePositionEventMessage extends GenericEventMessage {
  manifest: Manifest;
  message: RelativePositionMessageData;
}

export interface RelativePositionMessageData extends GenericMessageData {
  topic: string;
  dataSource: string;
  percentage: number;
}

export interface ReplayStart {
  manifest: Manifest;
  dtId: number;
  logId: number;
  trace: string;
}

export interface ReplayPauseEvent {
  manifest: Manifest;
  dtId: number;
  logId: number;
  trace: string;
}

export interface ReplayForwardEvent {
  manifest: Manifest;
  dtId: number;
  logId: number;
  trace: string;
}

export interface ReplayEnd {
  manifest: Manifest;
  dtId: number;
  logId: number;
  trace: string;
}

export interface NewSession {
  manifest: Manifest;
}

export interface StateTransitionInfo extends GenericEventMessage {
  manifest: Manifest;
  message: StateTransitionInfoData;
}

export interface StateTransitionInfoData extends GenericMessageData {
  from: string;
  to: string;
  topic: string;
  datasource: string;
  allEvents: EventLogEvent[];
}

export interface Manifest {
  version: number;
  messageType: MessageType;
  timestamp?: number | undefined;
  bearerToken?: string | undefined;
  uuid?: string | undefined;
}

export enum MessageType {
  TOPIC_DATAPOINT = "TOPIC_DATAPOINT",
  ANIMATION_RELATIVE = "ANIMATION_RELATIVE",
  ERROR = "ERROR",
  SUBSCRIBE_TOPIC = "SUBSCRIBE_TOPIC",
  REPLAY_START = "REPLAY_START",
  REPLAY_PAUSE = "REPLAY_PAUSE",
  REPLAY_END = "REPLAY_END",
  REPLAY_FORWARD = "REPLAY_FORWARD",
  STATE_TRANSITION = "STATE_TRANSITION"
}
