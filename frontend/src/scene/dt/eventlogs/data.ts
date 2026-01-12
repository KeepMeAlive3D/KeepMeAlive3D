export interface EventLog {
  id: number;
  name: string;
  traces: EventLogTrace[];
}

export interface EventLogTrace {
  name: string;
  events: string[];
}

export function getEventLog(id: number): Promise<{ data: EventLog }> {
  return Promise.resolve({
    data: {
      id: id,
      name: "test",
      traces: [],
    },
  });
}