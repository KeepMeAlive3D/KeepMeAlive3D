import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { type EventLog, getEventLog } from "@/scene/dt/eventlogs/data.ts";

export function TracesOverviewHeader() {
  const { logId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EventLog>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getEventLog(Number(logId));
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [logId]);

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
        <span className="ml-2 ext-blue-600 dark:text-sky-400">{data?.name}</span>
      </h2>
    );
  }
}