import DynamicModel from "@/scene/DynamicModel.tsx";
import { Suspense, useEffect, useState } from "react";
import { downloadModel } from "@/service/upload.ts";
import { useLocation, useParams } from "react-router";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { fetchAndSetModelSettings } from "@/slices/SettingsSlice.ts";
import { LoadingSpinner } from "@/components/custom/loading-spinner.tsx";
import ReplayIndicator from "@/components/custom/replay-indicator.tsx";

function Edit() {
  const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { modelId } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const refresh = location.state?.refresh;

  useEffect(() => {
    if (modelId !== undefined) {
      setLoading(true);
      downloadModel(Number(modelId)).then((response) => {
        setModelUrl(URL.createObjectURL(response.data));
        setTimeout(() => {
          dispatch(fetchAndSetModelSettings({ modelId: Number(modelId) }));
        }, 1000);
        setLoading(false);
      });
    }
  }, [dispatch, modelId, refresh]);

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center">
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          <LoadingSpinner loading={true} className="mr-2" /> Loading...
        </div>
      </div>
    );
  } else {
    return (
      <div className="edit-content flex flex-col h-auto">
        <div className="canvas-content flex-grow">
          {modelUrl && (
            <Suspense>
              <ReplayIndicator></ReplayIndicator>
              <DynamicModel objectUrl={modelUrl} />
            </Suspense>
          )}
        </div>
      </div>
    );
  }
}

export default Edit;
