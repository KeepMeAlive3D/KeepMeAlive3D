import { useParams } from "react-router";
import { Table, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";

export function TraceOverview() {
  const { dtId, logId } = useParams();
  return (<Table>
    <TableCaption>A list of traces found in the event log.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[250px]">Trace Name</TableHead>
        <TableHead>Events</TableHead>
        <TableHead>Execution Time</TableHead>
        <TableHead>Start Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Action</TableHead>
      </TableRow>
    </TableHeader>
  </Table>);
}