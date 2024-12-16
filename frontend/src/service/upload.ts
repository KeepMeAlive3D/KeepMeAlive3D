import service from "@/service/service.ts";

export function uploadFile(directory: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return service.post(`/api/model/${directory}`, formData)
}