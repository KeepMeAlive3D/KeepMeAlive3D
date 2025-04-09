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

export interface PositionEventMessage extends GenericEventMessage {
  manifest: Manifest;
  message: PositionMessageData;
}

export interface PositionMessageData extends GenericMessageData {
  topic: string;
  dataSource: string;
  position: Vector;
}

export interface Vector {
  x: number;
  y: number;
  z: number;
}

export interface ReplayStart {
  manifest: Manifest;
  start?: number | undefined;
  stop?: number | undefined;
}

export interface ReplayStop {
  manifest: Manifest;
}

export interface Manifest {
  version: number;
  messageType: MessageType;
  timestamp?: number | undefined;
  bearerToken?: string | undefined;
}

export enum MessageType {
  TOPIC_DATAPOINT = "TOPIC_DATAPOINT",
  ANIMATION_POSITION = "ANIMATION_POSITION",
  ERROR = "ERROR",
  SUBSCRIBE_TOPIC = "SUBSCRIBE_TOPIC",
  REPLAY_START = "REPLAY_START",
  REPLAY_STOP = "REPLAY_STOP",
}
