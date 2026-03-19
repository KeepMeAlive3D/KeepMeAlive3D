import { useParams } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useEffect, useState } from "react";
import { getTraceAnalytics, type TraceTransitionAnalyzeData } from "@/scene/dt/eventlogs/trace/analyze/data.ts";

export function TraceStateMachineAnalyze() {
  const { dtId, refId, traceName, scId } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TraceTransitionAnalyzeData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getTraceAnalytics(Number(dtId), Number(refId), Number(scId), traceName ?? "");
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refId, scId, traceName]);

  return(
    <div className="m-3">
      <Table>
        <TableCaption>A list of traces found in the event log. {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}</TableCaption>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[250px]">State Name</TableHead>
            <TableHead>Previous State</TableHead>
            <TableHead>Correlated Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data.map(it =>
              <TableRow key={it.state + it.executionDuration}>
                <TableCell>{it.state}</TableCell>
                <TableCell>{it.previousState}</TableCell>
                <TableCell>{it.correlationEvent}</TableCell>
                <TableCell></TableCell>
                <TableCell>{it.executionDuration}</TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  )
}