import { Link, useParams } from "react-router";
import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { File, Trash } from "lucide-react";
import { deleteEventLog, type EventLogInfo } from "@/scene/dt/eventlogs/data.ts";
import * as React from "react";
import type { SetStateAction } from "react";

export function EventLogCard({ data, setRefresh, refresh }: {
  data: EventLogInfo,
  setRefresh: React.Dispatch<SetStateAction<boolean>>
  refresh: boolean,
}) {
  const { dtId } = useParams();

  function del() {
    deleteEventLog(Number(dtId!), data.id).then(() => setRefresh(!refresh));
  }

  return (
    <Link to={`/dt/${dtId}/log/${data.id}`} className="w-full max-w-sm mx-2 my-4">
      <Card className="hover:bg-accent cursor-pointer min-h-25 flex-row">
        <File className="m-auto ml-5" />
        <h2 className="m-auto font-medium">{data.eventLog.name}</h2>
        <Button
          type="button"
          id={`delete-${data.id}`}
          className="col-span-1 my-auto mr-5 ml-auto"
          variant="destructive"
          onClick={e => {
            e.preventDefault();
            del();
          }}
        >
          <Trash />
        </Button>
      </Card>
    </Link>
  );
}