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

export interface RelativePositionEventMessage extends GenericEventMessage {
  manifest: Manifest;
  message: RelativePositionMessageData;
}

export interface RelativePositionMessageData extends GenericMessageData {
  topic: string;
  dataSource: string;
  percentage: number;
}

export interface Vector {
  x: number;
  y: number;
  z: number;
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
  ANIMATION_RELATIVE = "ANIMATION_RELATIVE",
  ERROR = "ERROR",
  SUBSCRIBE_TOPIC = "SUBSCRIBE_TOPIC",
}
