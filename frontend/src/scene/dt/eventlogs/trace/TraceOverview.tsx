import { Link, useParams } from "react-router";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useEffect, useState } from "react";
import { type EventLogInfo, getSpecificEventLog, setHappyPath } from "@/scene/dt/eventlogs/data.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox.tsx";

export function TraceOverview() {
  const { dtId, logId, refId } = useParams();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
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
  }, [dtId, logId, refId, refresh]);

  function updateHappyPath(trace: string, isHappyPath: boolean) {
    setLoading(true)
    setHappyPath(Number(dtId), Number(refId), trace, isHappyPath).then().finally(() => {
      setLoading(false)
      setRefresh(!refresh)
    })
  }

  return (<main className="w-full m-5 overflow-hidden rounded-lg border">
    <Table>
      <TableCaption>A list of traces found in the event log. {loading ? <Spinner className="ml-2 my-auto size-5" /> : null}</TableCaption>
      <TableHeader className="bg-muted sticky top-0 z-10">
        <TableRow>
          <TableHead className="w-[250px]">Trace Name</TableHead>
          <TableHead>Events</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Happy Path</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.eventLog?.traces?.map(it => (
          <TableRow key={it.name}>
            <TableCell>{it.name}</TableCell>
            <TableCell>{it.events.length}</TableCell>
            <TableCell><Badge variant="secondary">Active Replay</Badge></TableCell>
            <TableCell><div className="flex flex-row"><Checkbox checked={it.isHappyPath} onClick={() => updateHappyPath(it.name, !it.isHappyPath)}/><p className="ml-3">Is happy Path</p></div></TableCell>
            <TableCell className="flex flex-row">
              <div className="grow"></div>
              <Link to={`/dt/${dtId}/log/${refId}/trace/${it.name}`} className="cursor-pointer">
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