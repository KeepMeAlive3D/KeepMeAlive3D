import { Link, useParams } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useEffect, useState } from "react";
import { type EventLogInfo, getEventLog } from "@/scene/dt/eventlogs/data.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { CircleArrowRight, CircleStop, Search } from "lucide-react";

export function TraceOverview() {
  const { dtId, logId } = useParams();
  const [loading, setLoading] = useState(false);
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

  return (<main className="w-full m-5 overflow-hidden rounded-lg border">
    <Table>
      <TableCaption>A list of traces found in the event log. {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}</TableCaption>
      <TableHeader className="bg-muted sticky top-0 z-10">
        <TableRow>
          <TableHead className="w-[250px]">Trace Name</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.eventLog?.traces?.map(it => (
          <TableRow key={it.name}>
            <TableCell>{it.name}</TableCell>
            <TableCell>{it.events.length}</TableCell>
            <TableCell><Badge variant="secondary">Active Replay</Badge></TableCell>
            <TableCell className="flex flex-row">
              <div className="grow"></div>
              <Button variant="destructive" className="cursor-pointer"><CircleStop/></Button>
              <Button variant="outline" className="ml-2 cursor-pointer"><CircleArrowRight/></Button>
              <Link to={`/dt/${dtId}/log/${logId}/trace/${it.name}`} className="cursor-pointer">
                <Button variant="outline" className="ml-2 cursor-pointer">
                  <Search/>
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </main>);
}