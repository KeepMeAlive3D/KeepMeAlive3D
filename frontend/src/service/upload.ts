import service from "@/service/service.ts";

export function uploadFile(directory: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return service.post(`/api/model/upload/${directory}`, formData);
}

export function downloadModel(id: number) {
  return service.get<Blob>(
    `/api/model/${id}/download`,
    {
      responseType: "blob", // Set responseType for this request only
    },
  );
}

export function getRemoteModelNames() {
  return service.get<AvailModels>(`/api/models`);
}

export function getModelSettings(modelId: number) {
  return service.get<ModelSetting>(`/api/model/${modelId}/setting`);
}

export function updateModelSettings(modelId: number, lightIntensity: number, scale: number) {
  return service.put<ModelInfo>(`/api/model/${modelId}/setting`, {
    lightIntensity: lightIntensity,
    scale: scale,
  });
}

export function deleteModel(id: number) {
  return service.delete(
    `/api/model/${id}`,
  );
}


export type AvailModels = {
  files: ModelInfo[];
};

export type ModelSetting = {
  lightIntensity: number;
  scale: number;
}

export type ModelInfo = {
  modelId: number
  model: string;
  filename: string;
};
