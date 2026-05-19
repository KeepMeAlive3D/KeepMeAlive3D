import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner.tsx";
import { type DigitalTwinInfo, getDigitalTwin } from "@/scene/home/digitalTwinInfo.ts";
import { GetDigitalTwinIcon } from "@/scene/home/DigitalTwinsOverviewCard.tsx";

export function DigitalTwinOverviewHeader() {
  const { dtId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DigitalTwinInfo>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getDigitalTwin(Number(dtId));
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId]);

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
        Digital Twin
        <span className="ml-2 ext-blue-600 dark:text-sky-400">{data?.name}</span>
        <GetDigitalTwinIcon iconId={data?.icon ?? 0} className="m-auto ml-5" />
      </h2>
    );
  }
}