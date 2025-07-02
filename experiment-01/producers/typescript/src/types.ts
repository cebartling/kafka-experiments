export interface ProducerMessage {
  key?: string;
  value: string | object;
  partition?: number;
  headers?: Record<string, string>;
  timestamp?: string;
}
