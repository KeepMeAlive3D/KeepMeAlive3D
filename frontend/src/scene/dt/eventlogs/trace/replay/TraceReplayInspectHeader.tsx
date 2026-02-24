import { useParams } from "react-router";

export function TraceReplayInspectHeader() {
  const { traceName } = useParams();
  return (
    <h2 className="text-xl font-semibold m-4 flex flex-row">
      Inspect Trace <span className="mr-2 ml-2 ext-blue-600 dark:text-sky-400">{traceName}</span>
    </h2>
  );
}