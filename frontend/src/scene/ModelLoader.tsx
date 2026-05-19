import DynamicModel from "@/scene/DynamicModel.tsx";
import { Suspense, useEffect, useState } from "react";
import { downloadModel } from "@/service/upload.ts";
import { useLocation, useParams } from "react-router";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { fetchAndSetModelSettings } from "@/redux/slices/SettingsSlice.ts";
import { LoadingSpinner } from "@/components/custom/loading-spinner.tsx";
import ReplayIndicator from "@/components/custom/replay-indicator.tsx";

function ModelLoader() {
  const [modelUrl, setModelUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { modelId } = useParams();
  const dispatch = useAppDispatch();
  const location = useLocation();
  // Used to load new model if URL is changed manually
  const refresh = location.state?.refresh;

  // Fetch model and model settings
  useEffect(() => {
    if (modelId !== undefined) {
      downloadModel(Number(modelId)).then((response) => {
        setModelUrl(URL.createObjectURL(response.data));
        setTimeout(() => {
          dispatch(fetchAndSetModelSettings({ modelId: Number(modelId) }));
        }, 1000);
        setLoading(false);
      });
    }
  }, [dispatch, modelId, refresh]);

  // Display loading indicator or if ready, the model
  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center">
        <div className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          <LoadingSpinner loading={true} /> Loading...
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

export default ModelLoader;
