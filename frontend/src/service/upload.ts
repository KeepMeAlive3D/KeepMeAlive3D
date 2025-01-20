import service from "@/service/service.ts";

export function uploadFile(directory: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return service.post(`/api/model/upload/${directory}`, formData)
}

export function downloadModel(model: string, filename: string) {
    return service.post<Blob>(`/api/model/download`, {
        model: model,
        filename: filename
    }, {
        responseType: "blob", // Set responseType for this request only
    });
}

export function getRemoteModelNames() {
    return service.get<AvailModels>(`/api/models`)
}

export type AvailModels = {
    files: ModelInfo[]
}

export type ModelInfo = {
    model: string,
    filename: string
}