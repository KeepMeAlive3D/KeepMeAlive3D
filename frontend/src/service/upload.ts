import service from "@/service/service.ts";

export function uploadFile(directory: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return service.post(`/api/model/${directory}`, formData)
}

export function downloadModel(model: string, filename: string) {
    service.defaults.responseType = "blob"
    return service.post<Blob>(`/api/model/download`, {
        model: model,
        filename: filename
    })
}