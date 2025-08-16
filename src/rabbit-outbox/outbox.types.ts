export interface OutboxMessage {
    exchange: string;
    routingKey: string;
    body: any;
    headers?: Record<string, any>;
    contentType?: string;
  }