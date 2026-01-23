import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { type EventLogInfo, getEventLog } from "@/scene/dt/eventlogs/data.ts";
import { Spinner } from "@/components/ui/spinner.tsx";

export function TraceReplayInspectHeader() {
  const { logId, dtId, traceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EventLogInfo>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getEventLog(Number(dtId), Number(logId));
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, logId]);

  if (loading) {
    return (
      <h2 className="text-xl font-semibold m-4">
        Inspect Trace { traceName }
        {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
      </h2>
    );
  } else {
    return (
      <h2 className="text-xl font-semibold m-4 flex flex-row">
        Inspect Trace  <span className="mr-2 ml-2 ext-blue-600 dark:text-sky-400">{traceName}</span> of process Log
        <span className="ml-2 ext-blue-600 dark:text-sky-400">{data?.eventLog?.name}</span>
      </h2>
    );
  }
}