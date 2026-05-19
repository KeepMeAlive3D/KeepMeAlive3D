import { type BpInfoData, deleteBpmFile, getBpmFiles } from "@/scene/dt/bp/bpInfoData.ts";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Card } from "@/components/ui/card.tsx";
import { File, Plus, Trash, Workflow } from "lucide-react";
import { CreateBpDialogContent } from "@/scene/dt/bp/CreateBpDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link, useParams } from "react-router";
import { type SetStateAction, useEffect, useState } from "react";
import * as React from "react";
import { Spinner } from "@/components/ui/spinner.tsx";

export function BpInfo() {
  const [bpmData, setBpmData] = useState<BpInfoData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false)
  const { dtId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getBpmFiles(Number(dtId));
        if(response.data.length > 0) {
          setBpmData(response.data[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    // noinspection JSIgnoredPromiseFromCall
    fetchData();
  }, [dtId, refresh]);

  if (loading) {
    return <Spinner className="ml-2 my-auto size-5" />;
  } else  {
    return (
      <>
        <div className="max-width flex flex-row m-4 mb-0">
          <h2 className="text-lg font-semibold flex flex-row">
            <Workflow />
            <span className="ml-2">Business Process Model</span>
          </h2>
        </div>
        <div className="flex flex-wrap">
          <div className="mr-2"></div>
          <RenderBp data={bpmData} setData={setBpmData} refresh={refresh} setRefresh={setRefresh}/>
        </div>
      </>
    );
  }
}

function RenderBp({ data, setData, refresh, setRefresh }: {
  data: BpInfoData | undefined,
  setData: React.Dispatch<SetStateAction<BpInfoData | undefined>>,
  refresh: boolean,
  setRefresh: React.Dispatch<SetStateAction<boolean>>,
}) {
  const [open, setOpen] = useState(false);
  const { dtId } = useParams();
  if (data) {
    return (
      <Link to={`/dt/${data.dtId}/bp/${data.fileName}`} className="w-full max-w-sm mx-2 my-4">
        <Card className=" hover:bg-accent cursor-pointer min-h-25 flex-row">
          <File className="m-auto ml-5" />
          <h2 className="m-auto font-medium">{data.fileName}</h2>
          <Button
            type="button"
            id={`delete-${data.fileName}`}
            className="col-span-1 my-auto mr-5 ml-auto"
            variant="destructive"
            onClick={e => {
              e.preventDefault();
              deleteBpmFile(Number(dtId), data?.id).finally(() =>
                setData(undefined)
              )
            }}
          >
            <Trash />
          </Button>
        </Card>
      </Link>
    );
  } else {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="w-full max-w-sm mx-2 my-4 hover:bg-accent cursor-pointer min-h-25">
            <Plus className="m-auto" size={40} />
          </Card>
        </DialogTrigger>
        <CreateBpDialogContent setRefresh={setRefresh} refresh={refresh} setOpen={setOpen} />
      </Dialog>
    );
  }
}