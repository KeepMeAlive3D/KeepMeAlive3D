import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { type EventLogInfo, getSpecificEventLog } from "@/scene/dt/eventlogs/data.ts";

export function TracesOverviewHeader() {
  const { logId, dtId, refId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EventLogInfo>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getSpecificEventLog(Number(dtId), Number(refId), Number(logId));
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, logId, refId]);

  if (loading) {
    return (
      <h2 className="text-xl font-semibold m-4">
        Digital Twin
        {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}
      </h2>
    );
  } else {
    return (
      <h2 className="text-xl font-semibold m-4 flex flex-row">
        Process Log
        <span className="ml-2 ext-blue-600 dark:text-sky-400">{data?.eventLog?.name}</span>
      </h2>
    );
  }
}